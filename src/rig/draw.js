/**
 * Two drawings of the same pose: a clean default, and a pencil plate.
 * Caller places the rig: translate to the rear contact, then scale(s, -s)
 * so local +y (up) points up the screen.
 *
 * Draw order: far leg behind the frame, near leg in front of it.
 */

import { RIG } from "../beat/world.js";

const INK = "#241c16";
const BODY = "#F4F0E6";
const BODY_SHADE = "#E3DDD0";
const BEAK = "#E37A2A";
const POUCH = "#F0B07A";
const FRAME = "#2A2E33";
const TIRE = "#1A1C1F";
const RIM = "#C5CAD1";

const NEAR = {
  leg: "#F0B090",
  legInk: "#8A4A32",
  foot: "#E36A28",
  web: "#F09458",
  footInk: "#7A3414",
  pedal: "#2C3138",
};
const FAR = {
  leg: "#C4A090",
  legInk: "#6A5348",
  foot: "#C47A52",
  web: "#D4A088",
  footInk: "#6A4838",
  pedal: "#3A3E44",
};

function poly(p, pts) {
  p.beginShape();
  for (const pt of pts) p.vertex(pt.x, pt.y);
  p.endShape(p.CLOSE);
}

function segment(p, a, b, weight, color) {
  p.stroke(color);
  p.strokeWeight(weight);
  p.line(a.x, a.y, b.x, b.y);
}

function wheel(p, hub, radius, angle, pencil) {
  const tire = pencil ? INK : TIRE;
  const rim = pencil ? "#5c5148" : RIM;
  p.noFill();
  p.stroke(tire);
  p.strokeWeight(pencil ? 1.6 : 7);
  p.circle(hub.x, hub.y, radius * 2);
  if (!pencil) {
    p.stroke(rim);
    p.strokeWeight(2.4);
    p.circle(hub.x, hub.y, radius * 2 - 9);
  }
  p.stroke(pencil ? "#5c5148" : "#8d939c");
  p.strokeWeight(pencil ? 0.8 : 1.3);
  const inner = radius - (pencil ? 3 : 8);
  for (let i = 0; i < 12; i++) {
    const a = angle + (i * Math.PI) / 6;
    p.line(hub.x, hub.y, hub.x + Math.cos(a) * inner, hub.y + Math.sin(a) * inner);
  }
  p.noStroke();
  p.fill(tire);
  p.circle(hub.x, hub.y, pencil ? 3.5 : 8);
}

function drawCrank(p, bb, spindle, weight) {
  p.stroke("#1c1e22");
  p.strokeWeight(weight);
  p.line(bb.x, bb.y, spindle.x, spindle.y);
}

/** Level pedal. The spindle is the ankle. */
function drawPedal(p, spindle, color) {
  p.rectMode(p.CORNER);
  p.noStroke();
  p.fill(color);
  p.rect(spindle.x - 13, spindle.y - 2.6, 26, 5.2, 1.4);
  p.fill("#f2f4f6");
  p.circle(spindle.x, spindle.y, 4);
}

function drawLeg(p, hip, knee, ankle, weight, color, ink) {
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  p.stroke(ink);
  p.strokeWeight(weight + 3.2);
  p.line(hip.x, hip.y, knee.x, knee.y);
  p.line(knee.x, knee.y, ankle.x, ankle.y);
  p.stroke(color);
  p.strokeWeight(weight);
  p.line(hip.x, hip.y, knee.x, knee.y);
  p.line(knee.x, knee.y, ankle.x, ankle.y);
  p.noStroke();
  p.fill(ink);
  p.circle(knee.x, knee.y, weight + 2);
  p.fill(color);
  p.circle(knee.x, knee.y, weight * 0.82);
}

function drawFoot(p, ankle, outline, palette, pencil) {
  if (!outline || outline.length < 3) return;
  if (pencil) {
    p.noFill();
    p.stroke(INK);
    p.strokeWeight(1.4);
    poly(p, outline);
    return;
  }
  p.fill(palette.web);
  p.stroke(palette.footInk);
  p.strokeWeight(1.5);
  poly(p, outline);
  p.noStroke();
  p.fill(palette.foot);
  // Three toe pads, forward of the spindle, so the webbing reads at small sizes.
  p.ellipse(ankle.x + 16, ankle.y + 2, 12, 5);
  p.ellipse(ankle.x + 19, ankle.y + 7, 13, 5.5);
  p.ellipse(ankle.x + 15, ankle.y + 12, 11, 5);
}

function drawLimb(p, pose, side, pencil) {
  const pts = pose.points;
  const far = side === "far";
  const hip = pts.hip;
  const knee = far ? pts.kneeFar : pts.kneeNear;
  const ankle = far ? pts.ankleFar : pts.ankleNear;
  const foot = far ? pts.footFar : pts.footNear;
  const palette = far ? FAR : NEAR;
  const weight = pencil ? (far ? 1.4 : 1.7) : (far ? 8.5 : 11);
  drawCrank(p, pts.bb, ankle, pencil ? 1.2 : far ? 3.4 : 4.2);
  if (!pencil) drawPedal(p, ankle, palette.pedal);
  if (pencil) {
    p.stroke(INK);
    p.strokeWeight(weight);
    p.line(hip.x, hip.y, knee.x, knee.y);
    p.line(knee.x, knee.y, ankle.x, ankle.y);
  } else {
    drawLeg(p, hip, knee, ankle, weight, palette.leg, palette.legInk);
  }
  drawFoot(p, ankle, foot, palette, pencil);
}

export function drawRig(p, pose, style = "default") {
  const pencil = style === "pencil";
  const pts = pose.points;

  p.push();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  p.ellipseMode(p.CENTER);
  p.rectMode(p.CORNER);

  if (pencil) {
    p.push();
    p.translate(1.4, 0.6);
    drawRigBody(p, pose, true);
    p.pop();
  }
  drawRigBody(p, pose, pencil);
  p.pop();

  function drawRigBody(p, pose, pencil) {
    const pts = pose.points;
    const { rear, front, bb } = pts;
    const body = pencil ? "#f7f3ea" : BODY;
    const shade = pencil ? "#e4ddd0" : BODY_SHADE;
    const beak = pencil ? INK : BEAK;
    const pouch = pencil ? "#c4b09a" : POUCH;
    const frame = pencil ? INK : FRAME;

    if (!pencil) {
      p.noStroke();
      p.fill(30, 22, 14, 45);
      p.ellipse((rear.x + front.x) / 2, 4, 210, 14);
    }

    wheel(p, rear, RIG.wheelR, pose.wheel, pencil);
    wheel(p, front, RIG.wheelR, pose.wheel, pencil);

    drawLimb(p, pose, "far", pencil);

    // Stop the chainstay at the chainring so the rear pedal is not buried in the tube.
    const stay = RIG.chainringR + 2;
    const sx = bb.x - rear.x;
    const sy = bb.y - rear.y;
    const sl = Math.hypot(sx, sy) || 1;
    const stayEnd = { x: bb.x - (sx / sl) * stay, y: bb.y - (sy / sl) * stay };
    segment(p, rear, stayEnd, pencil ? 1.5 : 5.5, frame);
    segment(p, bb, pts.headTube, pencil ? 1.5 : 6, frame);
    segment(p, pts.headTube, pts.seat, pencil ? 1.5 : 5.5, frame);
    segment(p, pts.seat, rear, pencil ? 1.3 : 5, frame);
    segment(p, pts.headTube, front, pencil ? 1.5 : 5.5, frame);

    p.noFill();
    p.stroke(pencil ? "#5c5148" : "#3a3e44");
    p.strokeWeight(pencil ? 0.8 : 2.2);
    p.line(bb.x, bb.y + RIG.chainringR * 0.75, rear.x + 12, rear.y - 4);
    p.line(bb.x, bb.y - RIG.chainringR * 0.75, rear.x + 12, rear.y + 8);
    p.stroke(pencil ? INK : "#1c1e22");
    p.strokeWeight(pencil ? 1.4 : 3.5);
    p.circle(bb.x, bb.y, RIG.chainringR * 2);
    p.strokeWeight(pencil ? 0.8 : 1.5);
    p.circle(bb.x, bb.y, RIG.chainringR * 1.15);
    p.noStroke();
    p.fill(pencil ? INK : "#1c1e22");
    p.circle(bb.x, bb.y, 6);

    if (pencil) {
      p.noFill();
      p.stroke(INK);
      p.strokeWeight(1.3);
    } else {
      p.noStroke();
      p.fill(shade);
    }
    poly(p, [
      { x: pts.body.x - 40, y: pts.body.y + 6 },
      pts.tailTip,
      { x: pts.tail.x + 6, y: pts.tail.y - 14 },
    ]);

    if (pencil) {
      p.noFill();
      p.stroke(INK);
      p.strokeWeight(1.5);
    } else {
      p.stroke(INK);
      p.strokeWeight(2);
      p.fill(body);
    }
    p.ellipse(pts.body.x, pts.body.y, 126, 52);

    if (!pencil) {
      p.stroke(INK);
      p.strokeWeight(1.5);
      p.fill(shade);
      p.ellipse(pts.body.x - 6, pts.body.y + 2, 76, 26);
    }

    const n = pts.neck;
    const h = pts.head;
    p.noFill();
    if (!pencil) {
      p.stroke(body);
      p.strokeWeight(16);
      p.bezier(n.x, n.y, n.x + 8, n.y + 26, h.x - 26, h.y - 6, h.x - 4, h.y - 2);
    }
    p.stroke(INK);
    p.strokeWeight(pencil ? 1.6 : 2);
    p.bezier(n.x, n.y, n.x + 8, n.y + 26, h.x - 26, h.y - 6, h.x - 4, h.y - 2);

    if (pencil) {
      p.noFill();
      p.stroke(INK);
      p.strokeWeight(1.5);
    } else {
      p.stroke(INK);
      p.strokeWeight(2);
      p.fill(body);
    }
    p.ellipse(h.x, h.y, 40, 32);

    if (pencil) {
      p.noFill();
      p.stroke(INK);
      p.strokeWeight(1.4);
    } else {
      p.stroke(INK);
      p.strokeWeight(1.6);
      p.fill(beak);
    }
    poly(p, [pts.beakTop, pts.beakTip, { x: pts.beakTip.x - 8, y: pts.beakTip.y - 7 }, pts.beakLow]);
    if (!pencil) p.fill(pouch);
    else p.noFill();
    poly(p, [pts.beakLow, { x: pts.beakTip.x - 18, y: pts.beakTip.y - 8 }, pts.pouch]);

    p.stroke(INK);
    p.strokeWeight(pencil ? 1 : 1.4);
    p.fill(pencil ? "#f4efe6" : "#fffdf8");
    p.circle(pts.eye.x, pts.eye.y, pencil ? 6 : 9);
    p.noStroke();
    p.fill(INK);
    p.circle(pts.eye.x + 1.2, pts.eye.y + 0.4, pencil ? 2.2 : 3.6);

    if (pencil) {
      p.noFill();
      p.stroke(INK);
      p.strokeWeight(1.3);
      p.line(pts.wing.x, pts.wing.y, pts.wingTip.x, pts.wingTip.y);
    } else {
      p.stroke(INK);
      p.strokeWeight(2);
      p.fill(shade);
      p.triangle(
        pts.wing.x - 14,
        pts.wing.y - 6,
        pts.wing.x + 8,
        pts.wing.y + 12,
        pts.wingTip.x,
        pts.wingTip.y,
      );
    }

    if (!pencil) {
      p.noStroke();
      p.fill("#1c1e22");
      p.ellipse(pts.seat.x, pts.seat.y + 1, 26, 9);
    } else {
      p.noFill();
      p.stroke(INK);
      p.strokeWeight(1.3);
      p.ellipse(pts.seat.x, pts.seat.y + 1, 26, 9);
    }
    segment(p, pts.headTube, pts.handle, pencil ? 1.4 : 5, frame);
    segment(
      p,
      { x: pts.handle.x - 16, y: pts.handle.y + 2 },
      { x: pts.handle.x + 8, y: pts.handle.y + 6 },
      pencil ? 1.5 : 5.5,
      frame,
    );

    drawLimb(p, pose, "near", pencil);
  }
}
