import { GROUND_Y, PLATE } from "../beat/world.js";
import { bake } from "../kit/ink.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[9];

/** A lit leather screen. The rider is the puppet; the rods are drawn with it. */
export default {
  meta,
  draw(p) {
    const g = bake(p, "wayang-1", 1000, 1000, paint);
    p.image(g, 0, 0);
  },
};

function paint(g) {
  g.background("#2A140C");
  g.noStroke();
  g.fill(90, 50, 20, 80);
  g.ellipse(500, 80, 420, 80);
  g.fill("#6A3A18");
  g.rect(0, 0, 28, 1000);
  g.rect(972, 0, 28, 1000);
  g.rect(0, 0, 1000, 28);
  for (let i = 0; i < 18; i++) {
    g.fill(i % 2 ? "#C4843A" : "#E6B15A");
    g.circle(48 + i * 52, 48, 10);
    g.circle(48 + i * 52, 960, 10);
  }
  flower(g, 120, 220);
  flower(g, 860, 260);
  flower(g, 180, 480);
  flower(g, 820, 520);
  attendant(g, 90, 700, 1);
  attendant(g, 900, 690, -1);
  g.noStroke();
  g.fill("#4A2810");
  g.rect(0, GROUND_Y - 8, 1000, 36);
  g.fill("#6A4020");
  g.ellipse(500, GROUND_Y + 28, 920, 36);
  g.fill("#F6E2B0");
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}

function flower(g, x, y) {
  g.noStroke();
  g.fill("#1A0C08");
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    g.circle(x + Math.cos(a) * 22, y + Math.sin(a) * 22, 8);
  }
  g.fill("#E6B15A");
  g.circle(x, y, 16);
  g.fill("#1A0C08");
  g.circle(x, y, 5);
}

function attendant(g, x, y, face) {
  g.push();
  g.translate(x, y);
  g.scale(face, 1);
  g.stroke("#E6B15A");
  g.strokeWeight(3);
  g.noFill();
  g.ellipse(0, -40, 18, 22);
  g.line(0, -28, 0, 10);
  g.line(0, -10, 16, 8);
  g.line(-6, 10, -8, 36);
  g.line(6, 10, 10, 36);
  g.line(8, -70, 0, -50);
  g.pop();
}
