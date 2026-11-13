import { gagEnergy, INTRO_DUR, OUTRO_START, sectionStart, TOTAL } from "../beat/timeline.js";
import { ramp } from "../beat/cues.js";
import { GROUND_Y, OUT_H, OUT_W, PLATE, PORTAL, TITLE } from "../beat/world.js";
import { cameraAt, pxPerUnit, viewSize, worldToScreen } from "./camera.js";
import { enterStage } from "../kit/stage.js";
import { SANS, SERIF, setFont, text } from "../kit/text2d.js";
import { eraLine } from "../scenes/catalog.js";
import { SCENES } from "../scenes/index.js";
import { paintIntro } from "../scenes/intro.js";
import { paintOutro } from "../scenes/outro.js";
import { poseAt } from "../rig/pose.js";
import { drawRig } from "../rig/draw.js";

function drawPortal(p, cam, x) {
  const s = pxPerUnit(cam);
  const [sx, sy] = worldToScreen(x, 0, cam);
  p.push();
  p.translate(sx, sy);
  p.scale(s);
  p.rectMode(p.CORNER);
  const { half, top, bot } = PORTAL;
  const h = bot - top;
  p.noFill();
  p.stroke("#1a120c");
  p.strokeWeight(26);
  p.rect(-half, top, half * 2, h);
  p.stroke("#f7f1e6");
  p.strokeWeight(10);
  p.rect(-half, top, half * 2, h);
  p.stroke("#1a120c");
  p.strokeWeight(3.5);
  p.rect(-half + 18, top + 18, half * 2 - 36, h - 36);
  p.pop();
}

function drawRoadMarks(p, cam) {
  const { w } = viewSize(cam);
  const left = cam.x - w / 2 - 20;
  const right = cam.x + w / 2 + 20;
  const y = GROUND_Y;
  const [x0, y0] = worldToScreen(left, y, cam);
  const [x1] = worldToScreen(right, y, cam);
  const weight = Math.max(2, 3.2 * (pxPerUnit(cam) / 1.08));
  p.stroke(20, 14, 10, 150);
  p.strokeWeight(weight);
  p.line(x0, y0, x1, y0);

  const dashY = GROUND_Y + 62;
  const period = 92;
  const dash = 38;
  let x = Math.floor(left / period) * period;
  p.strokeCap(p.SQUARE);
  for (; x < right; x += period) {
    const [ax, ay] = worldToScreen(x, dashY, cam);
    const [bx] = worldToScreen(x + dash, dashY, cam);
    p.stroke(24, 18, 12, 110);
    p.strokeWeight(weight);
    p.line(ax, ay + 2, bx, ay + 2);
    p.stroke(255, 248, 236, 180);
    p.strokeWeight(Math.max(1.4, weight * 0.62));
    p.line(ax, ay, bx, ay);
  }
}

function paintWorld(p, ctx, t) {
  const cam = cameraAt(t);
  const { w } = viewSize(cam);
  const left = cam.x - w / 2 - 80;
  const right = cam.x + w / 2 + 80;
  const [x0, y0] = worldToScreen(left, 0, cam);
  const [x1, y1] = worldToScreen(right, 1000, cam);
  p.noStroke();
  p.fill("#e6dcc6");
  p.rect(x0, y0, x1 - x0, y1 - y0);

  const k0 = Math.max(1, Math.floor(left / 1000) + 1);
  const k1 = Math.min(20, Math.floor((right - 1) / 1000) + 1);
  const unit = pxPerUnit(cam);

  for (let k = k0; k <= k1; k++) {
    const origin = (k - 1) * 1000;
    const [sx, sy] = worldToScreen(origin, 0, cam);
    const localT = t - sectionStart(k);
    p.push();
    p.translate(sx, sy);
    p.scale(unit);
    SCENES[k - 1].draw(p, { t, localT, gag: gagEnergy(localT) });
    p.pop();
  }

  drawRoadMarks(p, cam);

  for (let k = Math.max(1, k0); k <= k1 + 1; k++) {
    const portalX = (k - 1) * 1000;
    if (portalX < left - 400 || portalX > right + 400) continue;
    drawPortal(p, cam, portalX);
  }

  const pose = poseAt(t);
  const [rx, ry] = worldToScreen(pose.worldX - pose.anchorX, GROUND_Y, cam);
  p.push();
  p.translate(rx, ry);
  p.scale(unit, -unit);
  const gl = p.drawingContext;
  gl.disable(gl.CULL_FACE);
  drawRig(p, pose, "default");
  p.pop();

  const titleAlpha = t >= INTRO_DUR ? 1 : ramp(t, 4.72, INTRO_DUR);
  if (titleAlpha > 0.03) {
    ctx.save();
    ctx.globalAlpha = titleAlpha;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let k = k0; k <= k1; k++) {
      const meta = SCENES[k - 1].meta;
      const origin = (k - 1) * 1000;
      const cx = origin + PLATE.x + PLATE.w / 2;
      const [tx, ty] = worldToScreen(cx, TITLE.zh.y, cam);
      if (tx < -360 || tx > OUT_W + 360) continue;
      ctx.fillStyle = meta.ink;
      setFont(ctx, SERIF, TITLE.zh.size * unit, 600);
      text(ctx, meta.zh, tx, ty);
      const [ex, ey] = worldToScreen(cx, TITLE.en.y, cam);
      setFont(ctx, SANS, TITLE.en.size * unit, 400);
      text(ctx, meta.en, ex, ey);
      const [ax, ay] = worldToScreen(cx, TITLE.era.y, cam);
      setFont(ctx, SANS, TITLE.era.size * unit, 700);
      text(ctx, eraLine(meta), ax, ay);
    }
    ctx.restore();
  }
}

/**
 * Pure frame: world, intro, or outro for time t.
 * `paper` is unused; the intro redraws its page from a fixed seed.
 */
export function renderFilm(p, ctx, t, paper) {
  const tt = Math.min(TOTAL, Math.max(0, t));
  enterStage(p);
  p.noTint();
  p.background("#14110e");
  ctx.clearRect(0, 0, OUT_W, OUT_H);
  ctx.globalAlpha = 1;

  if (tt >= OUTRO_START) {
    paintOutro(p, ctx, tt);
    return;
  }

  paintWorld(p, ctx, tt);
  if (tt < INTRO_DUR) paintIntro(p, ctx, tt, paper);
}
