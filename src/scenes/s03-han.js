import { GROUND_Y, PLATE } from "../beat/world.js";
import { bake, grain } from "../kit/ink.js";
import { mulberry32 } from "../kit/rng.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[2];

/** Stone rubbing. A carriage procession, and one bicycle that was not invited. */
export default {
  meta,
  draw(p) {
    const g = bake(p, "han-rub-1", 1000, 1000, paint);
    p.image(g, 0, 0);
  },
};

function paint(g) {
  g.background(18, 18, 18);
  const rnd = mulberry32(100);
  g.stroke(210, 206, 196, 28);
  for (let i = 0; i < 900; i++) {
    const x = rnd() * 1000;
    const y = rnd() * 1000;
    g.strokeWeight(rnd() < 0.2 ? 1.3 : 0.6);
    g.point(x, y);
  }
  grain(g, 0, 0, 1000, 1000, 101, [180, 176, 166, 18], 700);
  cloud(g, 180, 250);
  cloud(g, 520, 190);
  cloud(g, 760, 280);
  horse(g, 120, 700);
  carriage(g, 340, 700);
  attendant(g, 620, 730, 1);
  g.stroke(230, 226, 216, 160);
  g.strokeWeight(1.4);
  g.line(40, GROUND_Y, 960, GROUND_Y);
  g.noStroke();
  g.fill(244, 241, 234);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}

function ink(g, w = 2.2) {
  g.stroke(232, 228, 218);
  g.strokeWeight(w);
  g.noFill();
  g.strokeJoin(g.ROUND);
  g.strokeCap(g.ROUND);
}

function cloud(g, x, y) {
  ink(g, 1.5);
  g.beginShape();
  for (let i = 0; i <= 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const r = 16 + Math.sin(a * 3) * 6;
    g.vertex(x + Math.cos(a) * r * 2.1, y + Math.sin(a) * r * 0.55);
  }
  g.endShape(g.CLOSE);
  g.line(x + 34, y, x + 78, y - 10);
  g.line(x + 78, y - 10, x + 96, y + 4);
}

function horse(g, x, y) {
  g.push();
  g.translate(x, y);
  ink(g, 2.3);
  g.beginShape();
  g.vertex(8, -30);
  g.vertex(72, -38);
  g.vertex(84, -56);
  g.vertex(102, -78);
  g.vertex(128, -72);
  g.vertex(136, -58);
  g.vertex(116, -54);
  g.vertex(98, -40);
  g.vertex(76, -24);
  g.vertex(16, -16);
  g.endShape(g.CLOSE);
  g.line(24, -18, 16, 34);
  g.line(40, -22, 44, 36);
  g.line(58, -28, 52, 34);
  g.line(72, -30, 82, 32);
  g.line(10, -28, -12, -6);
  g.line(108, -76, 102, -92);
  g.pop();
}

function carriage(g, x, y) {
  g.push();
  g.translate(x, y);
  ink(g, 2.2);
  g.rect(0, -70, 86, 52);
  g.line(0, -70, 18, -96);
  g.line(18, -96, 70, -96);
  g.line(70, -96, 86, -70);
  g.circle(24, 0, 36);
  g.circle(64, 0, 36);
  g.line(-30, -20, 0, -40);
  g.line(86, -30, 120, -8);
  ink(g, 1.6);
  g.rect(16, -58, 22, 18);
  g.pop();
}

function attendant(g, x, y, face) {
  g.push();
  g.translate(x, y);
  g.scale(face, 1);
  ink(g, 2.1);
  g.circle(0, -78, 16);
  g.line(0, -70, 0, -18);
  g.line(0, -52, 22, -34);
  g.line(-10, -16, -14, 24);
  g.line(8, -16, 14, 24);
  g.line(-16, -88, 14, -92);
  g.line(14, -92, 20, -78);
  g.pop();
}
