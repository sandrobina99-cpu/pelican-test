import { GROUND_Y } from "../beat/world.js";
import { smoothstep } from "../beat/cues.js";
import { SANS, setFont, text } from "../kit/text2d.js";
import { SECTIONS } from "./catalog.js";

const meta = { ...SECTIONS[18], skipTitle: true };

const COMMENTS = [
  "这也太一本正经了",
  "进度条别走那么快",
  "第19份答卷",
  "画框要到了",
  "谁在骑这辆车",
  "再看一遍",
];

/** Fictional short-video shell. Not a real app, icon, or name. */
export default {
  meta,
  draw(p) {
    p.noStroke();
    for (let i = 0; i < 12; i++) {
      p.fill(18 + i * 2, 20 + i, 28);
      p.rect(0, i * 70, 1000, 70);
    }
    p.fill("#1A1C24");
    for (let i = 0; i < 5; i++) {
      const h = 80 + (i % 3) * 40;
      p.rect(40 + i * 70, GROUND_Y - 160 - h, 48, h);
    }
    p.fill("#12141A");
    p.rect(0, GROUND_Y - 8, 1000, 1000 - GROUND_Y + 12);
    p.fill("#F2C14E");
    for (let x = 40; x < 1000; x += 70) p.rect(x, GROUND_Y + 36, 28, 6);
  },
  overlay(ctx, { localT }) {
    const open = smoothstep(localT / 0.42);
    const close = smoothstep((localT - 5.55) / 0.4);
    const squeeze = open * (1 - close);
    const colW = 1080 * (9 / 16);
    const fullInset = (1920 - colW) / 2;
    const inset = fullInset * squeeze;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, inset, 1080);
    ctx.fillRect(1920 - inset, 0, inset, 1080);
    if (squeeze < 0.2) return;

    const x0 = inset;
    const x1 = 1920 - inset;
    const w = x1 - x0;
    ctx.fillStyle = "#F4F1EA";
    setFont(ctx, SANS, 28, 700);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    text(ctx, "翎页", x0 + 28, 36);
    setFont(ctx, SANS, 18, 400);
    ctx.fillStyle = "#D9D3C8";
    text(ctx, "竖屏短视频  ·  2020s", x0 + 108, 42);

    const railX = x1 - 78;
    icon(ctx, railX, 280, "heart");
    count(ctx, railX, 328, likes(localT));
    icon(ctx, railX, 400, "chat");
    count(ctx, railX, 448, String(12 + Math.floor(localT * 3)));
    icon(ctx, railX, 520, "share");

    const progress = Math.max(0, Math.min(1, localT / 6));
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.fillRect(x0 + 24, 1000, w - 48, 6);
    ctx.fillStyle = "#F2C14E";
    ctx.fillRect(x0 + 24, 1000, (w - 48) * progress, 6);

    ctx.fillStyle = "#F4F1EA";
    setFont(ctx, SANS, 22, 700);
    text(ctx, "@羽人手记", x0 + 28, 900);
    setFont(ctx, SANS, 20, 400);
    text(ctx, "路过一道画框", x0 + 28, 932);

    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, 140, w - 120, 420);
    ctx.clip();
    setFont(ctx, SANS, 22, 700);
    for (let i = 0; i < COMMENTS.length; i++) {
      const y = 500 - ((localT * 86 + i * 92) % 340);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "rgba(16,16,20,0.45)";
      const label = COMMENTS[i];
      ctx.fillRect(x0 + 24, y - 6, label.length * 22 + 20, 34);
      ctx.fillStyle = "#F7F4EE";
      text(ctx, label, x0 + 34, y);
    }
    ctx.restore();
  },
};

function likes(localT) {
  const burst = localT >= 3 ? 860 : 0;
  return String(240 + Math.floor(localT * 36) + burst);
}

function count(ctx, x, y, label) {
  ctx.fillStyle = "#F4F1EA";
  ctx.textAlign = "center";
  setFont(ctx, SANS, 16, 700);
  text(ctx, label, x, y);
  ctx.textAlign = "left";
}

function icon(ctx, x, y, kind) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = "#F4F1EA";
  ctx.fillStyle = "#F4F1EA";
  ctx.lineWidth = 3;
  if (kind === "heart") {
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.bezierCurveTo(-22, -8, -8, -20, 0, -8);
    ctx.bezierCurveTo(8, -20, 22, -8, 0, 8);
    ctx.fill();
  } else if (kind === "chat") {
    ctx.strokeRect(-16, -14, 32, 24);
    ctx.beginPath();
    ctx.moveTo(-6, 10);
    ctx.lineTo(0, 18);
    ctx.lineTo(6, 10);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(-14, 2);
    ctx.lineTo(10, 2);
    ctx.moveTo(2, -8);
    ctx.lineTo(14, 2);
    ctx.lineTo(2, 12);
    ctx.stroke();
  }
  ctx.restore();
}
