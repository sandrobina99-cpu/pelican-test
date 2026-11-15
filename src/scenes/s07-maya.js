import { GROUND_Y, PLATE } from "../beat/world.js";
import { bake } from "../kit/ink.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[6];

/** A screenfold page. The margin count is the pedal turns, in bars and dots. */
export default {
  meta,
  draw(p, ctx) {
    const g = bake(p, "maya-1", 1000, 1000, paint);
    p.image(g, 0, 0);
    const turns = Math.max(0, Math.floor((ctx.localT || 0) + 1e-6));
    const frac = (ctx.localT || 0) - turns;
    const pop = frac < 0.16 ? frac / 0.16 : 1;
    mayaCount(p, turns, 860, 620, pop);
  },
};

function paint(g) {
  g.background(196, 154, 96);
  g.fill(92, 58, 36);
  g.rect(0, 0, 36, 1000);
  g.rect(964, 0, 36, 1000);
  sideGlyphs(g, 8);
  sideGlyphs(g, 972);
  g.noFill();
  g.stroke("#6E1A12");
  g.strokeWeight(6);
  g.rect(70, 48, 860, 900);
  g.stroke("#1A100C");
  g.strokeWeight(2);
  g.rect(86, 64, 828, 868);
  columns(g);
  scribe(g, 150, 760);
  g.noStroke();
  g.fill("#F8E7C0");
  g.stroke("#6E1A12");
  g.strokeWeight(3);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
  g.noFill();
  g.stroke("#1A100C");
  g.strokeWeight(2);
  g.rect(820, 520, 90, 160);
  g.stroke("#6E1A12");
  g.strokeWeight(2);
  g.line(70, GROUND_Y, 930, GROUND_Y);
}

function sideGlyphs(g, x) {
  g.stroke("#1A100C");
  g.strokeWeight(1.4);
  g.noFill();
  for (let i = 0; i < 12; i++) {
    const y = 40 + i * 78;
    g.rect(x, y, 20, 28);
    g.line(x + 4, y + 8, x + 16, y + 20);
  }
}

function columns(g) {
  for (let col = 0; col < 4; col++) {
    const x = 120 + col * 70;
    for (let row = 0; row < 5; row++) {
      glyph(g, x, 280 + row * 78, (col * 3 + row) % 5);
    }
  }
}

function glyph(g, x, y, kind) {
  g.stroke("#1A100C");
  g.strokeWeight(1.6);
  g.noFill();
  g.rect(x, y, 48, 58);
  if (kind === 0) {
    g.fill("#6E1A12");
    g.circle(x + 24, y + 24, 16);
  } else if (kind === 1) {
    g.line(x + 10, y + 16, x + 38, y + 16);
    g.line(x + 10, y + 30, x + 38, y + 30);
    g.circle(x + 24, y + 44, 6);
  } else if (kind === 2) {
    g.beginShape();
    g.vertex(x + 12, y + 40);
    g.vertex(x + 24, y + 12);
    g.vertex(x + 36, y + 40);
    g.endShape(g.CLOSE);
  } else if (kind === 3) {
    g.rect(x + 14, y + 14, 20, 28);
    g.line(x + 14, y + 24, x + 34, y + 24);
  } else {
    g.bezier(x + 10, y + 20, x + 24, y + 8, x + 40, y + 28, x + 16, y + 44);
  }
}

function scribe(g, x, y) {
  g.stroke("#1A100C");
  g.strokeWeight(2);
  g.fill("#C4553A");
  g.circle(x, y - 36, 16);
  g.line(x, y - 28, x, y);
  g.line(x, y - 16, x + 18, y - 6);
  g.line(x - 6, y, x - 8, y + 20);
  g.line(x + 6, y, x + 10, y + 20);
  g.line(x + 16, y - 8, x + 28, y + 4);
}

function mayaCount(p, n, x, y, pop) {
  p.push();
  p.translate(x, y);
  p.scale(0.72 + 0.28 * pop);
  p.translate(-x, -y);
  p.stroke("#1A100C");
  p.strokeWeight(3);
  p.strokeCap(p.SQUARE);
  p.noFill();
  if (n <= 0) {
    p.ellipse(x, y - 20, 28, 18);
    p.line(x - 6, y - 20, x + 6, y - 16);
  } else {
    drawNumber(p, n, x, y);
  }
  p.pop();
}

function drawNumber(p, n, x, y) {
  const bars = Math.floor(n / 5);
  const dots = n % 5;
  p.stroke("#1A100C");
  p.strokeWeight(4);
  for (let i = 0; i < bars; i++) p.line(x - 16, y - i * 16, x + 16, y - i * 16);
  p.noStroke();
  p.fill("#1A100C");
  for (let i = 0; i < dots; i++) p.circle(x, y - bars * 18 - 10 - i * 14, 8);
}
