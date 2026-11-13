/**
 * One pose for every drawing style.
 * Local space: origin at the rear tyre contact, +x forward, +y up.
 * The scheduler flips y when it draws.
 */

import { pedalAngle, worldX } from "../beat/timeline.js";
import { ANCHOR_X, GROUND_Y, RIG } from "../beat/world.js";

export function solveKnee(hip, foot, femur, tibia) {
  let dx = foot.x - hip.x;
  let dy = foot.y - hip.y;
  let dist = Math.hypot(dx, dy) || 1e-6;
  const max = femur + tibia - 1e-3;
  const min = Math.abs(femur - tibia) + 1e-3;
  if (dist > max) {
    const s = max / dist;
    dx *= s;
    dy *= s;
    dist = max;
  } else if (dist < min) {
    const s = min / dist;
    dx *= s;
    dy *= s;
    dist = min;
  }
  const base = Math.atan2(dy, dx);
  const cosA = (femur * femur + dist * dist - tibia * tibia) / (2 * femur * dist);
  const bend = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const knees = [1, -1].map((sign) => {
    const a = base + sign * bend;
    return {
      x: hip.x + Math.cos(a) * femur,
      y: hip.y + Math.sin(a) * femur,
    };
  });
  return knees[0].y >= knees[1].y ? knees[0] : knees[1];
}

function rotateAround(pt, origin, angle) {
  if (!angle) return pt;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const x = pt.x - origin.x;
  const y = pt.y - origin.y;
  return { x: origin.x + x * c - y * s, y: origin.y + x * s + y * c };
}

export function poseAt(t, opts = {}) {
  const crank = opts.crank ?? pedalAngle(t);
  const headTurn = opts.headTurn ?? 0;
  const bob = Math.cos(crank * 2) * 2.2;
  const rear = { x: 0, y: RIG.wheelR };
  const front = { x: RIG.wheelbase, y: RIG.wheelR };
  const bb = { x: RIG.bb.x, y: RIG.bb.y };
  const pedalNear = {
    x: bb.x + Math.cos(crank) * RIG.pedalR,
    y: bb.y + Math.sin(crank) * RIG.pedalR,
  };
  const pedalFar = {
    x: bb.x + Math.cos(crank + Math.PI) * RIG.pedalR,
    y: bb.y + Math.sin(crank + Math.PI) * RIG.pedalR,
  };
  const hip = { x: RIG.hip.x, y: RIG.hip.y + bob };
  const kneeNear = solveKnee(hip, pedalNear, RIG.femur, RIG.tibia);
  const kneeFar = solveKnee(hip, pedalFar, RIG.femur, RIG.tibia);
  const body = { x: 102, y: 136 + bob };
  const neck = { x: 140, y: 156 + bob };
  const head = { x: 176, y: 200 + bob * 0.85 };
  const eye = rotateAround({ x: 188, y: 208 + bob * 0.85 }, head, headTurn);
  const beakTop = rotateAround({ x: 166, y: 206 + bob * 0.85 }, head, headTurn);
  const beakLow = rotateAround({ x: 162, y: 188 + bob * 0.85 }, head, headTurn);
  const beakTip = rotateAround({ x: 236, y: 194 + bob * 0.85 }, head, headTurn);
  const pouch = rotateAround({ x: 208, y: 172 + bob * 0.85 }, head, headTurn);
  const tail = { x: 18, y: 146 + bob * 0.35 };
  const tailTip = { x: 2, y: 162 + bob * 0.2 };
  const seat = { x: RIG.seat.x, y: RIG.seat.y + bob * 0.12 };
  const wing = { x: 112, y: 150 + bob };
  const wingTip = {
    x: RIG.handle.x - 8,
    y: RIG.handle.y - 2 + Math.sin(crank) * 2.5,
  };

  return {
    t,
    worldX: worldX(t),
    groundY: GROUND_Y,
    anchorX: ANCHOR_X,
    crank,
    bob,
    wheel: worldX(t) / RIG.wheelR,
    facing: opts.facing ?? 1,
    headTurn,
    points: {
      rear,
      front,
      bb,
      pedalNear,
      pedalFar,
      hip,
      kneeNear,
      kneeFar,
      body,
      neck,
      head,
      eye,
      beakTop,
      beakLow,
      beakTip,
      pouch,
      tail,
      tailTip,
      seat,
      wing,
      wingTip,
      handle: { x: RIG.handle.x, y: RIG.handle.y },
      headTube: { x: RIG.headTube.x, y: RIG.headTube.y },
    },
  };
}
