/**
 * Later-period drawings of the same pose.
 * starry: short curved strokes. scream: thick environment color.
 * shadow: the Nosferatu stair shadow. scope: phosphor lines.
 * The 14→15 beat is powerOn(): the shadow's edge turns into the green line.
 */

import { smoothstep } from "../beat/cues.js";
import { sectionStart } from "../beat/timeline.js";
import { RIG } from "../beat/world.js";
import { poseAt } from "./pose.js";

export function powerOn(t) {
  const d = (t - sectionStart(15)) / 0.32;
  return Math.exp(-d * d);
}

function lissAmount(t) {
  const local = t - sectionStart(15);
  const up = smoothstep((local - 1.92) / 0.12);
  const down = smoothstep((local - 2.42) / 0.1);
  return up * (1 - down);
}

function hatch(p, cx, cy, rx, ry, rot, n, weight, col) {
  p.stroke(col);
  p.strokeWeight(weight);
  for (let i = 0; i < n; i++) {
    const a = rot + i * 0.7;
    const x = cx + Math.cos(a) * rx * 0.15;
    const y = cy + Math.sin(a) * ry * 0.15;
    p.line(
      x - Math.cos(a) * rx * 0.55,
      y - Math.sin(a) * ry * 0.4,
      x + Math.cos(a + 0.8) * rx * 0.7,
      y + Math.sin(a + 0.8) * ry * 0.45,
    );
  }
}

function starry(p, pose) {
  const pts = pose.points;
  const spin = pose.wheel;
  p.stroke("#0C2048");
  p.strokeWeight(3);
  p.noFill();
  p.circle(pts.rear.x, pts.rear.y, RIG.wheelR * 2);
  p.circle(pts.front.x, pts.front.y, RIG.wheelR * 2);
  p.stroke("#F0D24A");
  p.strokeWeight(1.4);
  for (let i = 0; i < 6; i++) {
    const a = spin + (i / 6) * Math.PI * 2;
    p.arc(pts.rear.x, pts.rear.y, 56, 56, a, a + 0.7);
    p.arc(pts.front.x, pts.front.y, 56, 56, a, a + 0.7);
  }
  p.stroke("#16386E");
  p.strokeWeight(2.4);
  p.line(pts.rear.x, pts.rear.y, pts.bb.x, pts.bb.y);
  p.line(pts.bb.x, pts.bb.y, pts.headTube.x, pts.headTube.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.front.x, pts.front.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.handle.x, pts.handle.y);
  p.stroke("#16386E");
  p.strokeWeight(8);
  p.line(pts.body.x + 20, pts.body.y + 6, pts.head.x - 4, pts.head.y - 4);
  p.noStroke();
  p.fill("#16386E");
  p.ellipse(pts.body.x, pts.body.y, 112, 40);
  p.fill("#1C4A8A");
  p.ellipse(pts.head.x, pts.head.y, 32, 26);
  p.fill("#E0A030");
  p.triangle(pts.beakTop.x, pts.beakTop.y, pts.beakTip.x, pts.beakTip.y, pts.beakLow.x, pts.beakLow.y);
  hatch(p, pts.body.x, pts.body.y, 40, 14, spin * 0.4, 7, 1.6, "#F0D24A");
  hatch(p, pts.head.x, pts.head.y, 10, 8, 0.3, 4, 1.4, "#7EC8C0");
  p.noStroke();
  p.fill("#F4E7A0");
  p.circle(pts.eye.x, pts.eye.y, 5);
  p.fill("#12215A");
  p.circle(pts.eye.x + 1, pts.eye.y, 2.4);
  p.stroke("#C4553A");
  p.strokeWeight(4);
  p.line(pts.hip.x, pts.hip.y, pts.kneeNear.x, pts.kneeNear.y);
  p.line(pts.kneeNear.x, pts.kneeNear.y, pts.ankleNear.x, pts.ankleNear.y);
  p.stroke("#8A4030");
  p.line(pts.hip.x, pts.hip.y, pts.kneeFar.x, pts.kneeFar.y);
  p.line(pts.kneeFar.x, pts.kneeFar.y, pts.ankleFar.x, pts.ankleFar.y);
}

function scream(p, pose) {
  const pts = pose.points;
  p.stroke("#2A100C");
  p.strokeWeight(3);
  p.fill("#F4E1D2");
  p.ellipse(pts.body.x, pts.body.y, 118, 46);
  p.fill("#E07048");
  p.ellipse(pts.body.x - 10, pts.body.y + 2, 70, 22);
  p.strokeWeight(7);
  p.noFill();
  p.stroke("#8A2A22");
  p.line(pts.neck.x, pts.neck.y, pts.head.x, pts.head.y);
  p.strokeWeight(2.5);
  p.fill("#F6D2B8");
  p.ellipse(pts.head.x, pts.head.y, 34, 28);
  p.fill("#E25B32");
  p.beginShape();
  p.vertex(pts.beakTop.x, pts.beakTop.y);
  p.vertex(pts.beakTip.x, pts.beakTip.y);
  p.vertex(pts.beakLow.x, pts.beakLow.y);
  p.endShape(p.CLOSE);
  p.fill("#1A0C10");
  p.circle(pts.eye.x, pts.eye.y, 5);
  p.stroke("#2A100C");
  p.strokeWeight(3);
  p.line(pts.rear.x, pts.rear.y, pts.bb.x, pts.bb.y);
  p.line(pts.bb.x, pts.bb.y, pts.headTube.x, pts.headTube.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.front.x, pts.front.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.handle.x, pts.handle.y);
  p.noFill();
  p.circle(pts.rear.x, pts.rear.y, RIG.wheelR * 2);
  p.circle(pts.front.x, pts.front.y, RIG.wheelR * 2);
  p.stroke("#C4553A");
  p.strokeWeight(5);
  p.line(pts.hip.x, pts.hip.y, pts.kneeNear.x, pts.kneeNear.y);
  p.line(pts.kneeNear.x, pts.kneeNear.y, pts.ankleNear.x, pts.ankleNear.y);
  p.line(pts.hip.x, pts.hip.y, pts.kneeFar.x, pts.kneeFar.y);
  p.line(pts.kneeFar.x, pts.kneeFar.y, pts.ankleFar.x, pts.ankleFar.y);
}

function scopeLines(p, pose, alpha, warp) {
  const pts = pose.points;
  const wpt = (pt) => warp(pt);
  const seg = (a, b, weight) => {
    const A = wpt(a);
    const B = wpt(b);
    p.strokeWeight(weight);
    p.line(A.x, A.y, B.x, B.y);
  };
  p.stroke(120, 255, 150, alpha);
  p.noFill();
  const rear = wpt(pts.rear);
  const front = wpt(pts.front);
  p.strokeWeight(1.6);
  p.circle(rear.x, rear.y, RIG.wheelR * 2);
  p.circle(front.x, front.y, RIG.wheelR * 2);
  for (let i = 0; i < 4; i++) {
    const a = pose.wheel + (i / 4) * Math.PI;
    seg(
      pts.rear,
      { x: pts.rear.x + Math.cos(a) * (RIG.wheelR - 4), y: pts.rear.y + Math.sin(a) * (RIG.wheelR - 4) },
      1,
    );
    seg(
      pts.front,
      { x: pts.front.x + Math.cos(a) * (RIG.wheelR - 4), y: pts.front.y + Math.sin(a) * (RIG.wheelR - 4) },
      1,
    );
  }
  seg(pts.rear, pts.bb, 1.5);
  seg(pts.bb, pts.headTube, 1.5);
  seg(pts.headTube, pts.front, 1.5);
  seg(pts.headTube, pts.handle, 1.4);
  seg(pts.hip, pts.kneeNear, 1.6);
  seg(pts.kneeNear, pts.ankleNear, 1.6);
  seg(pts.hip, pts.kneeFar, 1.2);
  seg(pts.kneeFar, pts.ankleFar, 1.2);
  seg(pts.neck, pts.head, 1.8);
  seg(pts.beakTop, pts.beakTip, 1.7);
  seg(pts.beakLow, pts.beakTip, 1.3);
  seg(pts.body, pts.tailTip, 1.3);
  const eye = wpt(pts.eye);
  p.circle(eye.x, eye.y, 4);
}

function lissajous(p, t, amount, alpha) {
  const messy = amount > 0.55;
  const a = messy ? 5.2 : 3;
  const b = messy ? 3.6 : 2;
  const phase = t * (messy ? 9 : 4);
  p.stroke(140, 255, 160, alpha);
  p.strokeWeight(1.7);
  p.noFill();
  let prev = null;
  for (let i = 0; i <= 96; i++) {
    const u = (i / 96) * Math.PI * 2;
    const pt = { x: Math.sin(a * u + phase) * 78, y: Math.sin(b * u) * 52 };
    if (prev) p.line(prev.x, prev.y, pt.x, pt.y);
    prev = pt;
  }
}

export function drawStarryRig(p, pose) {
  p.push();
  starry(p, pose);
  p.pop();
}

export function drawScreamRig(p, pose) {
  p.push();
  p.strokeJoin(p.ROUND);
  p.strokeCap(p.ROUND);
  scream(p, pose);
  p.pop();
}

export function drawStairShadow(p, pose, power) {
  const local = pose.t - sectionStart(14);
  const climb = Math.sin(Math.min(Math.max(local, 0) / 5.5, 1) * Math.PI);
  const lift = climb * 260 * (1 - power);
  const g = Math.round(18 + power * 70);
  p.push();
  p.translate(10, lift);
  p.scale(1, 1.35);
  const pts = pose.points;
  p.stroke(g * 0.4, g * 0.35, g * 0.3, 200);
  p.strokeWeight(10);
  p.noFill();
  p.line(pts.rear.x, pts.rear.y, pts.bb.x, pts.bb.y);
  p.line(pts.bb.x, pts.bb.y, pts.headTube.x, pts.headTube.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.front.x, pts.front.y);
  p.line(pts.hip.x, pts.hip.y, pts.kneeNear.x, pts.kneeNear.y);
  p.line(pts.kneeNear.x, pts.kneeNear.y, pts.ankleNear.x, pts.ankleNear.y);
  p.line(pts.neck.x, pts.neck.y, pts.head.x, pts.head.y);
  p.line(pts.beakTop.x, pts.beakTop.y, pts.beakTip.x, pts.beakTip.y);
  p.circle(pts.rear.x, pts.rear.y, RIG.wheelR * 2);
  p.circle(pts.front.x, pts.front.y, RIG.wheelR * 2);
  const glow = power > 0.12;
  p.stroke(glow ? 40 + power * 80 : 16, glow ? 80 + power * 150 : 14, glow ? 40 + power * 60 : 12, 220);
  p.strokeWeight(power > 0.25 ? 2 : 7);
  p.line(pts.rear.x, pts.rear.y, pts.front.x, pts.front.y);
  p.line(pts.neck.x, pts.neck.y, pts.beakTip.x, pts.beakTip.y);
  p.circle(pts.rear.x, pts.rear.y, RIG.wheelR * 2);
  p.circle(pts.front.x, pts.front.y, RIG.wheelR * 2);
  p.pop();
  if (power > 0.45) {
    p.push();
    p.translate((Math.sin(pose.t * 90) > 0.6 ? 1.5 : 0), 0);
    drawScopeRig(p, pose, 0, power);
    p.pop();
  }
}

export function drawScopeRig(p, pose, amount, glow) {
  const amp = amount == null ? lissAmount(pose.t) : amount;
  const jitter = Math.sin(pose.t * 53) > 0.93 ? 1.8 : 0;
  const warp = (pt) => {
    if (amp <= 0.04) return pt;
    return {
      x: pt.x + Math.sin(pt.y * 0.08 + pose.t * 6) * 26 * amp,
      y: pt.y + Math.sin(pt.x * 0.07) * 18 * amp,
    };
  };
  p.push();
  p.translate(jitter, 0);
  if (amp > 0.72) {
    lissajous(p, pose.t, amp, 200 + (glow || 0) * 40);
  } else {
    for (let i = 3; i >= 1; i--) {
      const past = poseAt(Math.max(0, pose.t - i * 0.04));
      scopeLines(p, past, 28 + (3 - i) * 18, (pt) => pt);
    }
    scopeLines(p, pose, 210 + (glow || 0) * 40, warp);
    if (amp > 0.05) lissajous(p, pose.t, amp, 80 + amp * 100);
  }
  p.pop();
}

export function drawModernRig(p, pose, style) {
  if (style === "starry") drawStarryRig(p, pose);
  else if (style === "scream") drawScreamRig(p, pose);
  else if (style === "shadow") drawStairShadow(p, pose, powerOn(pose.t));
  else drawScopeRig(p, pose, null, powerOn(pose.t));
}
