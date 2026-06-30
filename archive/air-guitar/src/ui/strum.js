/**
 * ui/strum.js
 * Calculates strum velocity from the right-hand wrist Y position history.
 *
 * Velocity is the magnitude of Y-axis movement over a short rolling window,
 * normalised to 0..1. A fast up/down motion produces a value near 1.
 */

/**
 * ui/strum.js
 * Detects discrete strum *events* from right-hand wrist Y motion, rather
 * than reporting continuous velocity. A real strum is a single down (or up)
 * stroke — we want exactly one re-attack per stroke, not one per frame.
 *
 * Strategy: track wrist Y direction. When the direction reverses (a peak),
 * that's a completed strum stroke — fire an event with the stroke's speed.
 */

const HISTORY_LENGTH   = 4;     // frames to look back for direction/speed
const SCALE_FACTOR     = 10;    // tune to taste: raw dy/frame -> 0..1 velocity
const MIN_STROKE_DY    = 0.025; // minimum Y travel (normalised) to count as a stroke
const DIRECTION_DEADZONE = 0.003; // ignore tiny jitter when detecting direction

let yHistory = [];
let lastDirection = 0;   // -1 (up), 1 (down), 0 (unknown)
let strokeStartY = null;
let smoothedVelocity = 0;

/**
 * Feed the current wrist Y (normalised 0..1, or null if hand is absent).
 * Returns { velocity, strumEvent } where strumEvent is true only on the
 * single frame a stroke completes (direction reversal of sufficient size).
 */
export function updateStrumVelocity(wristY) {
  if (wristY === null) {
    yHistory = [];
    lastDirection = 0;
    strokeStartY = null;
    smoothedVelocity *= 0.8;
    return { velocity: smoothedVelocity < 0.01 ? 0 : smoothedVelocity, strumEvent: false };
  }

  yHistory.push(wristY);
  if (yHistory.length > HISTORY_LENGTH) yHistory.shift();
  if (strokeStartY === null) strokeStartY = wristY;

  if (yHistory.length < 2) {
    return { velocity: 0, strumEvent: false };
  }

  const dy = yHistory[yHistory.length - 1] - yHistory[yHistory.length - 2];
  const direction = dy > DIRECTION_DEADZONE ? 1 : dy < -DIRECTION_DEADZONE ? -1 : lastDirection;

  // Frame-to-frame speed, smoothed slightly for a less jittery readout
  const instSpeed = Math.min(1, Math.abs(dy) * SCALE_FACTOR);
  smoothedVelocity = smoothedVelocity * 0.6 + instSpeed * 0.4;

  let strumEvent = false;

  // Direction reversal = a stroke just completed
  if (lastDirection !== 0 && direction !== 0 && direction !== lastDirection) {
    const strokeDistance = Math.abs(wristY - strokeStartY);
    if (strokeDistance > MIN_STROKE_DY) {
      strumEvent = true;
    }
    strokeStartY = wristY; // start tracking the next stroke
  }

  lastDirection = direction;

  return { velocity: smoothedVelocity, strumEvent };
}

export function resetStrum() {
  yHistory = [];
  lastDirection = 0;
  strokeStartY = null;
  smoothedVelocity = 0;
}
