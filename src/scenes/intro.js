import { CUES, ramp } from "../beat/cues.js";
import { poseAt } from "../rig/pose.js";
import { drawRig } from "../rig/draw.js";
import { drawPaper } from "../kit/paper.js";
import { SERIF, setFont, text } from "../kit/text2d.js";

/** Pencil plate baked into the paper texture so it fades with the page. */
export function drawSketchPlate(p) {
  p.push();
  p.translate(68, 612);
  p.noStroke();
  p.fill("#fbf7f0");
  p.rect(0, 0, 408, 300);
  p.noFill();
  p.stroke("#3a322a");
  p.strokeWeight(3);
  p.rect(0, 0, 408, 300);
  p.strokeWeight(1);
  p.rect(9, 9, 390, 282);
  p.push();
  p.translate(86, 248);
  p.scale(0.86, -0.86);
  drawRig(p, poseAt(0.18), "pencil");
  p.pop();
  p.pop();
}

export function paintIntro(p, ctx, t, _paper) {
  const veil = 1 - ramp(t, CUES.introReveal, CUES.introRevealEnd);
  if (veil > 0.004) {
    drawPaper(p, veil);
    p.tint(255, Math.round(veil * 255));
    drawSketchPlate(p);
    p.noTint();
  }

  const leave = 1 - ramp(t, CUES.introCaptionOut, CUES.introCaptionGone);
  const sketchA = ramp(t, 0.06, CUES.introSketch) * veil;
  const line1 = ramp(t, 0.74, CUES.introLine1) * leave;
  const line2 = ramp(t, 3.74, CUES.introLine2) * leave;
  const source = ramp(t, 3.82, CUES.introSource) * leave;

  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  if (sketchA > 0.02) {
    ctx.globalAlpha = sketchA;
    ctx.fillStyle = "#3a322a";
    setFont(ctx, SERIF, 28, 600);
    text(ctx, "图一 鹈鹕骑行图（摹本）", 272, 924);
  }

  if (line1 > 0.02) {
    ctx.globalAlpha = line1;
    ctx.fillStyle = "#24180f";
    setFont(ctx, SERIF, 48, 600);
    text(ctx, "人类自古以来就痴迷于画鹈鹕骑自行车。", 960, 286);
  }
  if (line2 > 0.02) {
    ctx.globalAlpha = line2;
    ctx.fillStyle = "#24180f";
    setFont(ctx, SERIF, 42, 600);
    text(ctx, "——早在自行车被发明之前。", 960, 362);
  }
  if (source > 0.02) {
    ctx.globalAlpha = source;
    ctx.fillStyle = "#6d5a46";
    setFont(ctx, SERIF, 26, 600);
    text(ctx, "——《鹈鹕骑行艺术通史》，卷一", 960, 432);
  }
  ctx.globalAlpha = 1;
}
