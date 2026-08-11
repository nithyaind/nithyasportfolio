import * as THREE from "three";
import { VRButton } from "three/addons/webxr/VRButton.js";

// ---------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------
const STORAGE_KEY = "whatif_easel_visions";

function loadVisions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveVisions(visions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visions));
}

let visions = loadVisions();

// ---------------------------------------------------------------------
// Three.js scene: a dim studio void the visions get painted into.
// New panels wrap around the viewer in an arc, so the "world" widens
// as more what-ifs are asked. Each panel fades and rises into place.
// ---------------------------------------------------------------------
const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1c1a2b);
scene.fog = new THREE.Fog(0x1c1a2b, 6, 16);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.05,
  100
);
camera.position.set(0, 1.6, 0);

// Soft studio lighting
scene.add(new THREE.HemisphereLight(0x554a7a, 0x14111f, 1.1));
const key = new THREE.PointLight(0xf1ead9, 1.2, 20, 2);
key.position.set(0, 3, 2);
scene.add(key);

// Ground disc so the space reads as a room, not a void
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(9, 48),
  new THREE.MeshStandardMaterial({ color: 0x241f38, roughness: 1 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.4;
scene.add(floor);

const panelGroup = new THREE.Group();
scene.add(panelGroup);

const RADIUS = 4;
const ANGLE_STEP = (Math.PI * 2) / 10; // ten visions wrap a full circle
const loader = new THREE.TextureLoader();

function addPanel(vision, index, { animate = true } = {}) {
  const angle = index * ANGLE_STEP;
  const x = Math.sin(angle) * RADIUS;
  const z = -Math.cos(angle) * RADIUS;
  const y = 0.2 + Math.sin(index * 1.7) * 0.25; // gentle organic variation

  const frameGeo = new THREE.PlaneGeometry(2.2, 2.2);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0xc99b4a,
    roughness: 0.6,
    metalness: 0.15,
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);

  const canvasGeo = new THREE.PlaneGeometry(2, 2);
  const canvasMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    transparent: true,
    opacity: 0,
  });
  const panel = new THREE.Mesh(canvasGeo, canvasMat);
  panel.position.z = 0.01;
  frame.add(panel);

  frame.position.set(x, y, z);
  frame.lookAt(0, y, 0);
  panelGroup.add(frame);

  loader.load(vision.url, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    canvasMat.map = tex;
    canvasMat.needsUpdate = true;
  });

  if (animate) {
    frame.scale.setScalar(0.85);
    const start = performance.now();
    const duration = 900;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      canvasMat.opacity = eased;
      frame.scale.setScalar(0.85 + 0.15 * eased);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  } else {
    canvasMat.opacity = 1;
    frame.scale.setScalar(1);
  }
}

visions.forEach((v, i) => addPanel(v, i, { animate: false }));

// Slow ambient rotation so the gallery feels alive without input,
// paused while the user is actively dragging to look around.
let autoRotate = true;
function renderLoop() {
  renderer.setAnimationLoop(() => {
    if (autoRotate && !renderer.xr.isPresenting) {
      panelGroup.rotation.y += 0.0006;
    }
    renderer.render(scene, camera);
  });
}
renderLoop();

// Click-and-drag look-around for desktop / mobile (non-VR)
let isDragging = false;
let lastX = 0;
let lastY = 0;
let yaw = 0;
let pitch = 0;

canvas.addEventListener("pointerdown", (e) => {
  isDragging = true;
  autoRotate = false;
  lastX = e.clientX;
  lastY = e.clientY;
});
window.addEventListener("pointerup", () => (isDragging = false));
window.addEventListener("pointermove", (e) => {
  if (!isDragging || renderer.xr.isPresenting) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  yaw -= dx * 0.0025;
  pitch = Math.max(-0.6, Math.min(0.6, pitch - dy * 0.0025));
  camera.rotation.set(pitch, yaw, 0, "YXZ");
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------------------------------------------------
// VR entry point — only shown if the browser/headset supports it.
// ---------------------------------------------------------------------
const vrButton = document.getElementById("vr-button");
if (navigator.xr) {
  navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
    if (!supported) return;
    vrButton.hidden = false;
    const threeVRButton = VRButton.createButton(renderer);
    vrButton.addEventListener("click", () => threeVRButton.click());
  });
}

// ---------------------------------------------------------------------
// Speech input
// ---------------------------------------------------------------------
const input = document.getElementById("input");
const speakBtn = document.getElementById("speak");
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognitionAPI) {
  const recognition = new SpeechRecognitionAPI();
  recognition.lang = "en-US";
  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
  };
  recognition.onstart = () => speakBtn.classList.add("recording");
  recognition.onend = () => speakBtn.classList.remove("recording");
  speakBtn.addEventListener("click", () => recognition.start());
} else {
  speakBtn.disabled = true;
  speakBtn.title = "Speech input isn't supported in this browser";
}

// ---------------------------------------------------------------------
// Generate + history
// ---------------------------------------------------------------------
const generateBtn = document.getElementById("generate");
const statusEl = document.getElementById("status");
const historyRail = document.getElementById("history-rail");

function renderHistoryRail() {
  historyRail.innerHTML = "";
  visions.forEach((v, i) => {
    const chip = document.createElement("button");
    chip.className = "history-chip";
    chip.style.backgroundImage = `url(${v.url})`;
    chip.title = v.prompt;
    chip.addEventListener("click", () => lookAtPanel(i));
    historyRail.appendChild(chip);
  });
}

function lookAtPanel(index) {
  autoRotate = false;
  const targetAngle = index * ANGLE_STEP;
  yaw = -targetAngle;
  pitch = 0;
  camera.rotation.set(pitch, yaw, 0, "YXZ");
}

async function generateImage(prompt) {
  const response = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || "Generation failed");
  }
  const data = await response.json();
  return data.url;
}

generateBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  generateBtn.disabled = true;
  statusEl.textContent = "Mixing pigment…";

  try {
    const url = await generateImage(`What if ${text}`);
    const vision = { prompt: text, url, ts: Date.now() };
    visions.push(vision);
    saveVisions(visions);
    addPanel(vision, visions.length - 1);
    renderHistoryRail();
    input.value = "";
    statusEl.textContent = `Painted: "What if ${text}"`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Couldn't paint that one — try again.";
  } finally {
    generateBtn.disabled = false;
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    generateBtn.click();
  }
});

renderHistoryRail();
