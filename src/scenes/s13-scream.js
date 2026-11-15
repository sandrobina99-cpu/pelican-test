import { GROUND_Y, PLATE } from "../beat/world.js";
import { sectionStart } from "../beat/timeline.js";
import { smoothstep } from "../beat/cues.js";
import { bake } from "../kit/ink.js";
import { mulberry32 } from "../kit/rng.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[12];

/** A red bridge and a swirling sky. The open mouth closes on the beat. Not the fjord picture. */
export default {
  meta,
  draw(p, ctx) {
    const g = bake(p, "scream-1", 1000, 1000, paintStill);
    p.image(g, 0, 0);
    const local = ctx.localT ?? ctx.t - sectionStart(13);
    const shut = smoothstep((local - 1.85) / 0.22);
    figure(p, 560, 700, shut);
    p.noStroke();
    p.fill("#F8E1D2");
    p.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
  },
};

function paintStill(g) {
  g.background("#8A2418");
  const rnd = mulberry32(1893);
  g.noFill();
  for (let i = 0; i < 90; i++) {
    const y = 40 + rnd() * 520;
    const x = rnd() * 1000;
    g.stroke(rnd() > 0.5 ? 210 : 230, rnd() > 0.5 ? 70 : 120, 40, 160);
    g.strokeWeight(2 + rnd() * 3);
    g.bezier(x, y, x + 80, y - 40, x + 40, y + 50, x + 160, y + 10);
  }
  g.noStroke();
  g.fill("#C43A28");
  g.beginShape();
  g.vertex(0, 640);
  g.vertex(1000, 560);
  g.vertex(1000, GROUND_Y + 40);
  g.vertex(0, GROUND_Y + 80);
  g.endShape(g.CLOSE);
  g.stroke("#6A2018");
  g.strokeWeight(8);
  g.line(0, 628, 1000, 548);
  g.strokeWeight(3);
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const x = t * 1000;
    const y = 628 - t * 80;
    g.line(x, y, x, y + 36);
  }
  g.noFill();
  for (let i = 0; i < 36; i++) {
    const y = 800 + (i % 6) * 28;
    const x = (i * 70) % 1000;
    g.stroke(20, 40, 80, 150);
    g.strokeWeight(2);
    g.bezier(x, y, x + 40, y - 16, x + 20, y + 18, x + 90, y - 4);
  }
}

function figure(p, x, y, shut) {
  p.push();
  p.translate(x, y);
  p.stroke("#2A100C");
  p.strokeWeight(3);
  p.fill("#E8C2A4");
  p.ellipse(0, -78, 36, 42);
  p.line(-16, -70, -28, -40);
  p.line(16, -70, 30, -42);
  p.strokeWeight(5);
  p.line(0, -56, 0, -10);
  p.strokeWeight(3);
  p.line(-8, -8, -14, 28);
  p.line(8, -8, 16, 28);
  p.fill("#1A0C10");
  p.noStroke();
  p.circle(-6, -82, 4);
  p.circle(6, -80, 4);
  const h = 16 * (1 - shut) + 2 * shut;
  if (shut > 0.85) {
    p.stroke("#1A0C10");
    p.strokeWeight(2);
    p.line(-6, -68, 8, -68);
  } else {
    p.fill("#6A1820");
    p.ellipse(0, -68, 12, h);
  }
  p.pop();
}
