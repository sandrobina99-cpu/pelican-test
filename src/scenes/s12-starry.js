import { GROUND_Y, PLATE } from "../beat/world.js";
import { sectionStart } from "../beat/timeline.js";
import { bake } from "../kit/ink.js";
import { mulberry32 } from "../kit/rng.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[11];

/** Swirling night of our own. Not the cypress, village, or eleven stars of the painting. */
export default {
  meta,
  draw(p, ctx) {
    const g = bake(p, "starry-1", 1000, 1000, paintStill);
    p.image(g, 0, 0);
    const local = ctx.localT ?? ctx.t - sectionStart(12);
    const burst = local > 2 && local < 4 ? Math.sin(((local - 2) / 2) * Math.PI) : 0;
    const phase = (ctx.t || 0) * (1.3 + burst * 2.4);
    sky(p, phase);
    p.noStroke();
    p.fill("#F4E7A0");
    p.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
  },
};

function paintStill(g) {
  g.background("#12215A");
  cypress(g, 180, 800);
  house(g, 250, 690, 64, 48);
  house(g, 820, 700, 58, 42);
  g.noStroke();
  g.fill("#1A3A28");
  g.rect(0, GROUND_Y - 8, 1000, 240);
  g.fill("#0C1738");
  g.rect(0, GROUND_Y + 20, 1000, 40);
}

function sky(p, phase) {
  const rnd = mulberry32(1889);
  p.noFill();
  for (let i = 0; i < 160; i++) {
    const cx = rnd() * 1000;
    const cy = 30 + rnd() * 500;
    const r = 16 + rnd() * 54;
    const a0 = rnd() * 6.2 + phase * (0.35 + rnd());
    const blue = rnd() > 0.45;
    p.stroke(blue ? 70 : 30, blue ? 120 : 150, blue ? 190 : 140, 180);
    p.strokeWeight(1.6 + rnd() * 2.2);
    p.arc(cx, cy, r * 2, r * 1.2, a0, a0 + 0.7 + rnd() * 1.1);
  }
  for (let i = 0; i < 7; i++) {
    const x = 160 + i * 110;
    const y = 80 + (i % 3) * 36;
    p.stroke("#F0D24A");
    p.strokeWeight(2);
    p.arc(x, y, 28, 28, phase + i, phase + i + 3.4);
    p.arc(x + 8, y + 6, 16, 16, phase * 1.3 + i, phase * 1.3 + i + 2.2);
  }
  p.stroke("#F4E7A0");
  p.strokeWeight(3);
  p.arc(640, 150, 90, 90, phase * 0.6, phase * 0.6 + 4.2);
  p.arc(640, 150, 54, 54, -phase * 0.8, -phase * 0.8 + 3.2);
}

function cypress(g, x, y) {
  g.noFill();
  g.stroke("#0C2A22");
  for (let i = 0; i < 28; i++) {
    const t = i / 28;
    g.strokeWeight(1.2 + (1 - t) * 2);
    g.bezier(
      x + Math.sin(i) * 8,
      y - t * 280,
      x - 30 - t * 10,
      y - t * 280 - 20,
      x + 24,
      y - t * 280 - 40,
      x + Math.sin(i * 1.7) * 18,
      y - t * 280 - 56,
    );
  }
}

function house(g, x, y, w, h) {
  g.stroke("#0C2040");
  g.strokeWeight(2);
  g.fill("#1A3A6A");
  g.rect(x, y - h, w, h);
  g.fill("#16305A");
  g.triangle(x - 8, y - h, x + w / 2, y - h - 28, x + w + 8, y - h);
  g.noStroke();
  g.fill("#F0D24A");
  g.rect(x + 12, y - h + 14, 10, 12);
  g.rect(x + w - 24, y - h + 18, 10, 10);
}
