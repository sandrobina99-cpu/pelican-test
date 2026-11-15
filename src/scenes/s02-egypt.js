import { GROUND_Y, PLATE } from "../beat/world.js";
import { bake } from "../kit/ink.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[1];

/** Flat registers, a draft grid, a scribe. Signs are invented, not a real text. */
export default {
  meta,
  draw(p) {
    const g = bake(p, "egypt-1", 1000, 1000, paint);
    p.image(g, 0, 0);
  },
};

function paint(g) {
  g.background(214, 186, 130);
  g.stroke(176, 96, 86, 70);
  g.strokeWeight(1);
  for (let x = 0; x <= 1000; x += 48) g.line(x, 0, x, 1000);
  for (let y = 0; y <= 1000; y += 48) g.line(0, y, 1000, y);
  g.noStroke();
  g.fill(196, 168, 112, 80);
  g.rect(624, 336, 96, 96);
  frieze(g, 250);
  frieze(g, 430);
  bearers(g);
  scribe(g, 860, 700);
  cartouche(g, 640, 300);
  g.stroke("#1A2744");
  g.strokeWeight(3);
  g.line(20, GROUND_Y, 980, GROUND_Y);
  g.noStroke();
  g.fill("#F6E6B8");
  g.stroke("#1A2744");
  g.strokeWeight(2);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}

function frieze(g, y) {
  for (let i = 0; i < 8; i++) {
    const x = 40 + i * 120;
    g.noStroke();
    g.fill(i % 2 ? "#1F6A52" : "#1A4A6E");
    g.triangle(x, y, x + 18, y - 28, x + 36, y);
    g.fill("#C4553A");
    g.ellipse(x + 70, y - 8, 28, 10);
    g.stroke("#1A2744");
    g.strokeWeight(1.4);
    g.line(x + 84, y - 8, x + 100, y - 16);
  }
}

function bearers(g) {
  const spots = [40, 110, 190, 700, 780];
  for (const x of spots) person(g, x, 760, x < 400 ? 1 : -1);
}

function person(g, x, y, face) {
  g.push();
  g.translate(x, y);
  g.scale(face, 1);
  g.noStroke();
  g.fill("#C4874A");
  g.ellipse(0, -36, 14, 16);
  g.fill("#F3E6C8");
  g.triangle(-12, -28, 12, -28, 0, 8);
  g.stroke("#1A2744");
  g.strokeWeight(1.5);
  g.line(-4, 8, -6, 28);
  g.line(6, 8, 8, 28);
  g.line(0, -16, 18, -4);
  g.fill("#111");
  g.noStroke();
  g.ellipse(4, -36, 3, 6);
  g.pop();
}

function scribe(g, x, y) {
  person(g, x, y, -1);
  g.stroke("#1A2744");
  g.strokeWeight(1.4);
  g.noFill();
  g.rect(x - 36, y - 20, 22, 14);
  g.line(x - 20, y - 16, x - 8, y - 28);
}

function cartouche(g, x, y) {
  g.noFill();
  g.stroke("#1A2744");
  g.strokeWeight(2);
  g.ellipse(x, y, 150, 46);
  g.noStroke();
  g.fill("#E37A2A");
  g.circle(x - 46, y, 12);
  g.stroke("#1A4A6E");
  g.strokeWeight(2);
  g.line(x - 16, y - 10, x - 16, y + 10);
  g.line(x - 10, y - 10, x - 10, y + 10);
  g.noStroke();
  g.fill("#1F6A52");
  g.triangle(x + 8, y + 8, x + 20, y - 10, x + 32, y + 8);
  g.stroke("#1A2744");
  g.strokeWeight(1.5);
  g.line(x + 40, y, x + 58, y);
  g.line(x + 44, y - 6, x + 54, y + 6);
}
