import { PLATE } from "../beat/world.js";
import { bake, grain } from "../kit/ink.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[3];

/** Empty paper, a few willow strokes. The wind lives on the rider, not the background. */
export default {
  meta,
  draw(p) {
    const g = bake(p, "tang-line-1", 1000, 1000, paint);
    p.image(g, 0, 0);
  },
};

function paint(g) {
  g.background(246, 241, 230);
  grain(g, 0, 0, 1000, 1000, 750, [140, 116, 84, 22], 1600);
  willow(g, 70, 40);
  willow(g, 860, 20);
  g.noFill();
  g.stroke(36, 30, 26, 140);
  g.strokeWeight(1.1);
  g.bezier(620, 120, 700, 160, 760, 140, 820, 190);
  g.bezier(640, 150, 720, 210, 700, 240, 780, 250);
  g.noStroke();
  g.fill(255, 252, 247, 214);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}

function willow(g, x, y) {
  g.noFill();
  g.stroke(32, 26, 22, 190);
  g.strokeWeight(1.15);
  for (let i = 0; i < 6; i++) {
    g.bezier(
      x,
      y,
      x + 30 + i * 10,
      y + 90,
      x - 20 + i * 16,
      y + 200,
      x + 24 + i * 12,
      y + 340,
    );
  }
}
