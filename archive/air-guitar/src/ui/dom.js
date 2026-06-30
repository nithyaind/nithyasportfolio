/**
 * ui/dom.js — DOM references and UI update helpers
 */

import { CHORD_NAMES, DEFAULT_CHORDS } from '../audio/chords.js';

export const videoEl       = document.getElementById('videoEl');
export const overlayCanvas = document.getElementById('overlayCanvas');
export const chordDisplay  = document.getElementById('chordDisplay');
export const fistIndicator = document.getElementById('fistIndicator');
export const statusMsg     = document.getElementById('statusMsg');
export const startBtn      = document.getElementById('startBtn');
export const pinchDots     = Array.from(document.querySelectorAll('.dot'));
export const chordCells    = [0,1,2,3].map(i => document.getElementById(`card-${i}`));
export const chordSelects  = [0,1,2,3].map(i => document.getElementById(`chord-${i}`));

export function initChordSelects() {
  chordSelects.forEach((sel, i) => {
    CHORD_NAMES.forEach(name => {
      const opt = document.createElement('option');
      opt.value = opt.textContent = name;
      if (name === DEFAULT_CHORDS[i]) opt.selected = true;
      sel.appendChild(opt);
    });
  });
}

export function getSelectedChord(fingerIdx) {
  return chordSelects[fingerIdx].value;
}

export function updatePinchDots(pinches) {
  pinches.forEach((on, i) => {
    pinchDots[i]?.classList.toggle('active', on);
    chordCells[i]?.classList.toggle('active', on);
  });
}

export function updatePlayingCard(fingerIdx) {
  chordCells.forEach((c, i) => c.classList.toggle('playing', i === fingerIdx));
  chordDisplay.textContent = fingerIdx >= 0 ? chordSelects[fingerIdx].value : '—';
}

export function updateFistIndicator(isFist) {
  fistIndicator.classList.toggle('active', isFist);
}

export function setStatus(msg, btnText = null, btnDisabled = false) {
  statusMsg.textContent = msg;
  if (btnText !== null) startBtn.textContent = btnText;
  startBtn.disabled = btnDisabled;
}
