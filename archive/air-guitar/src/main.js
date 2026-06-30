/**
 * main.js
 * Application entry point.
 * Wires together: camera → hand tracker → audio engine → UI updates.
 */

import { startTracking, parseHands } from './hands/tracker.js';
import { drawOverlay }               from './hands/overlay.js';
import { playChord, stopChord, unlockAudio } from './audio/engine.js';
import { updateStrumVelocity, resetStrum } from './ui/strum.js';
import {
  videoEl, overlayCanvas,
  initChordSelects, getSelectedChord,
  updatePinchDots, updatePlayingCard, updateStrumBars,
  setStatus, startBtn,
} from './ui/dom.js';

// ── Init ──────────────────────────────────────────────────
initChordSelects();

let stopTracking = null;  // cleanup handle returned by startTracking

// ── Per-frame callback ────────────────────────────────────
function onHandResults(results) {
  // 1. Draw landmarks on the canvas overlay
  drawOverlay(overlayCanvas, videoEl, results);

  // 2. Parse hand state
  const { leftPinches, rightWristY } = parseHands(results);

  // 3. Calculate strum velocity from right-hand motion
  const velocity = updateStrumVelocity(rightWristY);

  // 4. Update strum visualiser
  const rightLandmarks = results.multiHandLandmarks?.find(
    (_, i) => results.multiHandedness?.[i]?.label === 'Left'
  ) ?? null;
  updateStrumBars(rightLandmarks, velocity);

  // 5. Determine which chord to play (first pinched finger wins)
  const pingedFinger = leftPinches.findIndex(Boolean);

  // 6. Update pinch dot UI
  updatePinchDots(leftPinches);

  // 7. Audio logic
  if (pingedFinger >= 0) {
    const chordName = getSelectedChord(pingedFinger);
    playChord(chordName, velocity);
    updatePlayingCard(pingedFinger);
  } else {
    // No fingers pinched — silence
    stopChord();
    updatePlayingCard(-1);
  }
}

// ── Camera start ──────────────────────────────────────────
startBtn.addEventListener('click', async () => {
  unlockAudio(); // must run synchronously inside the click handler to satisfy autoplay policy
  setStatus('Requesting camera access…', 'Starting…', true);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 },
    });

    videoEl.srcObject = stream;
    await videoEl.play();

    // Check MediaPipe globals loaded via CDN <script> tags
    const missing = ['Hands', 'Camera', 'drawConnectors', 'drawLandmarks']
      .filter(name => typeof window[name] === 'undefined');
    if (missing.length) {
      throw new Error(
        `MediaPipe failed to load (missing: ${missing.join(', ')}). ` +
        `Reload the page — if it persists, the CDN script tags in index.html may need version pinning.`
      );
    }

    stopTracking = await startTracking(videoEl, onHandResults);

    setStatus(
      'Show both hands — left for chords, right for strumming',
      'Camera on',
      true,
    );
  } catch (err) {
    console.error(err);
    setStatus(
      err.message.includes('MediaPipe')
        ? err.message
        : 'Camera access denied or unavailable.',
      'Start camera',
      false,
    );
    resetStrum();
  }
});

// ── Cleanup on page unload ────────────────────────────────
window.addEventListener('beforeunload', () => {
  stopChord();
  stopTracking?.();
});
