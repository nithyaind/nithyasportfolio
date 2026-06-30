/**
 * hands/overlay.js
 * Draws MediaPipe hand landmarks onto the overlay canvas.
 */

const CHORD_HAND_COLOR  = '#5DCAA5';  // teal  — user's left (chord) hand
const STRUM_HAND_COLOR  = '#85B7EB';  // blue  — user's right (strum) hand
const CHORD_HAND_FILL   = '#0F6E56';
const STRUM_HAND_FILL   = '#185FA5';

/**
 * Draw all detected hands onto the overlay canvas.
 *
 * @param {HTMLCanvasElement}  canvas
 * @param {HTMLVideoElement}   video
 * @param {object}             results  - raw MediaPipe Hands results
 */
export function drawOverlay(canvas, video, results) {
  // Sync canvas resolution to video
  canvas.width  = video.videoWidth  || canvas.offsetWidth;
  canvas.height = video.videoHeight || canvas.offsetHeight;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!results.multiHandLandmarks) return;

  results.multiHandLandmarks.forEach((lm, i) => {
    const label = results.multiHandedness?.[i]?.label;
    // "Right" from model = user's left hand (chord)
    const isChordHand = label === 'Right';

    window.drawConnectors(ctx, lm, window.HAND_CONNECTIONS, {
      color:     isChordHand ? CHORD_HAND_COLOR : STRUM_HAND_COLOR,
      lineWidth: 2,
    });

    window.drawLandmarks(ctx, lm, {
      color:     isChordHand ? CHORD_HAND_FILL : STRUM_HAND_FILL,
      lineWidth: 1,
      radius:    3,
    });
  });
}
