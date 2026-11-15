/**
 * Flat period drawings of the same pose: Egypt, Maya, Mughal, ukiyo-e.
 * Caller has already flipped y so local +y is up.
 */

import { sectionStart } from "../beat/timeline.js";
import { RIG } from "../beat/world.js";

function poly(p, pts) {
  p.beginShape();
  for (const pt of pts) p.vertex(pt.x, pt.y);
  p.endShape(p.CLOSE);
}

function wheel(p, hub, radius, angle, tire, spoke, count) {
  p.noFill();
  p.stroke(tire);
  p.strokeWeight(3);
  p.circle(hub.x, hub.y, radius * 2);
  p.stroke(spoke);
  p.strokeWeight(1.2);
  for (let i = 0; i < count; i++) {
    const a = angle + (i / count) * Math.PI * 2;
    p.line(hub.x, hub.y, hub.x + Math.cos(a) * (radius - 4), hub.y + Math.sin(a) * (radius - 4));
  }
  p.noStroke();
  p.fill(tire);
  p.circle(hub.x, hub.y, 6);
}

function limb(p, hip, knee, ankle, foot, color, weight) {
  p.stroke(color);
  p.strokeWeight(weight);
  p.strokeCap(p.ROUND);
  p.line(hip.x, hip.y, knee.x, knee.y);
  p.line(knee.x, knee.y, ankle.x, ankle.y);
  if (foot && foot.length > 8) {
    p.strokeWeight(weight * 0.7);
    p.line(ankle.x, ankle.y, foot[4].x, foot[4].y);
    p.line(ankle.x, ankle.y, foot[7].x, foot[7].y);
    p.line(ankle.x, ankle.y, foot[9].x, foot[9].y);
  }
}

function frame(p, pts, color, weight) {
  p.stroke(color);
  p.strokeWeight(weight);
  p.line(pts.rear.x, pts.rear.y, pts.bb.x, pts.bb.y);
  p.line(pts.bb.x, pts.bb.y, pts.headTube.x, pts.headTube.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.seat.x, pts.seat.y);
  p.line(pts.seat.x, pts.seat.y, pts.rear.x, pts.rear.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.front.x, pts.front.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.handle.x, pts.handle.y);
  p.line(pts.handle.x - 14, pts.handle.y, pts.handle.x + 8, pts.handle.y + 3);
  p.noFill();
  p.circle(pts.bb.x, pts.bb.y, RIG.chainringR * 2);
  p.line(pts.bb.x, pts.bb.y, pts.ankleNear.x, pts.ankleNear.y);
  p.line(pts.bb.x, pts.bb.y, pts.ankleFar.x, pts.ankleFar.y);
}

function egypt(p, pose) {
  const pts = pose.points;
  const local = pose.t - sectionStart(2);
  const held = local >= 2 && local < 4;
  const flap = held ? 0 : Math.sin(pose.crank) * 10;
  const ink = "#1A2744";
  wheel(p, pts.rear, RIG.wheelR, pose.wheel, ink, "#6A3A22", 4);
  wheel(p, pts.front, RIG.wheelR, pose.wheel, ink, "#6A3A22", 4);
  limb(p, pts.hip, pts.kneeFar, pts.ankleFar, pts.footFar, "#C4874A", 7);
  frame(p, pts, ink, 2.4);
  p.noStroke();
  p.fill("#1A4A6E");
  p.triangle(pts.body.x - 16, pts.body.y, pts.body.x - 78, pts.body.y + 10 - flap, pts.body.x - 8, pts.body.y - 16);
  p.fill("#1F6A52");
  p.triangle(pts.body.x + 8, pts.body.y + 6, pts.body.x + 74, pts.body.y + 28 + flap, pts.body.x + 18, pts.body.y - 8);
  p.fill("#F3E2C0");
  p.ellipse(pts.body.x, pts.body.y, 116, 42);
  p.fill("#E7C48A");
  p.ellipse(pts.body.x - 6, pts.body.y - 6, 70, 18);
  p.stroke(ink);
  p.strokeWeight(6);
  p.noFill();
  p.line(pts.neck.x, pts.neck.y, pts.head.x - 4, pts.head.y);
  p.noStroke();
  p.fill("#F7E7C4");
  p.ellipse(pts.head.x, pts.head.y, 36, 32);
  p.fill("#E37A2A");
  poly(p, [pts.beakTop, pts.beakTip, pts.beakLow]);
  p.fill("#F4E6C4");
  p.ellipse(pts.eye.x, pts.eye.y + 1, 16, 18);
  p.fill("#111");
  p.ellipse(pts.eye.x, pts.eye.y + 1, 7, 12);
  p.fill("#fff");
  p.circle(pts.eye.x, pts.eye.y + 3, 3);
  limb(p, pts.hip, pts.kneeNear, pts.ankleNear, pts.footNear, "#E7C48A", 8);
}

function maya(p, pose) {
  const pts = pose.points;
  const ink = "#1A100C";
  wheel(p, pts.rear, RIG.wheelR, pose.wheel, ink, "#6E1A12", 6);
  wheel(p, pts.front, RIG.wheelR, pose.wheel, ink, "#6E1A12", 6);
  limb(p, pts.hip, pts.kneeFar, pts.ankleFar, pts.footFar, "#8A3A28", 8);
  frame(p, pts, ink, 3);
  p.stroke(ink);
  p.strokeWeight(3);
  p.fill("#A33B2A");
  p.ellipse(pts.body.x, pts.body.y, 120, 48);
  p.fill("#6E1A12");
  p.ellipse(pts.body.x - 8, pts.body.y - 4, 64, 20);
  p.strokeWeight(8);
  p.noFill();
  p.line(pts.neck.x, pts.neck.y, pts.head.x, pts.head.y);
  p.strokeWeight(3);
  p.fill("#C4553A");
  p.ellipse(pts.head.x, pts.head.y, 40, 36);
  p.fill("#E37A2A");
  poly(p, [pts.beakTop, pts.beakTip, pts.beakLow]);
  p.fill("#F4E2B0");
  p.circle(pts.eye.x, pts.eye.y, 14);
  p.fill("#111");
  p.circle(pts.eye.x + 1, pts.eye.y, 6);
  limb(p, pts.hip, pts.kneeNear, pts.ankleNear, pts.footNear, "#C4553A", 9);
}

function mughal(p, pose) {
  const pts = pose.points;
  const ink = "#143C2E";
  wheel(p, pts.rear, RIG.wheelR, pose.wheel, ink, "#A67C3A", 8);
  wheel(p, pts.front, RIG.wheelR, pose.wheel, ink, "#A67C3A", 8);
  limb(p, pts.hip, pts.kneeFar, pts.ankleFar, pts.footFar, "#C4A06A", 6);
  frame(p, pts, "#8A6230", 2);
  p.stroke(ink);
  p.strokeWeight(1.4);
  p.fill("#F4F0E4");
  p.ellipse(pts.body.x, pts.body.y, 118, 44);
  p.fill("#1F6A52");
  p.ellipse(pts.body.x + 6, pts.body.y + 2, 46, 16);
  p.noStroke();
  p.fill("#9C2B2B");
  for (let i = 0; i < 5; i++) p.circle(pts.body.x - 30 + i * 14, pts.body.y - 6, 4);
  p.stroke(ink);
  p.strokeWeight(5);
  p.noFill();
  p.line(pts.neck.x, pts.neck.y, pts.head.x, pts.head.y);
  p.strokeWeight(1.4);
  p.fill("#F7F1E4");
  p.ellipse(pts.head.x, pts.head.y, 34, 28);
  p.fill("#C4553A");
  poly(p, [pts.beakTop, pts.beakTip, pts.beakLow]);
  p.fill("#111");
  p.circle(pts.eye.x, pts.eye.y, 4);
  limb(p, pts.hip, pts.kneeNear, pts.ankleNear, pts.footNear, "#E6D2A8", 7);
}

function ukiyo(p, pose) {
  const pts = pose.points;
  const ink = "#1A1A1A";
  const gust = (() => {
    const local = pose.t - sectionStart(11);
    if (local < 2 || local > 4) return 0;
    return Math.sin(((local - 2) / 2) * Math.PI);
  })();
  wheel(p, pts.rear, RIG.wheelR, pose.wheel, ink, ink, 8);
  wheel(p, pts.front, RIG.wheelR, pose.wheel, ink, ink, 8);
  limb(p, pts.hip, pts.kneeFar, pts.ankleFar, pts.footFar, "#C8C2B8", 7);
  frame(p, pts, ink, 2.2);
  p.stroke(ink);
  p.strokeWeight(2.4);
  p.fill("#F4F1EA");
  p.ellipse(pts.body.x, pts.body.y, 120, 46);
  p.fill("#8A9098");
  p.triangle(pts.wing.x - 20, pts.wing.y, pts.wing.x + 16, pts.wing.y + 8, pts.tail.x, pts.tail.y + gust * 8);
  p.strokeWeight(7);
  p.noFill();
  p.line(pts.neck.x, pts.neck.y, pts.head.x, pts.head.y);
  p.strokeWeight(2.4);
  p.fill("#F7F4EE");
  p.ellipse(pts.head.x, pts.head.y, 34, 28);
  p.fill("#E37A2A");
  poly(p, [pts.beakTop, pts.beakTip, pts.beakLow]);
  p.fill("#111");
  p.circle(pts.eye.x, pts.eye.y, 4.5);
  limb(p, pts.hip, pts.kneeNear, pts.ankleNear, pts.footNear, "#F4F1EA", 8);
}

const DRAW = { egypt, maya, mughal, ukiyo };

export function drawPeriodRig(p, pose, style) {
  const draw = DRAW[style] || egypt;
  p.push();
  p.strokeJoin(p.ROUND);
  p.strokeCap(p.ROUND);
  draw(p, pose);
  p.pop();
}
