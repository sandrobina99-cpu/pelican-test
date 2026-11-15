import { PLATE } from "../beat/world.js";
import { bake, grain } from "../kit/ink.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[13];

/** Our own stair and a high window. The pelican is only the shadow, drawn with the rig. */
export default {
  meta,
  draw(p) {
    const g = bake(p, "nosferatu-1", 1000, 1000, paint);
    p.image(g, 0, 0);
  },
};

function paint(g) {
  g.background(168, 164, 156);
  for (let i = 0; i < 18; i++) {
    g.noStroke();
    g.fill(i % 2 ? 150 : 176, i % 2 ? 146 : 172, i % 2 ? 138 : 164);
    g.rect(0, i * 56, 1000, 56);
  }
  g.noStroke();
  g.fill(214, 210, 200, 90);
  g.triangle(80, 40, 260, 40, 40, 520);
  windowPane(g, 90, 70);
  stairs(g);
  grain(g, 0, 0, 1000, 1000, 1922, [40, 36, 30, 28], 2200);
  g.noStroke();
  g.fill(236, 232, 224, 210);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}

function windowPane(g, x, y) {
  g.stroke(40, 36, 32);
  g.strokeWeight(6);
  g.noFill();
  g.rect(x, y, 120, 180);
  g.strokeWeight(2);
  g.line(x + 60, y, x + 60, y + 180);
  g.line(x, y + 90, x + 120, y + 90);
  g.noStroke();
  g.fill(230, 226, 214, 80);
  g.rect(x + 4, y + 4, 52, 82);
}

function stairs(g) {
  g.stroke(50, 46, 42);
  g.strokeWeight(3);
  g.noFill();
  let x = 80;
  let y = 860;
  for (let i = 0; i < 11; i++) {
    g.line(x, y, x + 70, y);
    g.line(x + 70, y, x + 70, y - 36);
    x += 70;
    y -= 36;
  }
  g.strokeWeight(4);
  g.line(80, 820, 860, 420);
  for (let i = 0; i < 10; i++) {
    const t = i / 9;
    const px = 80 + t * 780;
    const py = 820 - t * 400;
    g.line(px, py, px + 8, py - 28);
  }
}
