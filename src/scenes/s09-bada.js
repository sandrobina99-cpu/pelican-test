import { PLATE } from "../beat/world.js";
import { worldToScreen } from "../main/camera.js";
import { bake, grain } from "../kit/ink.js";
import { SERIF, setFont, text } from "../kit/text2d.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[8];

/** Still mostly paper. One wet rock, one fish with the turned eye, the rider in the gap. */
export default {
  meta,
  draw(p) {
    const g = bake(p, "bada-2", 1000, 1000, paint);
    p.image(g, 0, 0);
  },
  overlay(ctx, { cam }) {
    const [x, y] = worldToScreen(8720, 250, cam);
    if (x < -60 || x > 1980) return;
    ctx.save();
    ctx.fillStyle = "#9C2A2A";
    ctx.fillRect(Math.round(x), Math.round(y), 42, 46);
    ctx.fillStyle = "#F6E6D4";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    setFont(ctx, SERIF, 16, 600);
    text(ctx, "涉", x + 21, y + 14);
    text(ctx, "事", x + 21, y + 32);
    ctx.restore();
  },
};

function paint(g) {
  g.background(247, 244, 238);
  grain(g, 0, 0, 1000, 1000, 1690, [150, 130, 100, 14], 700);
  rock(g);
  fish(g, 620, 390);
  g.noStroke();
  g.fill(255, 253, 248, 150);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}

function rock(g) {
  g.noStroke();
  g.fill(30, 30, 28, 28);
  g.ellipse(150, 860, 280, 120);
  g.fill(18, 18, 16, 235);
  g.beginShape();
  g.vertex(40, 960);
  g.vertex(36, 840);
  g.vertex(90, 760);
  g.vertex(150, 790);
  g.vertex(210, 730);
  g.vertex(250, 800);
  g.vertex(230, 900);
  g.vertex(140, 980);
  g.endShape(g.CLOSE);
  g.noFill();
  g.stroke(18, 18, 16, 180);
  g.strokeWeight(1.4);
  g.bezier(70, 820, 120, 780, 160, 830, 200, 790);
  g.line(100, 900, 180, 860);
}

function fish(g, x, y) {
  g.push();
  g.translate(x, y);
  g.noStroke();
  g.fill(16, 16, 16, 230);
  g.ellipse(0, 0, 92, 36);
  g.triangle(40, 0, 78, -22, 78, 22);
  g.fill(246, 243, 236);
  g.circle(-18, -2, 18);
  g.fill(12, 12, 12);
  g.circle(-18, -7, 5);
  g.stroke(16, 16, 16, 200);
  g.strokeWeight(1.1);
  g.line(-46, -6, -62, -16);
  g.line(-46, 4, -64, 8);
  g.pop();
}
