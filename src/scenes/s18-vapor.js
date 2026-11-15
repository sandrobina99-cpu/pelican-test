import { GROUND_Y, PLATE } from "../beat/world.js";
import { sectionStart } from "../beat/timeline.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[17];

/** Gradient, a perspective grid, palms, and a faceless bust. The grid skips once. */
export default {
  meta,
  draw(p, ctx) {
    const local = ctx.localT ?? ctx.t - sectionStart(18);
    const glitch = local > 2 && local < 2.35 ? 14 : 0;
    sky(p);
    sun(p);
    grid(p, glitch);
    palm(p, 160, 620);
    palm(p, 820, 600);
    bust(p, 640, 700);
    p.noStroke();
    p.fill("#4A2A6A");
    p.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
    p.stroke("#FF7AD9");
    p.strokeWeight(2);
    p.noFill();
    p.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
  },
};

function sky(p) {
  p.noStroke();
  for (let i = 0; i < 16; i++) {
    const t = i / 16;
    p.fill(80 + t * 40, 40 + t * 80, 140 - t * 40);
    p.rect(0, i * 48, 1000, 50);
  }
}

function sun(p) {
  p.noStroke();
  for (let i = 6; i >= 0; i--) {
    p.fill(255, 120 + i * 12, 180, 40);
    p.rect(300, 80 + i * 14, 400, 10);
  }
  p.fill("#FFD0F0");
  p.circle(500, 150, 70);
}

function grid(p, glitch) {
  p.stroke("#3EE0E0");
  p.strokeWeight(1.4);
  const horizon = 430;
  for (let i = -6; i <= 6; i++) {
    p.line(500, horizon, 500 + i * 90 + glitch, GROUND_Y + 40);
  }
  for (let i = 0; i < 8; i++) {
    const y = horizon + i * i * 4 + 8;
    const half = 40 + i * 70;
    p.line(500 - half + (i % 2 ? glitch : 0), y, 500 + half, y);
  }
}

function palm(p, x, y) {
  p.stroke("#FF7AD9");
  p.strokeWeight(4);
  p.line(x, y, x, y - 120);
  p.noFill();
  p.stroke("#7AF0E0");
  p.strokeWeight(3);
  for (let i = 0; i < 5; i++) {
    const a = -0.8 + i * 0.4;
    p.line(x, y - 120, x + Math.cos(a) * 54, y - 120 + Math.sin(a) * 28);
  }
}

function bust(p, x, y) {
  p.noStroke();
  p.fill("#F4F1EA");
  p.rect(x - 28, y - 20, 56, 28);
  p.rect(x - 16, y - 70, 32, 52);
  p.ellipse(x, y - 86, 36, 40);
  p.fill("#FF7AD9");
  p.rect(x - 4, y - 70, 3, 18);
  p.push();
  p.translate(x + 6, y - 90);
  p.rotate(-0.4);
  p.rect(0, 0, 10, 3);
  p.pop();
}
