import { GROUND_Y, PLATE } from "../beat/world.js";
import { worldToScreen } from "../main/camera.js";
import { bake } from "../kit/ink.js";
import { pixelText } from "../kit/text2d.js";
import { SECTIONS } from "./catalog.js";

const meta = { ...SECTIONS[15], titleFace: "pixel" };

/** On-screen Chinese for this section. Pelican Pixel is the subset of Fusion Pixel. */
export const PIXEL_COPY = [
  "8-bit 像素游戏",
  "1980年代",
  "1980s",
  "第1关",
  "金币",
  "得分",
  "暂停",
  "鹈鹕",
  "继续骑",
];

const NIGHT = "#140C28";
const BLUE = "#241445";
const YELLOW = "#FFE14A";
const WHITE = "#F4F1EA";
const RED = "#E23B4A";

export default {
  meta,
  draw(p, ctx) {
    const g = bake(p, "pixel-1", 1000, 1000, paint);
    p.image(g, 0, 0);
    const local = ctx.localT || 0;
    const x = (local / 6) * 1000;
    if (x < 470) coin(p, 500, GROUND_Y - 70);
    coin(p, 160, GROUND_Y - 54);
    coin(p, 760, GROUND_Y - 54);
  },
  overlay(ctx, { cam, localT }) {
    const origin = 15000;
    const [x, y] = worldToScreen(origin + 48, 250, cam);
    ctx.fillStyle = YELLOW;
    pixelText(ctx, "第1关", x, y, 24);
    pixelText(ctx, "金币", x, y + 28, 24);
    const score = localT >= 2 ? "1" : "0";
    pixelText(ctx, `得分 ${score}`, x, y + 56, 24);
    if (localT > 2 && localT < 2.75) {
      const [px, py] = worldToScreen(origin + 360, 520, cam);
      ctx.fillStyle = YELLOW;
      ctx.font = '20px "Press Start 2P"';
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("1UP", Math.round(px), Math.round(py));
    }
  },
};

function paint(g) {
  g.background(NIGHT);
  g.noStroke();
  g.fill(BLUE);
  for (let i = 0; i < 6; i++) g.rect(40 + i * 160, 80 + (i % 2) * 24, 48, 16);
  for (let x = 0; x < 1000; x += 32) {
    if (x > 300 && x < 500) continue;
    g.fill(x % 64 === 0 ? YELLOW : BLUE);
    g.rect(x, GROUND_Y - 16, 32, 16);
    g.fill(BLUE);
    g.rect(x, GROUND_Y, 32, 1000 - GROUND_Y);
  }
  g.fill(NIGHT);
  g.rect(300, GROUND_Y - 16, 200, 220);
  g.fill("#3A2468");
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
  g.stroke(YELLOW);
  g.strokeWeight(4);
  g.noFill();
  g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
  bush(g, 80, GROUND_Y - 48);
  bush(g, 640, GROUND_Y - 48);
  bush(g, 880, GROUND_Y - 64);
}

function bush(g, x, y) {
  g.fill("#241445");
  g.rect(x, y, 48, 32);
  g.fill("#FFE14A");
  g.rect(x + 8, y + 8, 8, 8);
}

function coin(p, x, y) {
  p.noStroke();
  p.fill(YELLOW);
  p.rect(x, y, 16, 16);
  p.fill(NIGHT);
  p.rect(x + 6, y + 4, 4, 8);
}
