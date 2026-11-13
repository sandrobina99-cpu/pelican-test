import { at, TOTAL } from "../beat/timeline.js";
import { labelFor } from "../scenes/catalog.js";
import { renderFilm } from "./scheduler.js";

const params = new URLSearchParams(location.search);
const exporting = params.get("export") === "1";
const startAt = Number(params.get("t") || 0);

const stage = document.getElementById("stage");
const textCanvas = document.getElementById("text");
const textCtx = textCanvas.getContext("2d");
const playBtn = document.getElementById("play");
const seek = document.getElementById("seek");
const sectionEl = document.getElementById("section");
const clockEl = document.getElementById("clock");

if (exporting) document.body.classList.add("export");

textCanvas.width = 1920;
textCanvas.height = 1080;

let currentT = Number.isFinite(startAt) ? Math.min(TOTAL, Math.max(0, startAt)) : 0;
let playing = false;
let playOriginT = currentT;
let playOriginWall = 0;
let sketch = null;

function formatClock(t) {
  const m = Math.floor(t / 60);
  const s = t - m * 60;
  return `${m}:${s.toFixed(1).padStart(4, "0")}`;
}

function syncChrome() {
  if (!seek) return;
  if (document.activeElement !== seek) seek.value = String(currentT);
  const info = at(currentT);
  sectionEl.textContent = labelFor(info);
  clockEl.textContent = formatClock(currentT);
  playBtn.textContent = playing ? "暂停" : "播放";
}

function renderAt(t) {
  currentT = Math.min(TOTAL, Math.max(0, t));
  if (!sketch) return;
  sketch.redraw();
  syncChrome();
}

const film = (p) => {
  p.setup = () => {
    p.createCanvas(1920, 1080, p.WEBGL);
    p.pixelDensity(1);
    p.noLoop();
    const brush = globalThis.brush;
    if (brush) {
      try {
        brush.instance(p);
        brush.load();
      } catch (err) {
        console.warn("p5.brush failed to attach", err);
      }
    }
    p.canvas.id = "gl";
    sketch = p;
    window.renderAt = renderAt;
    window.__ready = true;
  };

  p.draw = () => {
    renderFilm(p, textCtx, currentT, null);
  };
};

function boot() {
  // p5 and p5.brush are classic scripts. Modules must read them off the window.
  const P5 = window.p5;
  new P5(film, stage);
  if (window.renderAt) window.renderAt(currentT);
}

function loop(now) {
  if (playing) {
    currentT = playOriginT + (now - playOriginWall) / 1000;
    if (currentT >= TOTAL) {
      currentT = TOTAL;
      playing = false;
    }
    renderAt(currentT);
  }
  requestAnimationFrame(loop);
}

if (playBtn) {
  playBtn.addEventListener("click", () => {
    playing = !playing;
    if (playing) {
      if (currentT >= TOTAL) currentT = 0;
      playOriginT = currentT;
      playOriginWall = performance.now();
    }
    syncChrome();
  });
  seek.addEventListener("input", () => {
    const was = playing;
    playing = false;
    renderAt(Number(seek.value));
    if (was) {
      playing = true;
      playOriginT = currentT;
      playOriginWall = performance.now();
    }
  });
  window.addEventListener("keydown", (ev) => {
    if (ev.code === "Space") {
      ev.preventDefault();
      playBtn.click();
    } else if (ev.code === "ArrowRight") {
      playing = false;
      renderAt(currentT + 0.5);
    } else if (ev.code === "ArrowLeft") {
      playing = false;
      renderAt(currentT - 0.5);
    }
  });
}

async function fontsReady() {
  await document.fonts.ready;
  await Promise.all([
    document.fonts.load('600 64px "Pelican Serif"'),
    document.fonts.load('400 32px "Pelican Sans"'),
    document.fonts.load('700 28px "Pelican Sans"'),
  ]);
}

fontsReady().then(() => {
  boot();
  if (!exporting) requestAnimationFrame(loop);
});
