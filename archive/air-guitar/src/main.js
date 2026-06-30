/**
 * main.js — application entry point
 * Wires: camera → hand tracker → audio engine → UI
 *
 * Interaction model:
 *   Left hand  — pinch thumb+finger to hold a chord (sustains while pinched)
 *   Right hand — close fist to strum; each open→close triggers one re-attack
 */

import { startTracking, parseHands } from './hands/tracker.js';
import { drawOverlay }               from './hands/overlay.js';
import { playChord, restrum, stopChord, unlockAudio } from './audio/engine.js';
import {
  videoEl, overlayCanvas,
  initChordSelects, getSelectedChord,
  updatePinchDots, updatePlayingCard, updateFistIndicator,
  setStatus, startBtn,
} from './ui/dom.js';

initChordSelects();

let stopTracking    = null;
let lastPingedFinger = -1;
let lastFist        = false;

function onHandResults(results) {
  drawOverlay(overlayCanvas, videoEl, results);

  const { leftPinches, rightFist } = parseHands(results);
  const pingedFinger = leftPinches.findIndex(Boolean);

  updatePinchDots(leftPinches);
  updateFistIndicator(rightFist);

  // ── Chord logic ───────────────────────────────────────────
  if (pingedFinger >= 0) {
    const chordName   = getSelectedChord(pingedFinger);
    const justPinched = pingedFinger !== lastPingedFinger;
    const justFisted  = rightFist && !lastFist;

    if (justPinched) {
      // New pinch — immediately play the chord
      playChord(chordName, 0.7);
    } else if (justFisted) {
      // Fist closed while chord held — strum it
      restrum(0.8);
    }

    updatePlayingCard(pingedFinger);
  } else {
    stopChord();
    updatePlayingCard(-1);
  }

  lastPingedFinger = pingedFinger;
  lastFist         = rightFist;
}

startBtn.addEventListener('click', async () => {
  unlockAudio();
  setStatus('Requesting camera…', 'Starting…', true);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 },
    });
    videoEl.srcObject = stream;
    await videoEl.play();

    const missing = ['Hands', 'Camera', 'drawConnectors', 'drawLandmarks']
      .filter(n => typeof window[n] === 'undefined');
    if (missing.length) throw new Error(`MediaPipe not loaded: ${missing.join(', ')}`);

    stopTracking = await startTracking(videoEl, onHandResults);
    setStatus('Left hand = chord  ·  Right fist = strum', 'Camera on ✓', true);
  } catch (err) {
    console.error(err);
    setStatus(err.message, 'Start camera', false);
  }
});

window.addEventListener('beforeunload', () => {
  stopChord();
  stopTracking?.();
});
