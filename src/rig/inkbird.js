/**
 * Ink renderings of the same pose.
 * ink: Song wash. tang: line only, ribbons. qingming: light color.
 * rubbing: white lines. bada: almost nothing, except the rolled eye.
 */

import { sectionStart } from "../beat/timeline.js";
import { smoothstep } from "../beat/cues.js";
import { RIG } from "../beat/world.js";

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function wedge(p, a, b, w0, w1, rgb, alpha) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  p.noStroke();
  p.fill(rgb[0], rgb[1], rgb[2], alpha);
  p.beginShape();
  p.vertex(a.x + nx * w0, a.y + ny * w0);
  p.vertex(a.x - nx * w0, a.y - ny * w0);
  p.vertex(b.x - nx * w1, b.y - ny * w1);
  p.vertex(b.x + nx * w1, b.y + ny * w1);
  p.endShape(p.CLOSE);
}

function solid(p, a, b, width, rgb, alpha) {
  wedge(p, a, b, width, width * 0.66, rgb, alpha);
}

function dryLine(p, a, b, width, rgb, seed, gaps) {
  const steps = 6;
  let skipped = 0;
  for (let i = 0; i < steps; i++) {
    if (gaps > 0 && hash(seed + i * 17.3) < gaps && skipped < 1) {
      skipped += 1;
      continue;
    }
    const t0 = i / steps;
    const t1 = Math.min(1, (i + 1.15) / steps);
    const j = (hash(seed + i + 3) - 0.5) * width * 0.22;
    const p0 = { x: a.x + (b.x - a.x) * t0 + j, y: a.y + (b.y - a.y) * t0 };
    const p1 = { x: a.x + (b.x - a.x) * t1 + j * 0.3, y: a.y + (b.y - a.y) * t1 };
    const fade = 190 + hash(seed + i * 5) * 55;
    wedge(p, p0, p1, width * (0.72 + hash(seed + i) * 0.35), width * (0.5 + hash(seed + i + 2) * 0.3), rgb, fade);
  }
}

function dryCircle(p, c, r, width, rgb, seed, spin, gaps) {
  const n = 16;
  for (let i = 0; i < n; i++) {
    if (hash(seed + i * 9) < gaps * 0.45) continue;
    const a0 = spin + (i / n) * Math.PI * 2;
    const a1 = spin + ((i + 0.72) / n) * Math.PI * 2;
    const rr = r + Math.sin(a0 * 3 + seed) * 1.4;
    dryLine(
      p,
      { x: c.x + Math.cos(a0) * rr, y: c.y + Math.sin(a0) * rr },
      { x: c.x + Math.cos(a1) * rr, y: c.y + Math.sin(a1) * rr },
      width,
      rgb,
      seed + i * 13,
      gaps * 0.35,
    );
  }
}

const MODES = {
  ink: { rgb: [32, 28, 24], wash: 110, gaps: 0.04, beak: [92, 62, 50], ribbons: 0.15, eye: "dot" },
  tang: { rgb: [24, 20, 18], wash: 28, gaps: 0.02, beak: [24, 20, 18], ribbons: 1, eye: "dot" },
  qingming: { rgb: [54, 38, 26], wash: 80, gaps: 0.03, beak: [148, 68, 48], ribbons: 0.35, eye: "dot" },
  rubbing: { rgb: [236, 232, 222], wash: 48, gaps: 0, beak: [236, 232, 222], ribbons: 0, eye: "dot" },
  bada: { rgb: [16, 16, 16], wash: 0, gaps: 0.16, beak: [16, 16, 16], ribbons: 0, eye: "roll" },
};

function leg(p, hip, knee, ankle, foot, mode, seed, width) {
  dryLine(p, hip, knee, width, mode.rgb, seed, mode.gaps);
  dryLine(p, knee, ankle, width * 0.86, mode.rgb, seed + 4, mode.gaps);
  if (!foot || foot.length < 9) return;
  dryLine(p, ankle, foot[4], width * 0.38, mode.beak, seed + 9, 0.04);
  dryLine(p, ankle, foot[7], width * 0.34, mode.beak, seed + 10, 0.04);
  dryLine(p, ankle, foot[9], width * 0.3, mode.beak, seed + 11, 0.04);
}

function wheel(p, hub, radius, spin, mode, seed, faint) {
  const gap = faint ? Math.min(0.55, mode.gaps + 0.28) : mode.gaps;
  dryCircle(p, hub, radius, faint ? 1.5 : 2.4, mode.rgb, seed, spin, gap);
  dryCircle(p, hub, radius - 7, 1.1, mode.rgb, seed + 3, spin, gap);
  const n = faint ? 3 : 6;
  for (let i = 0; i < n; i++) {
    const a = spin + (i / n) * Math.PI * 2;
    dryLine(
      p,
      { x: hub.x + Math.cos(a) * 7, y: hub.y + Math.sin(a) * 7 },
      { x: hub.x + Math.cos(a) * (radius - 8), y: hub.y + Math.sin(a) * (radius - 8) },
      1.05,
      mode.rgb,
      seed + 20 + i,
      mode.gaps,
    );
  }
}

function ribbons(p, pose, mode) {
  if (mode.ribbons < 0.2) return;
  const local = pose.t - sectionStart(4);
  const gust = mode.ribbons * (0.45 + Math.sin(Math.min(1, Math.max(0, (local - 2) / 2)) * Math.PI) * 0.9);
  const origins = [pose.points.tail, pose.points.wing, pose.points.handle];
  origins.forEach((origin, k) => {
    let prev = null;
    const len = (78 + k * 18) * gust;
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const pt = {
        x: origin.x - t * len,
        y: origin.y + Math.sin(pose.t * 2.4 + k + t * 6) * (8 + 14 * t) * gust,
      };
      if (prev) dryLine(p, prev, pt, k === 2 ? 1.2 : 1.6, mode.rgb, 180 + k * 30 + i, 0.04);
      prev = pt;
    }
  });
}

function eye(p, pose, mode) {
  const c = pose.points.eye;
  if (mode.eye !== "roll") {
    p.noStroke();
    p.fill(mode.rgb[0], mode.rgb[1], mode.rgb[2], 230);
    p.circle(c.x, c.y, 4.2);
    return;
  }
  const local = pose.t - sectionStart(9);
  const up = smoothstep((local - 1.7) / 0.4) * (1 - smoothstep((local - 3.65) / 0.45));
  const center = { x: pose.points.head.x + 4, y: pose.points.head.y + 2 };
  p.noStroke();
  p.fill(236, 232, 224, 255);
  p.circle(center.x, center.y, 46);
  p.noFill();
  p.stroke(mode.rgb[0], mode.rgb[1], mode.rgb[2], 230);
  p.strokeWeight(2.2);
  p.circle(center.x, center.y, 46);
  p.noStroke();
  p.fill(12, 12, 12, 245);
  p.circle(center.x + 1, center.y + 16 * up, 8);
}

export function drawInkBird(p, pose, style) {
  const mode = MODES[style] || MODES.ink;
  const pts = pose.points;
  const sparse = style === "bada";
  p.push();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);

  if (mode.wash > 0 && !sparse) {
    p.noStroke();
    p.fill(mode.rgb[0], mode.rgb[1], mode.rgb[2], mode.wash);
    p.ellipse(pts.body.x - 4, pts.body.y, 120, 44);
    p.ellipse(pts.body.x + 16, pts.body.y + 2, 64, 26);
    p.ellipse(pts.neck.x + 6, pts.neck.y + 6, 26, 34);
    p.ellipse(pts.head.x, pts.head.y, 32, 26);
  }

  leg(p, pts.hip, pts.kneeFar, pts.ankleFar, pts.footFar, mode, 80, sparse ? 1.6 : 3.1);

  wheel(p, pts.rear, RIG.wheelR, pose.wheel, mode, 2, sparse);
  if (!sparse) wheel(p, pts.front, RIG.wheelR, pose.wheel, mode, 30, false);
  else dryCircle(p, pts.front, RIG.wheelR, 1.2, mode.rgb, 33, pose.wheel, 0.5);

  dryLine(p, pts.rear, pts.bb, sparse ? 1.3 : 2.2, mode.rgb, 50, mode.gaps);
  dryLine(p, pts.bb, pts.headTube, 2, mode.rgb, 51, mode.gaps);
  dryLine(p, pts.headTube, pts.seat, sparse ? 1.2 : 2, mode.rgb, 52, mode.gaps);
  if (!sparse) {
    dryLine(p, pts.seat, pts.rear, 1.8, mode.rgb, 53, mode.gaps);
    dryLine(p, pts.headTube, pts.front, 1.8, mode.rgb, 54, mode.gaps);
    dryCircle(p, pts.bb, RIG.chainringR, 1.3, mode.rgb, 55, pose.crank, mode.gaps);
    dryLine(p, pts.bb, pts.ankleFar, 1.5, mode.rgb, 56, mode.gaps);
    dryLine(p, pts.headTube, pts.handle, 2.1, mode.rgb, 57, mode.gaps);
    dryLine(p, { x: pts.handle.x - 16, y: pts.handle.y }, { x: pts.handle.x + 10, y: pts.handle.y + 3 }, 1.8, mode.rgb, 58, 0.02);
  }

  if (!sparse) {
    solid(p, pts.tailTip, pts.body, 3.6, mode.rgb, 210);
    solid(p, pts.body, pts.neck, 3, mode.rgb, 210);
    solid(p, pts.neck, pts.head, 2.4, mode.rgb, 200);
    solid(p, pts.beakTop, pts.beakTip, 3.4, mode.beak, 220);
  }
  dryLine(p, pts.tailTip, pts.body, sparse ? 4.2 : 2.2, mode.rgb, 60, mode.gaps);
  dryLine(p, pts.body, pts.neck, sparse ? 2.2 : 1.8, mode.rgb, 61, mode.gaps);
  dryLine(p, pts.neck, pts.head, sparse ? 1.6 : 1.5, mode.rgb, 62, mode.gaps);
  dryLine(p, { x: pts.tail.x, y: pts.tail.y - 10 }, { x: pts.body.x + 10, y: pts.body.y - 16 }, 1.5, mode.rgb, 63, mode.gaps + 0.08);

  if (!sparse) {
    for (let i = 0; i < (style === "tang" ? 7 : 4); i++) {
      dryLine(
        p,
        { x: pts.wing.x - i * 6, y: pts.wing.y + 2 },
        { x: pts.tail.x + 8 - i * 4, y: pts.wing.y - 8 - i * 3 },
        1.7,
        mode.rgb,
        70 + i,
        mode.gaps,
      );
    }
  }

  dryLine(p, pts.beakTop, pts.beakTip, sparse ? 2.4 : 3.2, mode.beak, 90, 0.04);
  dryLine(p, pts.beakLow, pts.beakTip, 1.5, mode.beak, 91, 0.08);
  dryLine(p, pts.beakLow, pts.pouch, 1.6, mode.rgb, 92, mode.gaps);
  eye(p, pose, mode);
  ribbons(p, pose, mode);

  if (!sparse) dryLine(p, pts.bb, pts.ankleNear, 1.7, mode.rgb, 96, mode.gaps);
  leg(p, pts.hip, pts.kneeNear, pts.ankleNear, pts.footNear, mode, 100, sparse ? 2 : 3.6);

  p.pop();
}
