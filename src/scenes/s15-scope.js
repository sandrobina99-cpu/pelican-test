import { PLATE } from "../beat/world.js";
import { sectionStart } from "../beat/timeline.js";
import { smoothstep } from "../beat/cues.js";
import { SECTIONS } from "./catalog.js";

const meta = { ...SECTIONS[14], plate: "#04140C" };

/** Round green scope. A hand turns our own knob; the trace folds, then snaps back. */
export default {
  meta,
  draw(p, ctx) {
    const local = ctx.localT ?? ctx.t - sectionStart(15);
    p.noStroke();
    p.fill("#04140C");
    p.rect(-20, -20, 1040, 1040);
    p.fill("#021008");
    p.circle(500, 560, 760);
    p.noFill();
    p.stroke(40, 90, 50, 80);
    p.strokeWeight(1);
    for (let y = 200; y < 940; y += 6) p.line(140, y, 860, y);
    p.stroke("#16301C");
    p.strokeWeight(10);
    p.circle(500, 560, 780);
    p.stroke("#2A4A32");
    p.strokeWeight(3);
    p.circle(500, 560, 800);
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      p.stroke("#7DFF9A");
      p.strokeWeight(i % 2 ? 1 : 2);
      p.line(500 + Math.cos(a) * 360, 560 + Math.sin(a) * 360, 500 + Math.cos(a) * 378, 560 + Math.sin(a) * 378);
    }
    const turn = smoothstep((local - 1.55) / 0.4) * (1 - smoothstep((local - 2.35) / 0.25));
    knob(p, 760, 430, turn);
    if (turn > 0.02) hand(p, 760, 430, turn, local);
    p.noStroke();
    p.fill(8, 24, 14, 210);
    p.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
  },
};

function knob(p, x, y, turn) {
  p.push();
  p.translate(x, y);
  p.rotate(turn * 1.4);
  p.stroke("#9AA4A0");
  p.strokeWeight(3);
  p.fill("#3A403C");
  p.circle(0, 0, 36);
  p.stroke("#D5DBD6");
  p.strokeWeight(2);
  p.line(0, 0, 0, -14);
  p.pop();
}

function hand(p, x, y, turn, local) {
  const reach = smoothstep((local - 1.35) / 0.35) * (1 - smoothstep((local - 2.7) / 0.35));
  p.push();
  p.translate(x + 70 - reach * 54, y + 10);
  p.rotate(-0.4 + turn * 0.6);
  p.stroke("#C4B2A0");
  p.strokeWeight(8);
  p.line(40, 20, 0, 0);
  p.strokeWeight(4);
  for (let i = 0; i < 4; i++) p.line(0, 0, -8 + i * 6, -16);
  p.pop();
}
