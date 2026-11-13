import { CUES, ramp, smoothstep } from "../beat/cues.js";
import { OUTRO_START, sectionStart } from "../beat/timeline.js";
import { poseAt } from "../rig/pose.js";
import { drawRig } from "../rig/draw.js";
import { ANCHOR_X, GRID, GROUND_Y, OUT_H, OUT_W } from "../beat/world.js";
import { SECTIONS } from "./catalog.js";
import { SANS, SERIF, roundRect, setFont, text } from "../kit/text2d.js";

export function cellRect(k) {
  const i = k - 1;
  const col = i % GRID.cols;
  const row = Math.floor(i / GRID.cols);
  const step = GRID.cell + GRID.gap;
  return {
    x: GRID.x + col * step,
    y: GRID.y + row * step,
    w: GRID.cell,
    h: GRID.cell,
  };
}

function lerpView(a, b, u) {
  return {
    x: a.x + (b.x - a.x) * u,
    y: a.y + (b.y - a.y) * u,
    w: a.w + (b.w - a.w) * u,
    h: a.h + (b.h - a.h) * u,
  };
}

function fullView() {
  return { x: 0, y: 0, w: OUT_W, h: OUT_H };
}

function pullStart() {
  const w = 1500;
  const h = (w * OUT_H) / OUT_W;
  return { x: (OUT_W - w) / 2, y: (OUT_H - h) / 2, w, h };
}

function cellClose(cell) {
  const viewH = cell.h * 1.34;
  const viewW = (viewH * OUT_W) / OUT_H;
  const cx = cell.x + cell.w / 2;
  const cy = cell.y + cell.h / 2 + 36;
  return { x: cx - viewW / 2, y: cy - viewH / 2, w: viewW, h: viewH };
}

export function outroView(t) {
  const wide = fullView();
  const start = pullStart();
  const close = cellClose(cellRect(21));
  if (t <= OUTRO_START) return start;
  if (t < CUES.outroPullEnd) {
    const u = smoothstep((t - OUTRO_START) / (CUES.outroPullEnd - OUTRO_START));
    return lerpView(start, wide, u);
  }
  if (t < CUES.outroPushStart) return wide;
  if (t < CUES.outroPushEnd) {
    const u = smoothstep((t - CUES.outroPushStart) / (CUES.outroPushEnd - CUES.outroPushStart));
    return lerpView(wide, close, u);
  }
  return close;
}

function designToScreen(view, x, y) {
  const s = OUT_W / view.w;
  return [(x - view.x) * s, (y - view.y) * s];
}

function thumbInk(meta) {
  const hex = meta.bg.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? "#1a140e" : "#f6f1e6";
}

function flashAlpha(t) {
  let a = 0;
  for (const tf of CUES.flashes) {
    const d = (t - tf) / 0.09;
    const g = Math.exp(-d * d);
    if (g > a) a = g;
  }
  return a * 0.5;
}

function drawThumb(p, meta) {
  const cell = cellRect(meta.id);
  p.push();
  p.translate(cell.x, cell.y);
  p.scale(cell.w / 1000);
  p.noStroke();
  p.fill(meta.bg);
  p.rect(0, 0, 1000, 1000);
  p.fill(meta.road);
  p.rect(0, GROUND_Y, 1000, 1000 - GROUND_Y);
  const pose = poseAt(sectionStart(meta.id) + 3);
  p.push();
  p.translate(500 - ANCHOR_X, GROUND_Y - 10);
  p.scale(1, -1);
  drawRig(p, pose, "default");
  p.pop();
  p.pop();
}

function drawPressSet(p, t) {
  const cell = cellRect(21);
  p.push();
  p.translate(cell.x, cell.y);
  p.scale(cell.w / 1000);

  p.noStroke();
  p.fill("#1c2433");
  p.rect(0, 0, 1000, 1000);
  p.fill("#283044");
  p.rect(0, 0, 1000, 70);
  p.rect(0, 930, 1000, 70);

  const u = (t - (CUES.flypast - CUES.flypastHalf)) / (CUES.flypastHalf * 2);
  if (u > -0.05 && u < 1.05) {
    const ghosts = [
      { du: 0.28, a: 50 },
      { du: 0.18, a: 90 },
      { du: 0.08, a: 150 },
      { du: 0, a: 255 },
    ];
    for (const g of ghosts) {
      const gu = u - g.du;
      if (gu <= -0.02 || gu >= 1.02) continue;
      const x = -40 + gu * 1080;
      p.push();
      p.translate(x, 500);
      p.scale(0.92, -0.92);
      p.tint(255, g.a);
      drawRig(p, poseAt(t, { headTurn: 0 }), "default");
      p.noTint();
      p.pop();
    }
  }

  // Empty chair in front of the rider. A solid back, a seat, no one in it.
  p.noTint();
  const gl = p.drawingContext;
  gl.disable(gl.DEPTH_TEST);
  gl.depthFunc(gl.ALWAYS);
  p.noStroke();
  p.fill("#2c3548");
  p.rect(360, 210, 280, 250);
  p.fill("#1a2030");
  p.rect(348, 210, 16, 270);
  p.rect(636, 210, 16, 270);
  p.rect(348, 198, 304, 18);
  p.fill("#3c4860");
  p.rect(330, 448, 340, 28);
  p.fill("#1a2030");
  p.rect(360, 476, 14, 90);
  p.rect(626, 476, 14, 90);

  // table
  p.fill("#6b4a2e");
  p.rect(70, 690, 860, 28);
  p.fill("#543920");
  p.rect(90, 718, 820, 150);

  // five generic mics, no marks
  for (let i = 0; i < 5; i++) {
    const x = 180 + i * 160;
    p.fill("#1a1c20");
    p.rect(x - 6, 560, 12, 140);
    p.fill("#8d949c");
    p.ellipse(x, 545, 62, 78);
    p.fill("#d5dbe2");
    p.ellipse(x, 534, 36, 28);
    p.fill("#1a1c20");
    p.ellipse(x, 700, 46, 16);
  }

  // name card on the front of the table, below the mic heads
  p.fill("#f4efe4");
  p.stroke("#1a120c");
  p.strokeWeight(3);
  p.rect(330, 748, 340, 64);
  p.noStroke();

  p.pop();
}

export function paintOutro(p, ctx, t) {
  const view = outroView(t);
  const scale = OUT_W / view.w;

  // enterStage already put the origin at the top-left of the screen.
  p.push();
  p.scale(scale);
  p.translate(-view.x, -view.y);

  p.noStroke();
  p.fill("#100e0c");
  p.rect(-600, -600, 3200, 2400);
  p.fill("#1a1612");
  p.rect(GRID.x - 28, GRID.y - 28, 7 * 248 + 28, 3 * 248 + 4);

  for (const meta of SECTIONS) drawThumb(p, meta);
  drawPressSet(p, t);

  p.noFill();
  p.stroke("#f4efe4");
  p.strokeWeight(3);
  for (let k = 1; k <= 21; k++) {
    const c = cellRect(k);
    p.rect(c.x, c.y, c.w, c.h);
  }
  p.pop();

  const s = scale;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (const meta of SECTIONS) {
    const c = cellRect(meta.id);
    const [sx, sy] = designToScreen(view, c.x + c.w / 2, c.y + 10);
    if (sx < -200 || sx > OUT_W + 200 || sy < -80 || sy > OUT_H + 40) continue;
    ctx.fillStyle = thumbInk(meta);
    setFont(ctx, SANS, Math.max(12, 20 * s), 700);
    text(ctx, meta.zh, sx, sy);
  }

  const card = cellRect(21);
  const cardArtX = card.x + (500 / 1000) * card.w;
  const cardArtY = card.y + (762 / 1000) * card.h;
  const [nx, ny] = designToScreen(view, cardArtX, cardArtY);
  const nameSize = Math.max(10, 42 * (card.w / 1000) * s);
  if (ny > -40 && ny < OUT_H - 10) {
    ctx.fillStyle = "#1a120c";
    setFont(ctx, SERIF, nameSize, 600);
    text(ctx, "鹈鹕（本人）", nx, ny);
  }

  const cap1 = ramp(t, 125.72, CUES.outroCaption1) * (1 - ramp(t, CUES.outroCaption1Out, CUES.outroCaption1Gone));
  const cap2 = ramp(t, 133.72, CUES.outroCaption2);
  drawCaption(ctx, cap1, "截至目前，人类共提交了 20 份答卷。");
  drawCaption(ctx, cap2, "鹈鹕本人对此尚未发表评论。");

  const flash = flashAlpha(t);
  if (flash > 0.015) {
    ctx.fillStyle = `rgba(255,255,255,${flash})`;
    ctx.fillRect(0, 0, OUT_W, OUT_H);
  }
}

function drawCaption(ctx, alpha, line) {
  if (alpha < 0.02) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(12,10,8,0.78)";
  const w = 980;
  roundRect(ctx, (OUT_W - w) / 2, 900, w, 78, 8);
  ctx.fill();
  ctx.fillStyle = "#f6f1e6";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  setFont(ctx, SERIF, 36, 600);
  text(ctx, line, OUT_W / 2, 940);
  ctx.restore();
}
