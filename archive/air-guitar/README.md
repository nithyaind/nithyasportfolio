# Air Guitar

Play guitar chords in the air using your webcam and hand gestures.

**Left hand** holds chords by pinching thumb to a finger.  
**Right hand** strums by moving up and down.

---

## Project structure

```
air-guitar/
├── index.html              # Entry point & HTML structure
└── src/
    ├── main.js             # App entry — wires everything together
    ├── style.css           # All styles
    ├── audio/
    │   ├── chords.js       # Chord frequency tables & defaults
    │   └── engine.js       # Web Audio API synth engine
    ├── hands/
    │   ├── tracker.js      # MediaPipe Hands setup & pinch detection
    │   └── overlay.js      # Canvas landmark drawing
    └── ui/
        ├── dom.js          # DOM refs & visual state helpers
        └── strum.js        # Strum velocity calculator
```

---

## Running locally

Because `main.js` uses ES modules (`import`/`export`), the app must be
served over HTTP — opening `index.html` directly as a `file://` URL will
block module imports.

### Option A — Python (no install)

```bash
cd air-guitar
python3 -m http.server 8080
# open http://localhost:8080
```

### Option B — Node `serve`

```bash
npx serve air-guitar
```

### Option C — VS Code Live Server extension

Right-click `index.html` → **Open with Live Server**.

---

## How it works

### Hand detection
MediaPipe Hands (loaded from CDN) tracks up to 2 hands at 21 landmarks each.
`tracker.js` identifies which hand is which via MediaPipe's handedness label,
then checks if the thumb tip (landmark 4) is within ~7% of frame width of any
finger tip (landmarks 8, 12, 16, 20).

### Strum velocity
`strum.js` maintains a rolling 6-frame history of the right-hand wrist Y
position. The magnitude of change over that window, scaled by 8×, becomes
the strum velocity (0–1). Faster motion = louder attack.

### Audio synthesis
`engine.js` builds a voice per guitar string using the Web Audio API:

```
OscillatorNode (sawtooth)
  → BiquadFilterNode (lowpass, per-string cutoff)
  → GainNode (ADSR envelope)
  → AudioContext.destination
```

Strings are staggered by 18 ms to mimic a physical strum. A re-strum on
the same chord retriggers the gain envelope without stopping the oscillators,
keeping the tone smooth.

---

## Customising

### Add chords
Edit `src/audio/chords.js` — add a key with an array of 6 frequencies
(low E → high E string order).

### Adjust pinch sensitivity
Change the `threshold` default in `tracker.js → isPinching()`.
Lower = harder to trigger, higher = more sensitive.

### Change strum sensitivity
Adjust `SCALE_FACTOR` in `src/ui/strum.js`.

### Change the synth sound
Swap `osc.type = 'sawtooth'` for `'triangle'` (mellower) or `'square'`
(brighter) in `engine.js`. Adjust `filter.frequency` for more/less brightness.
