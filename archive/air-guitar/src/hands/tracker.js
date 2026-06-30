/**
 * hands/tracker.js
 * Wraps MediaPipe Hands + Camera utils.
 * Emits structured hand state on every frame via a callback.
 *
 * Coordinate system: normalised 0..1, origin top-left of the mirrored video.
 */

// ── Landmark indices ──────────────────────────────────────
export const THUMB_TIP   = 4;
export const FINGER_TIPS = [8, 12, 16, 20]; // index, middle, ring, pinky

/** Euclidean distance between two landmarks (normalised space). */
function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Determine whether the thumb is pinching a given finger tip.
 * Threshold is tuned for ~7% of frame width.
 */
export function isPinching(landmarks, tipIdx, threshold = 0.07) {
  return dist(landmarks[THUMB_TIP], landmarks[tipIdx]) < threshold;
}

/**
 * Extract hand state from a MediaPipe result set.
 * Returns { leftPinches: bool[4], rightWristY: number | null }
 *
 * Note: MediaPipe labels are from the *model's* perspective (mirror-flipped),
 * so "Right" from the model = user's left hand when the camera is mirrored.
 */
export function parseHands(results) {
  let leftPinches  = [false, false, false, false];
  let rightWristY  = null;

  if (!results.multiHandLandmarks) return { leftPinches, rightWristY };

  results.multiHandLandmarks.forEach((lm, i) => {
    const label = results.multiHandedness?.[i]?.label;

    // "Right" from model = user's left hand (chord hand)
    if (label === 'Right') {
      leftPinches = FINGER_TIPS.map(tip => isPinching(lm, tip));
    }

    // "Left" from model = user's right hand (strum hand)
    if (label === 'Left') {
      rightWristY = lm[0].y;
    }
  });

  return { leftPinches, rightWristY };
}

/**
 * Start the MediaPipe Hand tracking pipeline.
 *
 * @param {HTMLVideoElement}  videoEl   - live camera feed
 * @param {function}          onResults - called each frame with raw MP results
 * @returns {function}  cleanup function to stop tracking
 */
export async function startTracking(videoEl, onResults) {
  // MediaPipe globals loaded via CDN <script> tags in index.html
  const hands = new window.Hands({
    locateFile: f =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${f}`,
  });

  hands.setOptions({
    maxNumHands:            2,
    modelComplexity:        1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence:  0.6,
  });

  hands.onResults(onResults);

  const camera = new window.Camera(videoEl, {
    onFrame: async () => {
      await hands.send({ image: videoEl });
    },
    width:  640,
    height: 480,
  });

  await camera.start();

  return () => camera.stop();
}
