import { PLATE } from "../beat/world.js";
import { worldToScreen } from "../main/camera.js";
import { bake, grain } from "../kit/ink.js";
import { SERIF, setFont, text } from "../kit/text2d.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[8];

/** Almost blank. A rock, a made-up seal, and the eye. Not a copy of a specific leaf. */
export default {
  meta,
  draw(p) {
    const g = bake(p, "bada-1", 1000, 1000, paint);
    p.image(g, 0, 0);
  },
  overlay(ctx, { cam }) {
    const [x, y] = worldToScreen(8800, 168, cam);
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
  grain(g, 0, 0, 1000, 1000, 1690, [150, 130, 100, 16], 900);
  g.stroke(22, 22, 22, 210);
  g.strokeWeight(1.6);
  g.noFill();
  g.bezier(80, 820, 120, 760, 90, 700, 160, 680);
  g.bezier(150, 700, 210, 640, 180, 600, 250, 640);
  g.bezier(120, 780, 200, 800, 240, 760, 280, 790);
  g.strokeWeight(2.2);
  g.line(70, 840, 200, 860);
  g.stroke(22, 22, 22, 160);
  g.strokeWeight(1.2);
  g.bezier(820, 210, 860, 190, 900, 220, 940, 200);
  g.line(900, 206, 912, 230);
  g.line(888, 214, 870, 236);
  g.noStroke();
  g.fill(255, 253, 248, 150);
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
}
