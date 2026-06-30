/**
 * ui/dom.js
 * All DOM references and UI update helpers.
 * Keeps main.js clean and free of querySelector spaghetti.
 */

import { CHORD_NAMES, DEFAULT_CHORDS } from '../audio/chords.js';

// ── Element references ────────────────────────────────────
export const videoEl      = document.getElementById('videoEl');
export const overlayCanvas = document.getElementById('overlayCanvas');
export const chordDisplay  = document.getElementById('chordDisplay');
export const statusMsg     = document.getElementById('statusMsg');
export const startBtn      = document.getElementById('startBtn');
export const pinchDots     = Array.from(document.querySelectorAll('.pinch-dot'));
export const strumBarEls   = Array.from(document.querySelectorAll('.strum-bar'));
export const chordCards    = [0, 1, 2, 3].map(i => document.getElementById(`card-${i}`));
export const chordSelects  = [0, 1, 2, 3].map(i => document.getElementById(`chord-${i}`));

/** Populate all four chord <select> elements with every available chord name. */
export function initChordSelects() {
  chordSelects.forEach((sel, i) => {
    CHORD_NAMES.forEach(name => {
      const opt = document.createElement('option');
      opt.value       = name;
      opt.textContent = name;
      if (name === DEFAULT_CHORDS[i]) opt.selected = true;
      sel.appendChild(opt);
    });
  });
}

/** Return the chord name currently chosen for finger i (0=index … 3=pinky). */
export function getSelectedChord(fingerIdx) {
  return chordSelects[fingerIdx].value;
}

// ── Visual state helpers ──────────────────────────────────

/** Show which finger is pinched (left-hand chord detection). */
export function updatePinchDots(pinches) {
  pinches.forEach((active, i) => {
    pinchDots[i].classList.toggle('active', active);
    chordCards[i].classList.toggle('active', active);
  });
}

/**
 * Highlight the chord card that is currently sounding.
 * @param {number} fingerIdx  -1 means no chord playing
 */
export function updatePlayingCard(fingerIdx) {
  chordCards.forEach((card, i) => {
    card.classList.toggle('playing', i === fingerIdx);
  });
  chordDisplay.textContent = fingerIdx >= 0 ? getSelectedChord(fingerIdx) : '—';
}

/**
 * Animate the strum visualiser bars.
 * @param {object} rightLandmarks  - MediaPipe landmarks for right (strum) hand, or null
 * @param {number} velocity        - 0..1 strum velocity
 */
export function updateStrumBars(rightLandmarks, velocity) {
  const lit = velocity > 0.1;
  strumBarEls.forEach((bar, i) => {
    let h = 30;
    if (rightLandmarks) {
      const tipY = rightLandmarks[[8, 12, 16, 20][i] ?? 8].y;
      h = Math.max(15, Math.min(95, 100 - tipY * 100));
    }
    bar.style.height = `${h}%`;
    bar.classList.toggle('lit', lit);
  });
}

/** Update the start button and status message text. */
export function setStatus(msg, btnText = null, btnDisabled = false) {
  statusMsg.textContent = msg;
  if (btnText !== null) startBtn.textContent = btnText;
  startBtn.disabled = btnDisabled;
}
