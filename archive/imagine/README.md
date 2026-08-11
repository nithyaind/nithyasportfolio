# What If Easel

Type or speak a "what if…" and watch it get painted onto a canvas floating
in a small studio space. Ask more, and the space fills in around you —
on a laptop screen, or immersively in a VR headset.

## 1. Rotate your API key first

The key that was in the old `main.py` was exposed in plain text. Revoke it
in the OpenAI dashboard and generate a new one before doing anything else.

## 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then edit .env and paste your new key
export $(grep -v '^#' .env | xargs)   # loads OPENAI_API_KEY into the shell
# (or just `export OPENAI_API_KEY=sk-...` directly)

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000` — the backend serves the frontend directly,
so there's nothing else to run.

## 3. Using it on a screen

Drag to look around the space. Type or tap the mic to speak a "what if,"
then **Paint it**. Each vision appears as a new canvas in the room; past
ones stay put, so the gallery grows with every question. Thumbnails at
the bottom left jump the view back to any past vision.

## 4. Using it in VR

If your browser reports WebXR support, an **Enter VR** button appears.
Two ways to test with a headset:

- **On the headset itself** (e.g. Quest Browser): the headset needs to
  reach your backend over **https**, or WebXR won't activate — browsers
  only allow VR sessions on secure origins. The easiest path is a tunnel:
  ```bash
  ngrok http 8000
  ```
  then open the `https://...ngrok...` URL in the headset's browser.
- **Tethered to a PC via Meta Quest Link / Air Link**: open
  `http://localhost:8000` directly in the desktop browser you're mirroring
  into the headset — localhost counts as secure, no tunnel needed.

Inside VR, "what if" visions you add appear as new canvases around you in
real time — you can turn to watch the room fill in as each one resolves.

## Notes / things you may want to change

- `gpt-image-1-mini` generations take a few seconds each; the status line
  under the composer shows progress.
- History is stored in the browser's `localStorage`, per-device — it won't
  sync between your laptop and a headset. If you want the gallery to be
  shared across devices, the next step would be moving that array into a
  small database behind the FastAPI backend instead.
- Speech input uses the Web Speech API, which Chrome and the Quest Browser
  support but Firefox and Safari largely don't — the mic button disables
  itself gracefully where it's unavailable.
