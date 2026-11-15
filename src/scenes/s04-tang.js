import { PLATE } from "../beat/world.js";
import { bake, grain } from "../kit/ink.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[3];

/** Fine ink line only: a courtyard, drapery, a horse, attendants. No wash. */
export default {
  meta,
  draw(p) {
    const g = bake(p, "tang-line-2", 1000, 1000, paint);
    p.image(g, 0, 0);
  },
};

function ink(g, w = 1.15) {
  g.noFill();
  g.stroke(28, 24, 20, 210);
  g.strokeWeight(w);
  g.strokeCap(g.ROUND);
  g.strokeJoin(g.ROUND);
}

function paint(g) {
  g.background(246, 241, 230);
  grain(g, 0, 0, 1000, 1000, 750, [140, 116, 84, 22], 1600);
  willow(g, 40, 30);
  willow(g, 900, 16);
  pavilion(g, 70, 430);
  screen(g, 620, 360);
  horse(g, 250, 700);
  groom(g, 200, 730);
  courtier(g, 430, 640, 1);
  courtier(g, 560, 660, -1);
  attendant(g, 780, 700, -1);
  g.noStroke();
  g.fill(255, 252, 247, 220);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}

function willow(g, x, y) {
  ink(g, 1.05);
  for (let i = 0; i < 8; i++) {
    g.bezier(x, y, x + 24 + i * 8, y + 80, x - 16 + i * 12, y + 190, x + 18 + i * 9, y + 320);
  }
}

function pavilion(g, x, y) {
  ink(g, 1.3);
  g.line(x, y, x + 150, y - 46);
  g.line(x + 150, y - 46, x + 210, y);
  g.line(x + 8, y, x + 158, y - 40);
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    const ax = x + t * 150;
    const ay = y - t * 46;
    g.line(ax, ay, ax + 4, ay + 10);
  }
  ink(g, 1.15);
  g.line(x + 28, y, x + 28, y + 120);
  g.line(x + 78, y - 16, x + 78, y + 110);
  g.line(x + 128, y - 32, x + 128, y + 100);
  g.line(x + 176, y - 8, x + 176, y + 112);
  g.rect(x + 40, y + 20, 36, 48);
  g.line(x + 40, y + 36, x + 76, y + 36);
  g.line(x + 58, y + 20, x + 58, y + 68);
}

function screen(g, x, y) {
  ink(g, 1.1);
  g.rect(x, y, 150, 90);
  g.bezier(x + 16, y + 30, x + 40, y + 10, x + 70, y + 48, x + 100, y + 24);
  g.bezier(x + 20, y + 58, x + 55, y + 40, x + 90, y + 70, x + 130, y + 50);
  g.line(x + 70, y + 90, x + 70, y + 108);
  g.line(x + 40, y + 108, x + 110, y + 108);
}

function horse(g, x, y) {
  g.push();
  g.translate(x, y);
  ink(g, 1.25);
  g.beginShape();
  g.vertex(0, -20);
  g.vertex(70, -28);
  g.vertex(86, -48);
  g.vertex(108, -70);
  g.vertex(132, -64);
  g.vertex(140, -50);
  g.vertex(118, -46);
  g.vertex(100, -30);
  g.vertex(74, -12);
  g.vertex(8, -6);
  g.endShape(g.CLOSE);
  g.line(16, -8, 8, 28);
  g.line(34, -12, 38, 30);
  g.line(54, -16, 48, 28);
  g.line(70, -18, 80, 26);
  g.line(4, -18, -16, 4);
  g.line(112, -68, 106, -84);
  for (let i = 0; i < 4; i++) g.line(20 + i * 8, -16, 8 + i * 6, -4);
  g.pop();
}

function groom(g, x, y) {
  g.push();
  g.translate(x, y);
  ink(g, 1.15);
  g.circle(0, -62, 12);
  g.bezier(-8, -50, -16, -30, -6, -16, 0, -8);
  g.bezier(8, -48, 18, -28, 8, -12, 2, -8);
  g.line(-4, -8, -10, 22);
  g.line(4, -8, 8, 22);
  g.bezier(-18, -40, -36, -20, -28, 0, -8, 6);
  g.pop();
}

function courtier(g, x, y, face) {
  g.push();
  g.translate(x, y);
  g.scale(face, 1);
  ink(g, 1.15);
  g.circle(0, -78, 13);
  g.bezier(-6, -72, -4, -88, 10, -90, 16, -74);
  g.bezier(-18, -60, -30, -20, -16, 10, 0, 16);
  g.bezier(16, -58, 34, -16, 18, 12, 2, 16);
  g.bezier(-28, -36, -70, -10, -90, 20, -40, 28);
  g.bezier(20, -30, 48, -6, 36, 18, 8, 10);
  g.line(-8, 16, -12, 40);
  g.line(8, 16, 14, 40);
  g.line(4, -76, 16, -70);
  g.pop();
}

function attendant(g, x, y, face) {
  g.push();
  g.translate(x, y);
  g.scale(face, 1);
  ink(g, 1.1);
  g.circle(0, -58, 11);
  g.bezier(-10, -46, -18, -10, -6, 8, 0, 12);
  g.bezier(10, -46, 22, -8, 8, 10, 2, 12);
  g.line(0, -20, 24, -6);
  g.line(-6, 12, -8, 34);
  g.line(6, 12, 10, 34);
  g.bezier(8, -40, 30, -50, 46, -30, 28, -8);
  g.pop();
}
