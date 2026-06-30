/**
 * ui/strum.js
 * Calculates strum velocity from the right-hand wrist Y position history.
 *
 * Velocity is the magnitude of Y-axis movement over a short rolling window,
 * normalised to 0..1. A fast up/down motion produces a value near 1.
 */

const HISTORY_LENGTH = 6;   // frames to look back
const SCALE_FACTOR   = 8;   // multiplier: tune this to taste
const DECAY_RATE     = 0.85; // per-frame velocity decay when no hand visible

let yHistory = [];
let lastVelocity = 0;

/**
 * Feed the current wrist Y (normalised 0..1, or null if hand is absent).
 * Returns the current strum velocity 0..1.
 */
export function updateStrumVelocity(wristY) {
  if (wristY === null) {
    yHistory = [];
    lastVelocity *= DECAY_RATE;
    return lastVelocity < 0.01 ? 0 : lastVelocity;
  }

  yHistory.push(wristY);
  if (yHistory.length > HISTORY_LENGTH) yHistory.shift();

  if (yHistory.length < 2) return 0;

  const dy = Math.abs(yHistory[yHistory.length - 1] - yHistory[0]);
  lastVelocity = Math.min(1, dy * SCALE_FACTOR);
  return lastVelocity;
}

export function resetStrum() {
  yHistory = [];
  lastVelocity = 0;
}
