import { GROUND_Y } from "../beat/world.js";
import { mulberry32 } from "../kit/rng.js";
import { SECTIONS } from "./catalog.js";

const meta = { ...SECTIONS[4], paintLast: true };

/**
 * An original ink mountain, not a tracing of Travelers Among Mountains and Streams.
 * The peak is huge; the rider on the path is what the camera later finds.
 */
export default {
  meta,
  draw(p) {
    const rnd = mulberry32(1000);
    p.noStroke();
    p.fill("#E7E1D4");
    p.rect(-2400, -1700, 5800, 3600);
    p.fill("#D9D3C6");
    p.rect(-2200, 520, 5400, 1400);

    ridge(p, -900, 80, -40, 760, "#C2BBAE");
    ridge(p, 980, 40, 1760, 780, "#B7B0A4");

    p.fill("#4A4944");
    p.beginShape();
    p.vertex(180, 680);
    p.vertex(260, 180);
    p.vertex(340, -80);
    p.vertex(430, -860);
    p.vertex(520, -240);
    p.vertex(610, 40);
    p.vertex(760, 520);
    p.vertex(820, 700);
    p.vertex(180, 700);
    p.endShape(p.CLOSE);

    p.stroke("#2A2926");
    p.strokeWeight(1.1);
    for (let i = 0; i < 90; i++) {
      const x = 240 + rnd() * 500;
      const y = -700 + rnd() * 1280;
      if (y > 640) continue;
      const len = 10 + rnd() * 28;
      p.line(x, y, x + len, y + rnd() * 4);
    }

    p.stroke("#F7F4EE");
    p.strokeWeight(2);
    p.line(455, -120, 448, 420);

    pines(p, 300, 360);
    pines(p, 690, 430);
    pines(p, 560, 560);

    p.noStroke();
    p.fill("#EFEAE0");
    p.rect(210, 500, 28, 22);
    p.triangle(204, 500, 244, 500, 224, 484);

    p.fill(236, 232, 222, 70);
    p.rect(-1600, 250, 4200, 54);
    p.rect(-1200, 470, 3800, 40);

    p.fill("#C9C3B6");
    p.rect(-1800, GROUND_Y - 6, 4600, 900);
    p.fill("#E7E1D6");
    p.rect(-1800, GROUND_Y + 16, 4600, 28);

    p.noStroke();
    p.fill(244, 241, 234, 210);
    p.rect(230, 48, 540, 150);
  },
};

function ridge(p, x0, y0, x1, y1, color) {
  p.noStroke();
  p.fill(color);
  p.triangle(x0, y1, (x0 + x1) / 2, y0, x1, y1);
}

function pines(p, x, y) {
  p.stroke("#2A2926");
  p.strokeWeight(1.4);
  for (let i = 0; i < 5; i++) {
    const dx = (i - 2) * 10;
    p.line(x + dx, y, x + dx, y - 28 - (i % 2) * 10);
    p.line(x + dx, y - 16, x + dx - 8, y - 6);
    p.line(x + dx, y - 16, x + dx + 8, y - 6);
  }
}
