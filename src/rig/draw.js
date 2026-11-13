/**
 * Two drawings of the same pose: a clean default, and a pencil plate.
 * Caller places the rig: translate to the rear contact, then scale(s, -s)
 * so local +y (up) points up the screen.
 */

const INK = "#241c16";
const BODY = "#F4F0E6";
const BODY_SHADE = "#E3DDD0";
const BEAK = "#E37A2A";
const POUCH = "#F0B07A";
const FRAME = "#2A2E33";
const TIRE = "#1A1C1F";
const RIM = "#C5CAD1";

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

function limb(p, hip, knee, foot, weight, color) {
  segment(p, hip, knee, weight + 2.2, INK);
  segment(p, knee, foot, weight + 2.2, INK);
  segment(p, hip, knee, weight, color);
  segment(p, knee, foot, weight, color);
  p.noStroke();
  p.fill(color);
  p.circle(knee.x, knee.y, weight);
  p.stroke(INK);
  p.strokeWeight(1.2);
  p.fill("#4a4e55");
  p.circle(foot.x, foot.y, 8);
}

function crank(p, bb, foot) {
  segment(p, bb, foot, 4, "#1a1c1f");
}

export function drawRig(p, pose, style = "default") {
  const pencil = style === "pencil";
  const pts = pose.points;
  const { rear, front, bb } = pts;
  const radius = 46;

  p.push();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  p.ellipseMode(p.CENTER);

  if (pencil) {
    p.push();
    p.translate(1.4, 0.6);
    drawRigBody(p, pose, true, 0.55);
    p.pop();
  }
  drawRigBody(p, pose, pencil, 1);

  p.pop();

  function drawRigBody(p, pose, pencil, alphaMul) {
    const pts = pose.points;
    const body = pencil ? INK : BODY;
    const shade = pencil ? "#5a5048" : BODY_SHADE;
    const beak = pencil ? INK : BEAK;
    const pouch = pencil ? "#6a5344" : POUCH;
    const frame = pencil ? INK : FRAME;
    p.push();
    if (alphaMul < 1) {
      // pencil ghost; p5 stroke alpha is per-call via the color string
    }

    // shadow
    if (!pencil) {
      p.noStroke();
      p.fill(30, 22, 14, 45);
      p.ellipse((rear.x + front.x) / 2, 4, 210, 14);
    }

    wheel(p, rear, radius, pose.wheel, pencil);
    wheel(p, front, radius, pose.wheel, pencil);

    // frame
    segment(p, rear, bb, pencil ? 1.5 : 6, frame);
    segment(p, bb, pts.headTube, pencil ? 1.5 : 6, frame);
    segment(p, pts.headTube, pts.seat, pencil ? 1.5 : 5.5, frame);
    segment(p, pts.seat, rear, pencil ? 1.3 : 5, frame);
    segment(p, pts.headTube, front, pencil ? 1.5 : 5.5, frame);

    // chain + chainring
    p.noFill();
    p.stroke(pencil ? "#5c5148" : "#3a3e44");
    p.strokeWeight(pencil ? 0.8 : 2);
    p.line(bb.x, bb.y + 11, rear.x + 10, rear.y - 2);
    p.line(bb.x, bb.y - 11, rear.x + 10, rear.y + 6);
    p.circle(bb.x, bb.y, pencil ? 16 : 24);

    // far leg under the body
    crank(p, bb, pts.pedalFar);
    limb(p, pts.hip, pts.kneeFar, pts.pedalFar, pencil ? 1.3 : 6.5, pencil ? "#5c5148" : "#d9d3c6");

    // tail
    if (pencil) {
      p.noFill();
      p.stroke(INK);
      p.strokeWeight(1.3);
    } else {
      p.noStroke();
      p.fill(shade);
    }
    poly(p, [
      { x: pts.body.x - 36, y: pts.body.y + 8 },
      pts.tailTip,
      { x: pts.tail.x + 8, y: pts.tail.y - 16 },
    ]);

    // body
    if (pencil) {
      p.noFill();
      p.stroke(INK);
      p.strokeWeight(1.5);
    } else {
      p.stroke(INK);
      p.strokeWeight(2);
      p.fill(body);
    }
    p.ellipse(pts.body.x, pts.body.y, 128, 56);

    // folded far wing
    if (!pencil) {
      p.stroke(INK);
      p.strokeWeight(1.5);
      p.fill(shade);
      p.ellipse(pts.body.x - 8, pts.body.y + 4, 78, 28);
    }

    // neck
    p.noFill();
    p.stroke(pencil ? INK : INK);
    p.strokeWeight(pencil ? 1.6 : 16);
    const n = pts.neck;
    const h = pts.head;
    if (!pencil) {
      p.stroke(body);
      p.strokeWeight(16);
      p.bezier(n.x, n.y, n.x + 8, n.y + 28, h.x - 28, h.y - 8, h.x - 6, h.y - 4);
      p.stroke(INK);
      p.strokeWeight(2);
    }
    p.bezier(n.x, n.y, n.x + 8, n.y + 28, h.x - 28, h.y - 8, h.x - 6, h.y - 4);

    // head
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

    // beak + pouch
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
    poly(p, [pts.beakLow, { x: pts.beakTip.x - 18, y: pts.beakTip.y - 8 }, pts.pouch]);

    // eye
    p.stroke(INK);
    p.strokeWeight(pencil ? 1 : 1.4);
    p.fill(pencil ? "#f4efe6" : "#fffdf8");
    p.circle(pts.eye.x, pts.eye.y, pencil ? 6 : 9);
    p.noStroke();
    p.fill(INK);
    p.circle(pts.eye.x + 1.2, pts.eye.y + 0.4, pencil ? 2.2 : 3.6);

    // near wing / arm to the bar
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
        pts.wing.x - 16,
        pts.wing.y - 8,
        pts.wing.x + 10,
        pts.wing.y + 14,
        pts.wingTip.x,
        pts.wingTip.y,
      );
    }

    // seat + bars
    if (!pencil) {
      p.noStroke();
      p.fill("#1c1e22");
      p.ellipse(pts.seat.x, pts.seat.y + 2, 22, 8);
    } else {
      p.noFill();
      p.stroke(INK);
      p.strokeWeight(1.3);
      p.ellipse(pts.seat.x, pts.seat.y + 2, 22, 8);
    }
    segment(p, pts.headTube, pts.handle, pencil ? 1.4 : 5, frame);
    segment(
      p,
      { x: pts.handle.x - 14, y: pts.handle.y + 3 },
      { x: pts.handle.x + 8, y: pts.handle.y + 7 },
      pencil ? 1.5 : 5,
      frame,
    );

    // near leg
    crank(p, bb, pts.pedalNear);
    limb(p, pts.hip, pts.kneeNear, pts.pedalNear, pencil ? 1.5 : 7.2, pencil ? INK : BODY);

    p.pop();
  }
}
