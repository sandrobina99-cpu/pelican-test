/**
 * Zoomed rider for checking the crank cycle.
 * ?mode=sheet draws eight phases. Otherwise renderAt(t) is one large rider;
 * one crank turn is one second.
 */

import { poseAt } from "../rig/pose.js";
import { drawRig } from "../rig/draw.js";
import { enterStage } from "../kit/stage.js";

const params = new URLSearchParams(location.search);
const mode = params.get("mode") || "loop";

function groundAndRig(p, pose, scale) {
  p.stroke("#b7aa96");
  p.strokeWeight(2 / scale);
  p.line(-30, 0, 230, 0);
  drawRig(p, pose, "default");
}

function paintSheet(p) {
  enterStage(p);
  p.background("#241c16");
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(22);
  p.noStroke();
  for (let i = 0; i < 8; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const pose = poseAt(0, { crank: (i / 8) * Math.PI * 2 });
    const ox = 70 + col * 470;
    const oy = 500 + row * 540;
    p.push();
    p.translate(ox, oy);
    p.scale(1.9, -1.9);
    groundAndRig(p, pose, 1.9);
    p.pop();
    p.fill("#f4efe6");
    p.text(`${i + 1}/8`, ox - 10, oy + 16);
  }
}

function paintLoop(p, t) {
  enterStage(p);
  p.background("#e6dcc8");
  const pose = poseAt(0, { crank: (t % 1) * Math.PI * 2 });
  const scale = 4.15;
  p.push();
  p.translate(620, 900);
  p.scale(scale, -scale);
  groundAndRig(p, pose, scale);
  p.pop();
}

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(1920, 1080, p.WEBGL);
    p.pixelDensity(1);
    p.noLoop();
    p.canvas.id = "gl";
    window.renderAt = (t) => {
      window.__t = t;
      p.redraw();
    };
    window.__ready = true;
    window.renderAt(0);
  };
  p.draw = () => {
    if (mode === "sheet") paintSheet(p);
    else paintLoop(p, window.__t || 0);
  };
};

new globalThis.p5(sketch);
