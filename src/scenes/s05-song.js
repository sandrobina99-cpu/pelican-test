import { GROUND_Y, PLATE } from "../beat/world.js";
import { bake, grain, insidePoly, polySpans } from "../kit/ink.js";
import { mulberry32 } from "../kit/rng.js";
import { SECTIONS } from "./catalog.js";

const meta = { ...SECTIONS[4], paintLast: false };

/** Original peak. Not the silhouette of Travelers Among Mountains and Streams. */
const PEAK = [
  [110, 820],
  [190, 640],
  [160, 470],
  [250, 300],
  [220, 140],
  [310, 20],
  [390, -120],
  [460, -300],
  [500, -380],
  [545, -210],
  [510, -40],
  [575, 30],
  [640, 150],
  [610, 310],
  [710, 430],
  [770, 610],
  [880, 820],
];

const LEFT = [
  [20, 800],
  [90, 560],
  [180, 470],
  [260, 620],
  [300, 800],
];

const RIGHT = [
  [760, 800],
  [860, 520],
  [980, 470],
  [1040, 800],
];

export default {
  meta,
  draw(p) {
    const g = bake(p, "song-ink-1", 1000, 1460, paint);
    p.image(g, 0, -460);
  },
};

function paint(g) {
  g.translate(0, 460);
  g.background(231, 225, 214);
  washPoly(g, LEFT, 28);
  washPoly(g, RIGHT, 24);
  dots(g, LEFT, 700, 21, 0.4);
  dots(g, RIGHT, 500, 22, 0.35);
  washPoly(g, PEAK, 92);
  dots(g, PEAK, 6400, 11, 1);
  hemp(g);
  falls(g);
  pine(g, 330, 210);
  pine(g, 250, 470);
  pine(g, 690, 360);
  hut(g, 735, 430);
  mist(g, 250, 34, 34);
  mist(g, 430, 26, 26);
  mist(g, 620, 20, 18);
  g.noStroke();
  g.fill(206, 198, 184);
  g.rect(-10, GROUND_Y - 6, 1020, 250);
  g.fill(236, 230, 218, 230);
  g.rect(-10, GROUND_Y + 16, 1020, 18);
  grain(g, -10, -420, 1020, 1460, 1000, [110, 92, 64, 26], 2800);
  g.noStroke();
  g.fill(244, 240, 230, 214);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}

function washPoly(g, poly, alphaBase) {
  const ys = poly.map((pt) => pt[1]);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  for (let y = minY; y < maxY; y += 2) {
    const depth = (y - minY) / (maxY - minY || 1);
    g.stroke(36, 30, 24, alphaBase * (0.08 + depth * depth * 1.15));
    g.strokeWeight(2.1);
    for (const [x0, x1] of polySpans(poly, y)) g.line(x0, y, x1, y);
  }
}

function dots(g, poly, count, seed, weight) {
  const rnd = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    const x = rnd() * 1000;
    const y = -380 + rnd() * 1200;
    if (!insidePoly(poly, x, y)) continue;
    const depth = Math.min(1, Math.max(0, (y + 360) / 1100));
    const cliff = x > 580 ? Math.min(1, (x - 580) / 260) : 0;
    g.stroke(28, 24, 20, 40 + depth * 160 + cliff * 50);
    g.strokeWeight((0.6 + depth * 1.15) * weight);
    const lower = depth > 0.72;
    const dx = lower ? (rnd() - 0.4) * 7 : (rnd() - 0.5) * 1.4;
    const dy = 1.4 + rnd() * (lower ? 6 : 3.2);
    g.line(x, y, x + dx, y + dy);
  }
}

function hemp(g) {
  const rnd = mulberry32(17);
  g.stroke(32, 26, 22, 110);
  for (let i = 0; i < 280; i++) {
    const x = 160 + rnd() * 280;
    const y = 80 + rnd() * 560;
    if (!insidePoly(PEAK, x, y)) continue;
    g.strokeWeight(0.7 + rnd() * 0.6);
    g.line(x, y, x + 10 + rnd() * 22, y + 8 + rnd() * 16);
  }
}

function falls(g) {
  g.stroke(244, 240, 232, 170);
  g.strokeWeight(2);
  g.line(492, -60, 486, 300);
  g.strokeWeight(1);
  g.line(498, -20, 496, 240);
  g.stroke(244, 240, 232, 80);
  g.strokeWeight(6);
  g.line(490, 280, 488, 360);
}

function pine(g, x, y) {
  g.stroke(28, 24, 20, 210);
  g.strokeWeight(1.25);
  g.line(x, y, x + 1, y - 42);
  for (let i = 0; i < 6; i++) {
    const yy = y - 6 - i * 6;
    const w = 16 - i * 2;
    g.line(x, yy, x - w, yy + 7);
    g.line(x, yy, x + w, yy + 6);
  }
}

function hut(g, x, y) {
  g.stroke(28, 24, 20, 200);
  g.strokeWeight(1.2);
  g.noFill();
  g.rect(x, y, 22, 16);
  g.line(x - 4, y, x + 11, y - 12);
  g.line(x + 11, y - 12, x + 26, y);
}

function mist(g, y, h, alpha) {
  g.noStroke();
  for (let i = 0; i < 5; i++) {
    g.fill(236, 231, 220, alpha * (1 - i / 5));
    g.rect(-20, y - i * 4, 1040, h);
  }
}
