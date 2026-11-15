import { worldToScreen } from "../main/camera.js";
import { SANS, setFont, text } from "../kit/text2d.js";
import { drawChatPicture } from "../rig/late.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[16];

/** Fictional desktop chat. The picture inside steps at 8 frames a second. */
export default {
  meta,
  draw(p, ctx) {
    const local = ctx.localT || 0;
    const shake = local > 2 && local < 2.18 ? Math.sin(local * 90) * 10 : 0;
    p.noStroke();
    p.fill("#C5D0DC");
    p.rect(0, 0, 1000, 1000);
    p.fill("#E4EAF1");
    p.rect(0, 0, 1000, 70);
    p.push();
    p.translate(shake, 0);
    windowChrome(p);
    p.push();
    p.translate(480, 560);
    p.scale(0.85, -0.85);
    drawChatPicture(p, ctx.t || 0);
    p.pop();
    dither(p, local);
    p.pop();
  },
  overlay(ctx2d, { cam, localT, t }) {
    const shake = localT > 2 && localT < 2.18 ? Math.sin(t * 90) * 10 : 0;
    const [x, y] = worldToScreen(16000 + 150 + shake, 252, cam);
    ctx2d.fillStyle = "#F4F7FA";
    setFont(ctx2d, SANS, 22, 700);
    ctx2d.textAlign = "left";
    ctx2d.textBaseline = "top";
    text(ctx2d, "絮语", x, y);
    if (localT > 2.2) {
      setFont(ctx2d, SANS, 16, 400);
      ctx2d.fillStyle = "#D5DEE8";
      text(ctx2d, "对方正在输入…", x + 90, y + 4);
    }
    const [mx, my] = worldToScreen(16000 + 200 + shake, 320, cam);
    ctx2d.fillStyle = "#1A2330";
    setFont(ctx2d, SANS, 18, 400);
    text(ctx2d, "看这个", mx, my);
    text(ctx2d, "收到一张图", mx, my + 28);
  },
};

function windowChrome(p) {
  p.fill("#FFFFFF");
  p.rect(120, 240, 760, 560);
  p.fill("#4A6278");
  p.rect(120, 240, 760, 46);
  p.fill("#E23B4A");
  p.rect(820, 254, 16, 16);
  p.fill("#E7EDF3");
  p.rect(150, 310, 28, 28);
  p.rect(150, 380, 28, 28);
  p.fill("#F2F5F8");
  p.rect(190, 304, 240, 70);
  p.rect(200, 430, 560, 250);
  p.fill("#E7EDF3");
  p.rect(150, 710, 700, 58);
}

function dither(p, local) {
  const frame = Math.floor(local * 8);
  p.noStroke();
  p.fill(20, 24, 28, 50);
  for (let y = 440; y < 660; y += 8) {
    for (let x = 210; x < 740; x += 8) {
      if ((x + y + frame) % 12 === 0) p.rect(x, y, 2, 2);
    }
  }
}
