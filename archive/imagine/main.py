import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from openai import OpenAI

# --- API key comes from the environment, never hardcoded ---
# Set it before starting the server:
#   export OPENAI_API_KEY="sk-..."          (mac/linux)
#   $env:OPENAI_API_KEY="sk-..."            (windows powershell)
# or put it in a .env file next to this script (see .env.example)
API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY:
    raise RuntimeError(
        "OPENAI_API_KEY is not set. Export it as an environment variable "
        "before starting the server — do not hardcode it in this file."
    )

client = OpenAI(api_key=API_KEY)

app = FastAPI(title="What If Easel")

# Loosen CORS only if you're serving the frontend from a different origin
# (e.g. a tunnel URL for a VR headset). If everything is served from this
# same FastAPI app, CORS doesn't matter much, but it's harmless to leave open
# for local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"


class PromptRequest(BaseModel):
    prompt: str


@app.get("/")
async def read_root():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.post("/generate")
async def generate_image(request: PromptRequest):
    prompt = request.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    try:
        response = client.images.generate(
            model="gpt-image-1-mini",
            prompt=prompt,
            size="1024x1024",
        )
        image_base64 = response.data[0].b64_json
        return {"url": f"data:image/png;base64,{image_base64}"}
    except Exception as e:
        # Log server-side, return a generic message to the client
        print("Image generation error:", e)
        raise HTTPException(status_code=502, detail="Image generation failed.")


# Static assets (app.js, styles.css) — mounted after the routes above so
# "/" and "/generate" are matched first.
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
