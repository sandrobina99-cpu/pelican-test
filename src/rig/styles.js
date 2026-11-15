/**
 * Style passes over the same pose points.
 * rock: Tassili pigment. ink: Song wash. The default rig stays in draw.js.
 */

import { RIG } from "../beat/world.js";

function poly(p, pts) {
  p.beginShape();
  for (const pt of pts) p.vertex(pt.x, pt.y);
  p.endShape(p.CLOSE);
}

function bone(p, a, b, thickness, color, ink) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * thickness;
  const ny = (dx / len) * thickness;
  p.noStroke();
  p.fill(ink);
  p.beginShape();
  p.vertex(a.x + nx, a.y + ny);
  p.vertex(a.x - nx, a.y - ny);
  p.vertex(b.x - nx, b.y - ny);
  p.vertex(b.x + nx, b.y + ny);
  p.endShape(p.CLOSE);
  p.fill(color);
  const s = 0.62;
  p.beginShape();
  p.vertex(a.x + nx * s, a.y + ny * s);
  p.vertex(a.x - nx * s, a.y - ny * s);
  p.vertex(b.x - nx * s, b.y - ny * s);
  p.vertex(b.x + nx * s, b.y + ny * s);
  p.endShape(p.CLOSE);
  p.circle(a.x, a.y, thickness * 1.3);
  p.circle(b.x, b.y, thickness * 1.15);
}

function limb(p, hip, knee, ankle, foot, weight, color, ink, footColor) {
  bone(p, hip, knee, weight, color, ink);
  bone(p, knee, ankle, weight * 0.92, color, ink);
  if (!foot) return;
  p.fill(ink);
  p.stroke(ink);
  p.strokeWeight(1.4);
  poly(p, foot.map((pt) => ({ x: pt.x, y: pt.y })));
  p.fill(footColor);
  p.stroke(ink);
  poly(p, foot);
}

function wheel(p, hub, angle, color, ink, spokes) {
  p.noFill();
  p.stroke(ink);
  p.strokeWeight(5);
  p.circle(hub.x, hub.y, RIG.wheelR * 2);
  p.stroke(color);
  p.strokeWeight(2);
  p.circle(hub.x, hub.y, RIG.wheelR * 2 - 8);
  p.stroke(ink);
  p.strokeWeight(1.1);
  for (let i = 0; i < spokes; i++) {
    const a = angle + (i * Math.PI * 2) / spokes;
    p.line(hub.x, hub.y, hub.x + Math.cos(a) * (RIG.wheelR - 6), hub.y + Math.sin(a) * (RIG.wheelR - 6));
  }
  p.noStroke();
  p.fill(ink);
  p.circle(hub.x, hub.y, 7);
}

const ROCK = {
  body: "#E7C48A",
  shade: "#C49255",
  ink: "#4A2814",
  beak: "#C46A32",
  frame: "#5C3318",
  spokes: 6,
};
const INK = {
  body: "#F3F0E8",
  shade: "#C8C2B6",
  ink: "#2C2B28",
  beak: "#8D6E66",
  frame: "#2C2B28",
  spokes: 8,
};

export function drawStyledRig(p, pose, style) {
  const pal = style === "ink" ? INK : ROCK;
  const pts = pose.points;
  p.push();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  p.ellipseMode(p.CENTER);

  p.noStroke();
  p.fill(pal.ink);
  p.ellipse((pts.rear.x + pts.front.x) / 2, 3, 200, 10);

  wheel(p, pts.rear, pose.wheel, pal.shade, pal.ink, pal.spokes);
  wheel(p, pts.front, pose.wheel, pal.shade, pal.ink, pal.spokes);

  limb(p, pts.hip, pts.kneeFar, pts.ankleFar, pts.footFar, style === "ink" ? 5.5 : 7, pal.shade, pal.ink, pal.beak);

  p.stroke(pal.frame);
  p.strokeWeight(style === "ink" ? 2.2 : 4);
  p.line(pts.rear.x, pts.rear.y, pts.bb.x, pts.bb.y);
  p.line(pts.bb.x, pts.bb.y, pts.headTube.x, pts.headTube.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.seat.x, pts.seat.y);
  p.line(pts.seat.x, pts.seat.y, pts.rear.x, pts.rear.y);
  p.line(pts.headTube.x, pts.headTube.y, pts.front.x, pts.front.y);
  p.noFill();
  p.circle(pts.bb.x, pts.bb.y, RIG.chainringR * 2);
  p.strokeWeight(style === "ink" ? 2.4 : 3.4);
  p.line(pts.bb.x, pts.bb.y, pts.ankleFar.x, pts.ankleFar.y);

  p.stroke(pal.ink);
  p.strokeWeight(style === "ink" ? 1.4 : 2);
  p.fill(pal.body);
  p.ellipse(pts.body.x, pts.body.y, 124, 50);
  p.fill(pal.shade);
  p.ellipse(pts.body.x - 8, pts.body.y + 2, 70, 24);
  p.triangle(pts.body.x - 36, pts.body.y + 4, pts.tailTip.x, pts.tailTip.y, pts.tail.x, pts.tail.y - 10);

  p.noFill();
  p.stroke(pal.ink);
  p.strokeWeight(style === "ink" ? 1.6 : 8);
  p.bezier(
    pts.neck.x, pts.neck.y,
    pts.neck.x + 10, pts.neck.y + 24,
    pts.head.x - 24, pts.head.y - 4,
    pts.head.x - 4, pts.head.y,
  );
  p.fill(pal.body);
  p.strokeWeight(style === "ink" ? 1.4 : 2);
  p.ellipse(pts.head.x, pts.head.y, 38, 30);
  p.fill(pal.beak);
  poly(p, [pts.beakTop, pts.beakTip, { x: pts.beakTip.x - 8, y: pts.beakTip.y - 6 }, pts.beakLow]);
  p.fill("#fffdf8");
  p.circle(pts.eye.x, pts.eye.y, 8);
  p.fill(pal.ink);
  p.noStroke();
  p.circle(pts.eye.x + 1, pts.eye.y, 3);

  p.stroke(pal.ink);
  p.strokeWeight(style === "ink" ? 1.2 : 2);
  p.fill(pal.shade);
  p.triangle(pts.wing.x - 10, pts.wing.y, pts.wing.x + 8, pts.wing.y + 10, pts.wingTip.x, pts.wingTip.y);
  p.stroke(pal.frame);
  p.strokeWeight(3);
  p.line(pts.headTube.x, pts.headTube.y, pts.handle.x, pts.handle.y);
  p.line(pts.handle.x - 14, pts.handle.y + 2, pts.handle.x + 8, pts.handle.y + 5);

  p.stroke(pal.frame);
  p.strokeWeight(3.6);
  p.line(pts.bb.x, pts.bb.y, pts.ankleNear.x, pts.ankleNear.y);
  limb(p, pts.hip, pts.kneeNear, pts.ankleNear, pts.footNear, style === "ink" ? 6.5 : 8.5, pal.body, pal.ink, pal.beak);

  p.pop();
}
