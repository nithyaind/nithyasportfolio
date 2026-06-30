/**
 * audio/engine.js
 * Web Audio API chord synthesiser.
 *
 * Each "string" is a sawtooth oscillator → BiquadFilter → GainNode → output.
 * Strings are staggered in time to mimic a real strum.
 */

import { CHORD_NOTES } from './chords.js';

const STRUM_DELAY_S   = 0.018;  // seconds between each string on a strum
const ATTACK_S        = 0.04;   // gain ramp-up time
const SUSTAIN_FACTOR  = 0.45;   // sustain level relative to peak
const SUSTAIN_DECAY_S = 0.4;    // time constant for decay to sustain
const RELEASE_S       = 0.05;   // time constant for note-off fade

let audioCtx   = null;
let voiceNodes = [];  // [{ osc, gainNode }]
let currentChordName = null;
let isActive = false;

/** Lazily create the AudioContext (must happen after a user gesture). */
function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/** Kill all active oscillators with a short release fade. */
export function stopChord() {
  if (!voiceNodes.length) return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  voiceNodes.forEach(({ gainNode, osc }) => {
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setTargetAtTime(0, now, RELEASE_S);
    setTimeout(() => { try { osc.stop(); } catch (_) {} }, 300);
  });
  voiceNodes = [];
  isActive = false;
  currentChordName = null;
}

/**
 * Begin playing a chord.
 * @param {string} chordName  - key from CHORD_NOTES
 * @param {number} velocity   - 0..1, controls attack volume
 */
export function playChord(chordName, velocity = 0.5) {
  const notes = CHORD_NOTES[chordName];
  if (!notes) return;

  // If same chord is already sounding, re-strum it instead
  if (currentChordName === chordName && isActive) {
    restrum(velocity);
    return;
  }

  stopChord();

  const ctx = getCtx();
  currentChordName = chordName;
  isActive = true;

  const peakVol  = Math.min(0.85, 0.3 + velocity * 0.55) / notes.length;
  const sustainV = peakVol * SUSTAIN_FACTOR;
  const now = ctx.currentTime;

  notes.forEach((freq, i) => {
    const t0     = now + i * STRUM_DELAY_S;
    const filter = ctx.createBiquadFilter();
    const gain   = ctx.createGain();
    const osc    = ctx.createOscillator();

    filter.type            = 'lowpass';
    filter.frequency.value = Math.min(4000, 1800 + freq * 2.5);
    filter.Q.value         = 0.7;

    osc.type           = 'sawtooth';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(peakVol, t0 + ATTACK_S);
    gain.gain.setTargetAtTime(sustainV, t0 + ATTACK_S, SUSTAIN_DECAY_S);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);

    voiceNodes.push({ osc, gainNode: gain });
  });
}

/**
 * Re-attack the currently-held chord (right-hand strum gesture).
 * @param {number} velocity  0..1
 */
export function restrum(velocity = 0.5) {
  if (!isActive || !voiceNodes.length) return;
  const ctx  = getCtx();
  const now  = ctx.currentTime;
  const n    = voiceNodes.length;
  const peak = Math.min(0.85, 0.25 + velocity * 0.65) / n;

  voiceNodes.forEach(({ gainNode }, i) => {
    const t0 = now + i * STRUM_DELAY_S;
    gainNode.gain.cancelScheduledValues(t0);
    gainNode.gain.setValueAtTime(0, t0);
    gainNode.gain.linearRampToValueAtTime(peak, t0 + ATTACK_S);
    gainNode.gain.setTargetAtTime(peak * SUSTAIN_FACTOR, t0 + ATTACK_S, SUSTAIN_DECAY_S);
  });
}

export function getCurrentChord()  { return currentChordName; }
export function isChordActive()    { return isActive; }
