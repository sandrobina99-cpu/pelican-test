import { GROUND_Y, PLATE } from "../beat/world.js";
import { bake, grain } from "../kit/ink.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[5];

/**
 * Dense river town of our own: roofs in layers, boats, carts, a crowd
 * turned toward the rider. Not a tracing of the Qingming scroll.
 */
export default {
  meta,
  draw(p) {
    const g = bake(p, "qingming-2", 1000, 1000, paint);
    p.image(g, 0, 0);
  },
};

function paint(g) {
  g.background(232, 220, 196);
  g.noStroke();
  g.fill(186, 206, 196, 150);
  g.rect(0, 790, 1000, 220);
  g.fill(214, 206, 190, 90);
  for (let i = 0; i < 8; i++) g.rect(0, 300 + i * 28, 1000, 10);

  roofRow(g, 36, 250, 0.55, 14);
  roofRow(g, 20, 310, 0.7, 12);
  roofRow(g, 48, 380, 0.85, 10);
  shops(g, 30, 470, 1);
  shops(g, 560, 450, 1);
  willow(g, 18, 360, 1);
  willow(g, 300, 340, 0.7);
  willow(g, 860, 330, 0.9);
  willow(g, 940, 420, 0.75);
  arch(g);
  cart(g, 90, 730);
  cart(g, 800, 720);
  crowd(g);
  boat(g, 80, 860, 0.7);
  boat(g, 240, 900, 1);
  boat(g, 620, 870, 0.85);
  boat(g, 820, 930, 1.15);
  g.stroke(70, 52, 36, 160);
  g.strokeWeight(1.1);
  g.line(20, GROUND_Y + 6, 980, GROUND_Y + 6);
  grain(g, 0, 0, 1000, 1000, 1100, [120, 96, 64, 18], 1200);
  g.noStroke();
  g.fill(251, 246, 234, 228);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}

function roofRow(g, x, y, s, n) {
  g.stroke(62, 44, 30, 200);
  g.strokeWeight(1);
  for (let i = 0; i < n; i++) {
    const px = x + i * 68 * s;
    const h = (26 + (i % 4) * 10) * s;
    const w = 40 * s;
    g.fill(214, 196, 164, 200);
    g.rect(px, y - h, w, h);
    const roof = i % 3 === 0 ? [150, 64, 52, 120] : [86, 108, 96, 90];
    g.fill(roof[0], roof[1], roof[2], roof[3]);
    g.triangle(px - 4 * s, y - h, px + w / 2, y - h - 14 * s, px + w + 4 * s, y - h);
    g.line(px + 8 * s, y - h + 8 * s, px + 8 * s, y);
  }
}

function shops(g, x, y, s) {
  roofRow(g, x, y, s, 4);
  g.stroke(58, 40, 28, 210);
  g.strokeWeight(1.2);
  g.line(x, y, x + 250 * s, y);
  for (let i = 0; i < 5; i++) {
    g.line(x + i * 48 * s, y, x + i * 48 * s, y - 18 * s);
    fig(g, x + 16 * s + i * 46 * s, y + 4, 0.55, i % 2 ? 1 : -1);
  }
}

function willow(g, x, y, s) {
  g.push();
  g.translate(x, y);
  g.scale(s);
  g.noFill();
  g.stroke(46, 68, 48, 170);
  g.strokeWeight(1.1);
  for (let i = 0; i < 6; i++) {
    g.bezier(0, 0, 10 + i * 6, 30, -8 + i * 8, 70, 12 + i * 4, 120);
  }
  g.pop();
}

function arch(g) {
  g.noFill();
  g.stroke(62, 44, 30, 220);
  g.strokeWeight(2);
  g.bezier(30, 760, 200, 990, 800, 990, 970, 760);
  g.strokeWeight(1.15);
  g.bezier(30, 746, 210, 960, 790, 960, 970, 746);
  g.strokeWeight(3.2);
  g.line(24, 754, 976, 754);
  g.strokeWeight(1.2);
  for (let x = 50; x < 960; x += 28) {
    g.line(x, 754, x, 728);
    g.line(x, 728, x + 14, 728);
  }
  g.line(160, 754, 230, 880);
  g.line(340, 754, 370, 930);
  g.line(520, 754, 500, 940);
  g.line(700, 754, 660, 900);
  g.line(860, 754, 800, 860);
}

function fig(g, x, y, s, look) {
  g.push();
  g.translate(x, y);
  g.scale(look * s, s);
  g.stroke(48, 34, 24, 220);
  g.strokeWeight(1.15);
  g.noFill();
  g.circle(0, -22, 6);
  g.line(0, -19, 0, -4);
  g.line(0, -14, 7, -8);
  g.line(-3, -4, -4, 8);
  g.line(3, -4, 5, 8);
  g.line(1, -22, 8, -20);
  g.pop();
}

function crowd(g) {
  const near = [40, 100, 160, 220, 300, 680, 740, 800, 860, 930];
  near.forEach((x, i) => fig(g, x, 748, 0.95, x < 500 ? 1 : -1));
  const far = [140, 200, 260, 360, 620, 700, 780];
  far.forEach((x) => fig(g, x, 700, 0.62, x < 500 ? 1 : -1));
  for (let i = 0; i < 11; i++) fig(g, 70 + i * 28, 640, 0.45, i % 2 ? 1 : -1);
  fig(g, 480, 790, 0.8, -1);
  fig(g, 540, 800, 0.8, 1);
}

function cart(g, x, y) {
  g.stroke(58, 40, 28, 220);
  g.strokeWeight(1.3);
  g.noFill();
  g.rect(x, y - 28, 46, 22);
  g.circle(x + 10, y, 14);
  g.circle(x + 34, y, 14);
  g.line(x + 46, y - 16, x + 64, y - 4);
  fig(g, x + 58, y + 2, 0.7, 1);
}

function boat(g, x, y, s) {
  g.push();
  g.translate(x, y);
  g.scale(s);
  g.noFill();
  g.stroke(58, 40, 28, 220);
  g.strokeWeight(1.4);
  g.bezier(0, 0, 28, 18, 78, 18, 108, 0);
  g.line(40, 4, 40, -30);
  g.line(70, 2, 70, -22);
  g.line(40, -18, 78, -6);
  fig(g, 48, -2, 0.7, 1);
  fig(g, 24, 2, 0.6, -1);
  g.pop();
}
