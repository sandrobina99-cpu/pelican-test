import { GROUND_Y, PLATE } from "../beat/world.js";
import { bake } from "../kit/ink.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[7];

/** A garden seen from above, people from the side, three watchers at once. */
export default {
  meta,
  draw(p) {
    const g = bake(p, "mughal-1", 1000, 1000, paint);
    p.image(g, 0, 0);
  },
};

function paint(g) {
  g.background(246, 236, 214);
  border(g);
  beds(g);
  canal(g);
  tree(g, 120, 520, "#9C2B2B");
  tree(g, 300, 560, "#C4553A");
  tree(g, 700, 540, "#1F6A52");
  tree(g, 860, 500, "#1A4A6E");
  blossoms(g);
  balcony(g);
  column(g, 80, 360);
  watcher(g, 150, 760, 1);
  watcher(g, 860, 740, -1);
  tea(g, 430, 500);
  g.stroke("#8A6230");
  g.strokeWeight(2);
  g.line(40, GROUND_Y, 960, GROUND_Y);
  g.noStroke();
  g.fill("#FFF8EA");
  g.stroke("#8A6230");
  g.strokeWeight(1.5);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}

function border(g) {
  g.noFill();
  g.stroke("#C4A15A");
  g.strokeWeight(8);
  g.rect(18, 18, 964, 964);
  g.stroke("#F4E2A8");
  g.strokeWeight(2);
  g.rect(26, 26, 948, 948);
  g.stroke("#8A6230");
  g.strokeWeight(1);
  g.rect(34, 34, 932, 932);
}

function beds(g) {
  const colors = ["#1F6A52", "#9C2B2B", "#1A4A6E", "#C4553A"];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      const x = 80 + col * 140;
      const y = 620 + row * 90;
      if (y > 900) continue;
      g.stroke("#8A6230");
      g.strokeWeight(1);
      g.fill(246, 236, 214);
      g.rect(x, y, 110, 70);
      g.noStroke();
      g.fill(colors[(row + col) % 4]);
      g.rect(x + 46, y, 8, 70);
      g.rect(x, y + 31, 110, 8);
      g.fill(colors[(row + col + 1) % 4]);
      for (let i = 0; i < 4; i++) g.circle(x + 18 + (i % 2) * 64, y + 16 + Math.floor(i / 2) * 36, 8);
    }
  }
}

function canal(g) {
  g.noStroke();
  g.fill(90, 140, 160, 140);
  g.rect(470, 430, 36, 520);
  g.fill(180, 210, 214, 80);
  g.rect(478, 430, 8, 520);
}

function tree(g, x, y, bloom) {
  g.stroke("#5C3A22");
  g.strokeWeight(2);
  g.line(x, y, x, y - 70);
  g.noStroke();
  g.fill("#1F6A52");
  g.circle(x, y - 86, 46);
  g.circle(x - 16, y - 70, 28);
  g.circle(x + 18, y - 74, 26);
  g.fill(bloom);
  g.circle(x - 8, y - 96, 7);
  g.circle(x + 10, y - 84, 6);
  g.circle(x, y - 70, 5);
}

function blossoms(g) {
  g.noStroke();
  const colors = ["#C4553A", "#1A4A6E", "#E0B44A", "#9C2B2B"];
  for (let i = 0; i < 40; i++) {
    const x = 60 + ((i * 97) % 880);
    const y = 430 + ((i * 53) % 160);
    g.fill(colors[i % 4]);
    g.circle(x, y, 4 + (i % 3));
  }
}

function balcony(g) {
  g.stroke("#8A6230");
  g.strokeWeight(1.4);
  g.fill(232, 214, 180);
  g.rect(360, 250, 280, 36);
  for (let x = 368; x < 630; x += 16) g.line(x, 250, x, 286);
  watcher(g, 500, 250, -1);
}

function column(g, x, y) {
  g.stroke("#8A6230");
  g.strokeWeight(2);
  g.line(x, y, x, y + 160);
  g.line(x + 18, y, x + 18, y + 160);
  g.noStroke();
  g.fill("#F4E2A8");
  g.rect(x - 6, y - 10, 30, 12);
  g.fill("#143C2E");
  g.circle(x + 28, y + 40, 12);
  g.fill("#F7F1E4");
  g.circle(x + 30, y + 39, 4);
}

function watcher(g, x, y, face) {
  g.push();
  g.translate(x, y);
  g.scale(face, 1);
  g.noStroke();
  g.fill("#C4A06A");
  g.circle(0, -28, 10);
  g.fill("#9C2B2B");
  g.triangle(-8, -22, 8, -22, 0, 4);
  g.fill("#1A4A6E");
  g.rect(-6, -22, 12, 6);
  g.pop();
}

function tea(g, x, y) {
  g.stroke("#8A6230");
  g.strokeWeight(1.2);
  g.fill("#F7F1E4");
  g.ellipse(x, y, 70, 28);
  g.rect(x - 8, y - 22, 14, 16);
  g.line(x + 6, y - 16, x + 14, y - 12);
  g.circle(x + 22, y - 4, 10);
}
