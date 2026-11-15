import { GROUND_Y, PLATE } from "../beat/world.js";
import { bake, grain } from "../kit/ink.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[5];

/**
 * An original hump bridge. People on it have turned to look.
 * Not a tracing of Along the River During the Qingming Festival.
 */
export default {
  meta,
  draw(p) {
    const g = bake(p, "qingming-1", 1000, 1000, paint);
    p.image(g, 0, 0);
  },
};

function paint(g) {
  g.background(236, 226, 204);
  g.noStroke();
  g.fill(168, 188, 176, 150);
  g.rect(0, 800, 1000, 200);
  g.fill(186, 204, 190, 90);
  g.rect(80, 830, 840, 80);
  arch(g);
  shops(g);
  willow(g, 40, 300);
  willow(g, 900, 280);
  const watchers = [
    [120, 748, 1],
    [190, 742, 1],
    [260, 750, -1],
    [700, 746, -1],
    [780, 740, -1],
    [860, 752, 1],
  ];
  for (const [x, y, face] of watchers) person(g, x, y, face);
  person(g, 340, 700, 1);
  person(g, 640, 696, -1);
  boat(g, 430, 900);
  g.stroke(70, 52, 36, 180);
  g.strokeWeight(1.2);
  g.line(30, GROUND_Y + 8, 970, GROUND_Y + 8);
  grain(g, 0, 0, 1000, 1000, 1100, [120, 96, 64, 20], 1400);
  g.noStroke();
  g.fill(251, 246, 234, 220);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}

function arch(g) {
  g.noFill();
  g.stroke(62, 44, 30, 210);
  g.strokeWeight(2);
  g.bezier(40, 760, 220, 980, 780, 980, 960, 760);
  g.strokeWeight(1.2);
  g.bezier(40, 748, 230, 950, 770, 950, 960, 748);
  g.strokeWeight(3);
  g.line(40, 756, 960, 756);
  g.strokeWeight(1.3);
  g.line(180, 756, 250, 860);
  g.line(360, 756, 390, 910);
  g.line(560, 756, 520, 900);
  g.line(760, 756, 700, 850);
  g.strokeWeight(1.3);
  for (let x = 70; x < 940; x += 36) {
    g.line(x, 756, x, 732);
    g.line(x, 732, x + 18, 732);
  }
}

function shops(g) {
  g.stroke(58, 40, 28, 200);
  g.strokeWeight(1.3);
  g.fill(232, 214, 184, 180);
  g.rect(70, 470, 70, 90);
  g.rect(150, 500, 54, 70);
  g.fill(166, 72, 58, 90);
  g.triangle(64, 470, 105, 430, 146, 470);
  g.fill(90, 120, 110, 70);
  g.triangle(146, 500, 177, 468, 208, 500);
}

function willow(g, x, y) {
  g.noFill();
  g.stroke(48, 62, 44, 160);
  g.strokeWeight(1.1);
  for (let i = 0; i < 4; i++) {
    g.bezier(x, y, x + 16 + i * 8, y + 40, x - 8 + i * 10, y + 90, x + 20, y + 140);
  }
}

function person(g, x, y, face) {
  g.push();
  g.translate(x, y);
  g.scale(face, 1);
  g.stroke(48, 34, 24, 220);
  g.strokeWeight(1.4);
  g.noFill();
  g.circle(0, -36, 9);
  g.line(0, -31, 0, -8);
  g.line(0, -24, 10, -16);
  g.line(-4, -8, -6, 8);
  g.line(4, -8, 6, 8);
  g.line(2, -34, 12, -30);
  g.pop();
}

function boat(g, x, y) {
  g.noFill();
  g.stroke(58, 40, 28, 210);
  g.strokeWeight(1.5);
  g.bezier(x, y, x + 24, y + 16, x + 70, y + 16, x + 96, y);
  g.line(x + 46, y + 2, x + 46, y - 26);
  g.line(x + 46, y - 16, x + 70, y - 6);
  g.circle(x + 52, y - 32, 7);
}
