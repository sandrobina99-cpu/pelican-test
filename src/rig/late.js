/**
 * Last-batch drawings of the same pose.
 * wayang and pixel step their pose at 10 frames a second.
 * The camera still uses the smooth position from the scheduler.
 */

import { sectionStart } from "../beat/timeline.js";
import { RIG } from "../beat/world.js";
import { poseAt } from "./pose.js";

function stepped(t, fps) {
  const s = 1 / fps;
  return Math.floor(t / s + 1e-9) * s;
}

function live(pose, fps) {
  const local = pose.points;
  const q = poseAt(stepped(pose.t, fps));
  return { ...pose, points: q.points, wheel: q.wheel, crank: q.crank, bob: q.bob, _local: local };
}

function holes(p, cx, cy, n, r) {
  p.noStroke();
  p.fill("#1A0C08");
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    p.circle(cx + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 0.35, 3.2);
  }
}

function wayang(p, pose) {
  const q = live(pose, 10);
  const pts = q.points;
  const local = pose.t - sectionStart(10);
  const nod = local > 2 && local < 2.35 ? Math.sin(((local - 2) / 0.35) * Math.PI) * 16 : 0;
  const rod = local > 2 && local < 2.2 ? Math.sin(local * 70) * 8 : 0;
  p.stroke("#2A160C");
  p.strokeWeight(3.2);
  p.line(pts.handle.x, pts.handle.y, pts.handle.x + 30 + rod, 460);
  p.line(pts.neck.x, pts.neck.y + nod, pts.neck.x - 36 + rod, 480);
  p.stroke("#6A3E18");
  p.strokeWeight(2);
  p.fill("#E6B15A");
  p.circle(pts.rear.x, pts.rear.y, RIG.wheelR * 2);
  p.circle(pts.front.x, pts.front.y, RIG.wheelR * 2);
  holes(p, pts.rear.x, pts.rear.y, 8, 28);
  holes(p, pts.front.x, pts.front.y, 8, 28);
  p.stroke("#6A3E18");
  p.strokeWeight(3);
  p.fill("#C4843A");
  p.line(pts.rear.x, pts.rear.y, pts.bb.x, pts.bb.y);
  p.line(pts.bb.x, pts.bb.y, pts.headTube.x, pts.headTube.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.front.x, pts.front.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.handle.x, pts.handle.y);
  p.noStroke();
  p.fill("#E8C07A");
  p.ellipse(pts.body.x, pts.body.y, 116, 42);
  holes(p, pts.body.x, pts.body.y, 7, 36);
  p.stroke("#6A3E18");
  p.strokeWeight(5);
  p.line(pts.hip.x, pts.hip.y, pts.kneeNear.x, pts.kneeNear.y);
  p.line(pts.kneeNear.x, pts.kneeNear.y, pts.ankleNear.x, pts.ankleNear.y);
  p.line(pts.neck.x, pts.neck.y, pts.head.x, pts.head.y + nod);
  p.noStroke();
  p.fill("#F0C878");
  p.ellipse(pts.head.x, pts.head.y + nod, 32, 26);
  p.fill("#C4553A");
  p.triangle(pts.beakTop.x, pts.beakTop.y + nod, pts.beakTip.x, pts.beakTip.y + nod, pts.beakLow.x, pts.beakLow.y + nod);
  p.fill("#1A0C08");
  p.circle(pts.eye.x, pts.eye.y + nod, 5);
  holes(p, pts.head.x, pts.head.y + nod, 4, 10);
}

function block(p, x, y, w, h, col) {
  p.noStroke();
  p.fill(col);
  p.rect(Math.round(x), Math.round(y), w, h);
}

function pixel(p, pose) {
  const q = live(pose, 10);
  const pts = q.points;
  const localX = pose.worldX - 15000;
  let hop = 0;
  if (localX > 280 && localX < 520) {
    const u = (localX - 280) / 240;
    hop = Math.sin(u * Math.PI) * 78;
  }
  p.push();
  p.translate(0, hop);
  p.stroke("#140C28");
  p.strokeWeight(8);
  p.noFill();
  p.circle(pts.rear.x, pts.rear.y, 64);
  p.circle(pts.front.x, pts.front.y, 64);
  p.line(pts.rear.x, pts.rear.y, pts.bb.x, pts.bb.y);
  p.line(pts.bb.x, pts.bb.y, pts.headTube.x, pts.headTube.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.front.x, pts.front.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.handle.x, pts.handle.y);
  p.line(pts.hip.x, pts.hip.y, pts.kneeNear.x, pts.kneeNear.y);
  p.line(pts.kneeNear.x, pts.kneeNear.y, pts.ankleNear.x, pts.ankleNear.y);
  p.noStroke();
  p.fill("#F4F1EA");
  p.ellipse(pts.body.x, pts.body.y, 100, 36);
  p.fill("#E23B4A");
  p.ellipse(pts.body.x, pts.body.y - 4, 36, 12);
  p.stroke("#140C28");
  p.strokeWeight(8);
  p.line(pts.neck.x, pts.neck.y, pts.head.x, pts.head.y);
  p.noStroke();
  p.fill("#F4F1EA");
  p.ellipse(pts.head.x, pts.head.y, 28, 22);
  p.fill("#FFE14A");
  p.triangle(pts.beakTop.x, pts.beakTop.y, pts.beakTip.x, pts.beakTip.y, pts.beakLow.x, pts.beakLow.y);
  p.fill("#140C28");
  p.circle(pts.eye.x, pts.eye.y, 6);
  p.pop();
}

function vapor(p, pose) {
  const pts = pose.points;
  p.stroke("#FF7AD9");
  p.strokeWeight(3);
  p.fill("#F4F1EA");
  p.circle(pts.rear.x, pts.rear.y, RIG.wheelR * 2);
  p.circle(pts.front.x, pts.front.y, RIG.wheelR * 2);
  p.line(pts.rear.x, pts.rear.y, pts.bb.x, pts.bb.y);
  p.line(pts.bb.x, pts.bb.y, pts.headTube.x, pts.headTube.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.front.x, pts.front.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.handle.x, pts.handle.y);
  p.ellipse(pts.body.x, pts.body.y, 118, 44);
  p.strokeWeight(6);
  p.line(pts.neck.x, pts.neck.y, pts.head.x, pts.head.y);
  p.strokeWeight(3);
  p.ellipse(pts.head.x, pts.head.y, 32, 26);
  p.fill("#FF7AD9");
  p.triangle(pts.beakTop.x, pts.beakTop.y, pts.beakTip.x, pts.beakTip.y, pts.beakLow.x, pts.beakLow.y);
  p.fill("#3A2158");
  p.circle(pts.eye.x, pts.eye.y, 5);
  p.stroke("#E8D8F0");
  p.strokeWeight(5);
  p.line(pts.hip.x, pts.hip.y, pts.kneeNear.x, pts.kneeNear.y);
  p.line(pts.kneeNear.x, pts.kneeNear.y, pts.ankleNear.x, pts.ankleNear.y);
  p.line(pts.hip.x, pts.hip.y, pts.kneeFar.x, pts.kneeFar.y);
  p.line(pts.kneeFar.x, pts.kneeFar.y, pts.ankleFar.x, pts.ankleFar.y);
}

function codeRig(p, pose) {
  const pts = pose.points;
  const local = pose.t - sectionStart(20);
  const frontR = local > 2.05 && local < 2.55 ? 62 : RIG.wheelR;
  const show = {
    wheel: local > 0.4,
    frame: local > 1.5,
    body: local > 2.7,
    head: local > 4.0,
  };
  p.noFill();
  p.stroke("#9AF0A8");
  p.strokeWeight(1.6);
  if (show.wheel) {
    p.circle(pts.rear.x, pts.rear.y, RIG.wheelR * 2);
    p.circle(pts.front.x, pts.front.y, frontR * 2);
  }
  if (show.frame) {
    p.line(pts.rear.x, pts.rear.y, pts.bb.x, pts.bb.y);
    p.line(pts.bb.x, pts.bb.y, pts.headTube.x, pts.headTube.y);
    p.line(pts.headTube.x, pts.headTube.y, pts.front.x, pts.front.y);
    p.line(pts.headTube.x, pts.headTube.y, pts.handle.x, pts.handle.y);
    p.line(pts.hip.x, pts.hip.y, pts.kneeNear.x, pts.kneeNear.y);
    p.line(pts.kneeNear.x, pts.kneeNear.y, pts.ankleNear.x, pts.ankleNear.y);
  }
  if (show.body) {
    p.ellipse(pts.body.x, pts.body.y, 116, 42);
    p.line(pts.body.x - 30, pts.body.y, pts.tailTip.x, pts.tailTip.y);
  }
  if (show.head) {
    p.line(pts.neck.x, pts.neck.y, pts.head.x, pts.head.y);
    p.ellipse(pts.head.x, pts.head.y, 30, 24);
    p.line(pts.beakTop.x, pts.beakTop.y, pts.beakTip.x, pts.beakTip.y);
    p.line(pts.beakLow.x, pts.beakLow.y, pts.beakTip.x, pts.beakTip.y);
    p.circle(pts.eye.x, pts.eye.y, 4);
  }
}

export function drawChatPicture(p, t) {
  const q = poseAt(stepped(t, 8));
  const pts = q.points;
  p.noStroke();
  p.fill("#2A3A4A");
  p.circle(pts.rear.x, pts.rear.y, 70);
  p.circle(pts.front.x, pts.front.y, 70);
  p.fill("#F4F1EA");
  p.ellipse(pts.body.x, pts.body.y, 100, 36);
  p.ellipse(pts.head.x, pts.head.y, 28, 22);
  p.fill("#E37A2A");
  p.triangle(pts.beakTop.x, pts.beakTop.y, pts.beakTip.x, pts.beakTip.y, pts.beakLow.x, pts.beakLow.y);
  p.fill("#1A2330");
  p.circle(pts.eye.x, pts.eye.y, 4);
  p.stroke("#2A3A4A");
  p.strokeWeight(3);
  p.line(pts.rear.x, pts.rear.y, pts.front.x, pts.front.y);
  p.line(pts.hip.x, pts.hip.y, pts.ankleNear.x, pts.ankleNear.y);
}

export function drawLateRig(p, pose, style) {
  p.push();
  p.strokeJoin(p.ROUND);
  p.strokeCap(p.ROUND);
  if (style === "wayang") wayang(p, pose);
  else if (style === "pixel") pixel(p, pose);
  else if (style === "vapor") vapor(p, pose);
  else if (style === "code") codeRig(p, pose);
  else if (style === "chat") {
    p.scale(0.35);
    drawChatPicture(p, pose.t);
  }
  p.pop();
}
