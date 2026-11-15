import { GROUND_Y, PLATE } from "../beat/world.js";
import { mulberry32 } from "../kit/rng.js";
import { SECTIONS } from "./catalog.js";

const meta = { ...SECTIONS[0], paintLast: false };

/** Tassili-like rock panel. Herders and cattle are stopped, watching the road. */
export default {
  meta,
  draw(p) {
    const rnd = mulberry32(4000);
    p.noStroke();
    p.fill("#A15A30");
    p.rect(-8, -8, 1016, 1016);
    for (let i = 0; i < 18; i++) {
      const y = 20 + i * 48 + rnd() * 10;
      p.fill(rnd() > 0.5 ? "#C48448" : "#8A4A28");
      p.rect(0, y, 1000, 18 + rnd() * 16);
    }
    p.stroke("#3A1E10");
    p.strokeWeight(2);
    for (let i = 0; i < 14; i++) {
      let x = 40 + rnd() * 920;
      let y = 30;
      p.noFill();
      p.beginShape();
      while (y < 760) {
        p.vertex(x, y);
        x += (rnd() - 0.5) * 28;
        y += 18 + rnd() * 26;
      }
      p.endShape();
    }
    p.noStroke();
    p.fill("#E6D2A4");
    for (let i = 0; i < 70; i++) {
      p.circle(40 + rnd() * 920, 40 + rnd() * 520, 2 + rnd() * 3);
    }

    herd(p, 140, 560, -1);
    herd(p, 300, 600, 1);
    cow(p, 470, 640, 1);
    cow(p, 650, 590, -1);
    cow(p, 820, 650, 1);
    herd(p, 930, 545, -1);

    p.fill("#6B3E22");
    p.rect(0, GROUND_Y - 18, 1000, 18);
    p.fill("#8C5430");
    p.rect(0, GROUND_Y, 1000, 1000 - GROUND_Y);

    p.stroke("#4A2814");
    p.strokeWeight(3);
    p.fill("#F0D2A4");
    p.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
  },
};

function herd(p, x, y, face) {
  p.push();
  p.translate(x, y);
  p.scale(face * 1.35, 1.35);
  p.noStroke();
  p.fill("#F2E2C4");
  p.circle(0, -78, 22);
  p.fill("#E7C48A");
  p.triangle(-16, -68, 16, -68, 0, -8);
  p.stroke("#F2E2C4");
  p.strokeWeight(3);
  p.line(-6, -8, -10, 28);
  p.line(6, -8, 12, 28);
  p.line(0, -40, 22, -58);
  p.noStroke();
  p.fill("#F2E2C4");
  p.circle(24, -60, 6);
  p.pop();
}

function cow(p, x, y, face) {
  p.push();
  p.translate(x, y);
  p.scale(face * 1.35, 1.35);
  p.noStroke();
  p.fill("#F4E6C8");
  p.ellipse(0, -20, 92, 40);
  p.ellipse(-48, -28, 22, 16);
  p.stroke("#F4E6C8");
  p.strokeWeight(3);
  p.line(-56, -34, -70, -58);
  p.line(-48, -36, -46, -62);
  p.stroke("#5C3318");
  p.strokeWeight(2);
  p.line(-28, -4, -30, 22);
  p.line(-8, -2, -6, 24);
  p.line(12, -2, 14, 24);
  p.line(30, -4, 32, 22);
  p.noStroke();
  p.fill("#C47A3A");
  p.circle(-10, -22, 8);
  p.circle(16, -16, 6);
  p.pop();
}
