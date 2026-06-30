/**
 * hands/tracker.js
 * Hand state parsing using MediaPipe Hands.
 *
 * Left hand  (chord hand)  — pinch thumb to finger = hold chord
 * Right hand (strum hand)  — close fist = strum event
 */

export const THUMB_TIP   = 4;
export const FINGER_TIPS = [8, 12, 16, 20]; // index, middle, ring, pinky

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function isPinching(landmarks, tipIdx, threshold = 0.07) {
  return dist(landmarks[THUMB_TIP], landmarks[tipIdx]) < threshold;
}

/**
 * Detect whether the right hand is making a fist.
 * Each finger tip should be below (higher Y) its own MCP knuckle when closed.
 * We use all 4 fingers — at least 3 must be curled to count.
 */
const FINGER_TIPS_IDX  = [8, 12, 16, 20];
const FINGER_MCP_IDX   = [5,  9, 13, 17]; // knuckle base of each finger

export function isFist(landmarks) {
  let curled = 0;
  for (let i = 0; i < 4; i++) {
    const tip = landmarks[FINGER_TIPS_IDX[i]];
    const mcp = landmarks[FINGER_MCP_IDX[i]];
    // In normalised coords, Y increases downward.
    // Tip below MCP = finger is curled.
    if (tip.y > mcp.y) curled++;
  }
  return curled >= 3;
}

/**
 * Extract hand state from a MediaPipe result set.
 * Returns { leftPinches: bool[4], rightFist: bool }
 *
 * MediaPipe labels are from the model's perspective (mirror-flipped):
 *   "Right" label = user's left hand (chord hand)
 *   "Left"  label = user's right hand (strum hand)
 */
export function parseHands(results) {
  let leftPinches = [false, false, false, false];
  let rightFist   = false;

  if (!results.multiHandLandmarks) return { leftPinches, rightFist };

  results.multiHandLandmarks.forEach((lm, i) => {
    const label = results.multiHandedness?.[i]?.label;
    if (label === 'Right') leftPinches = FINGER_TIPS.map(tip => isPinching(lm, tip));
    if (label === 'Left')  rightFist   = isFist(lm);
  });

  return { leftPinches, rightFist };
}

export async function startTracking(videoEl, onResults) {
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
    onFrame: async () => { await hands.send({ image: videoEl }); },
    width: 640, height: 480,
  });

  await camera.start();
  return () => camera.stop();
}
