import { GROUND_Y, PLATE } from "../beat/world.js";
import { bake } from "../kit/ink.js";
import { sectionStart } from "../beat/timeline.js";
import { SECTIONS } from "./catalog.js";

const meta = { ...SECTIONS[10], ink: "#1A3358" };

/** Flat coastal road. Not a Tokaido station and not a Fuji triangle. */
export default {
  meta,
  draw(p, ctx) {
    const g = bake(p, "ukiyo-1", 1000, 1000, paint);
    p.image(g, 0, 0);
    const local = ctx.localT ?? ctx.t - sectionStart(11);
    const gust = local > 2 && local < 4 ? Math.sin(((local - 2) / 2) * Math.PI) : 0;
    traveler(p, 360, 730, gust);
    traveler(p, 700, 700, gust * 0.7);
  },
};

function paint(g) {
  sky(g);
  g.noStroke();
  g.fill("#7FA0C4");
  g.rect(0, 430, 520, 250);
  wave(g);
  g.fill("#C4B49A");
  g.beginShape();
  g.vertex(480, 680);
  g.vertex(620, 420);
  g.vertex(760, 500);
  g.vertex(900, 360);
  g.vertex(1000, 480);
  g.vertex(1000, 760);
  g.vertex(480, 760);
  g.endShape(g.CLOSE);
  g.fill("#E7D3A4");
  g.rect(0, GROUND_Y - 16, 1000, 1000 - GROUND_Y + 20);
  village(g);
  pine(g, 560, 620);
  pine(g, 680, 560);
  pine(g, 820, 600);
  pine(g, 940, 540);
  boats(g);
  g.noStroke();
  g.fill("#FFF6EA");
  g.stroke("#1A3358");
  g.strokeWeight(3);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}

function sky(g) {
  for (let i = 0; i < 8; i++) {
    const t = i / 8;
    g.noStroke();
    g.fill(180 + t * 50, 206 + t * 30, 220 + t * 20);
    g.rect(0, i * 40, 1000, 42);
  }
  g.fill("#F4F1EA");
  g.ellipse(180, 120, 160, 36);
  g.ellipse(260, 128, 90, 28);
}

function wave(g) {
  g.stroke("#1A3358");
  g.strokeWeight(1.6);
  g.noFill();
  for (let row = 0; row < 9; row++) {
    const y = 470 + row * 22;
    g.beginShape();
    for (let x = 0; x <= 520; x += 16) {
      g.vertex(x, y + Math.sin(x * 0.08 + row) * 4);
    }
    g.endShape();
  }
}

function village(g) {
  const roofs = [
    [40, 700, 70, 48, "#C4553A"],
    [120, 680, 54, 36, "#1A3358"],
    [190, 710, 80, 40, "#8A9098"],
    [280, 690, 60, 50, "#C4553A"],
  ];
  for (const [x, y, w, h, color] of roofs) {
    g.stroke("#1A1A1A");
    g.strokeWeight(2);
    g.fill("#F4E6C8");
    g.rect(x, y - h, w, h);
    g.fill(color);
    g.triangle(x - 6, y - h, x + w / 2, y - h - 22, x + w + 6, y - h);
    g.line(x + 12, y - 16, x + 12, y);
  }
}

function pine(g, x, y) {
  g.stroke("#1A1A1A");
  g.strokeWeight(2);
  g.line(x, y, x + 4, y - 70);
  g.noFill();
  for (let i = 0; i < 5; i++) {
    const yy = y - 16 - i * 12;
    g.arc(x + 4, yy, 36 - i * 4, 18, Math.PI * 0.15, Math.PI * 0.85);
    g.arc(x - 8, yy + 4, 28 - i * 3, 14, Math.PI * 1.1, Math.PI * 1.9);
  }
}

function boats(g) {
  g.stroke("#1A1A1A");
  g.strokeWeight(1.6);
  g.noFill();
  for (const [x, y, s] of [[60, 560, 1], [200, 600, 0.7], [360, 540, 0.85]]) {
    g.beginShape();
    g.vertex(x, y);
    g.vertex(x + 20 * s, y + 8);
    g.vertex(x + 50 * s, y + 6);
    g.vertex(x + 64 * s, y);
    g.endShape();
    g.line(x + 30 * s, y, x + 30 * s, y - 22 * s);
  }
}

function traveler(p, x, y, gust) {
  p.push();
  p.translate(x, y);
  p.stroke("#1A1A1A");
  p.strokeWeight(2);
  p.fill("#F4F1EA");
  p.circle(0, -36, 10);
  p.line(0, -30, 0, -8);
  p.line(0, -22, 10, -14);
  p.line(-4, -8, -6, 8);
  p.line(4, -8, 6, 8);
  p.push();
  p.translate(2, -34);
  p.rotate(-0.5 - gust * 0.8);
  p.fill("#C4553A");
  p.arc(0, 0, 36, 28, Math.PI, 0);
  p.line(0, 0, 0, 16);
  p.pop();
  p.pop();
}
