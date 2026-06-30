/**
 * audio/engine.js
 * Guitar chord synthesiser using Web Audio API.
 *
 * Signal chain per string:
 *   OscillatorNode (sawtooth) → BiquadFilter (lowpass) → GainNode → destination
 *
 * Envelope mimics a plucked string: very fast attack, exponential decay.
 * Strings are staggered in time to simulate a pick stroke across strings.
 */

import { CHORD_NOTES } from './chords.js';

// Tuning constants
const STRUM_DELAY_S  = 0.014; // gap between each string during a strum
const ATTACK_S       = 0.005; // near-instant pluck attack
const DECAY_TC       = 0.55;  // exponential decay time constant (seconds)
const RELEASE_TC     = 0.06;  // fade time on chord release
const DETUNE_CENTS   = 5;     // per-string random detune for warmth

let audioCtx = null;
let voices   = [];            // { osc, gain }[]
let currentChord = null;
let isActive = false;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

export function unlockAudio() {
  getCtx();
}

export function stopChord() {
  if (!voices.length) return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  voices.forEach(({ gain, osc }) => {
    gain.gain.cancelScheduledValues(now);
    gain.gain.setTargetAtTime(0, now, RELEASE_TC);
    setTimeout(() => { try { osc.stop(); } catch (_) {} }, 400);
  });
  voices = [];
  isActive = false;
  currentChord = null;
}

/**
 * Build and start all string voices for a chord.
 * Called once per new chord; restrum() re-attacks the same voices.
 */
function buildVoices(chordName, velocity) {
  const ctx   = getCtx();
  const notes = CHORD_NOTES[chordName];
  const peak  = Math.min(0.9, 0.4 + velocity * 0.5) / notes.length;
  const now   = ctx.currentTime;

  notes.forEach((freq, i) => {
    const t0     = now + i * STRUM_DELAY_S;
    const osc    = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain   = ctx.createGain();

    osc.type            = 'sawtooth';
    osc.frequency.value = freq;
    osc.detune.value    = (Math.random() - 0.5) * 2 * DETUNE_CENTS;

    filter.type            = 'lowpass';
    filter.frequency.value = Math.min(5000, 2000 + freq * 3);
    filter.Q.value         = 0.5;

    // Plucked envelope: instant peak → exponential decay toward silence
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + ATTACK_S);
    gain.gain.setTargetAtTime(0.0001, t0 + ATTACK_S, DECAY_TC);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);

    voices.push({ osc, gain });
  });
}

/**
 * Play a chord (builds voices fresh).
 * @param {string} chordName
 * @param {number} velocity  0–1
 */
export function playChord(chordName, velocity = 0.6) {
  const notes = CHORD_NOTES[chordName];
  if (!notes) return;
  stopChord();
  currentChord = chordName;
  isActive = true;
  buildVoices(chordName, velocity);
}

/**
 * Re-strum the currently held chord — re-attacks the envelope
 * without rebuilding oscillators, so there's no click or gap.
 * @param {number} velocity  0–1
 */
export function restrum(velocity = 0.6) {
  if (!isActive || !voices.length || !currentChord) return;
  const ctx   = getCtx();
  const notes = CHORD_NOTES[currentChord];
  const peak  = Math.min(0.9, 0.4 + velocity * 0.5) / voices.length;
  const now   = ctx.currentTime;

  voices.forEach(({ gain }, i) => {
    const t0 = now + i * STRUM_DELAY_S;
    // Read current gain value before cancelling to avoid click
    const cur = gain.gain.value;
    gain.gain.cancelScheduledValues(t0);
    gain.gain.setValueAtTime(cur, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + ATTACK_S);
    gain.gain.setTargetAtTime(0.0001, t0 + ATTACK_S, DECAY_TC);
  });
}

export function getCurrentChord() { return currentChord; }
export function isChordActive()   { return isActive; }
