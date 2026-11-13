/**
 * One pose for every drawing style.
 * Local space: origin at the rear tyre contact, +x forward, +y up.
 * The scheduler flips y when it draws, so +y here is up on screen.
 *
 * Crank angle 0 puts the near pedal straight forward. Increasing angle
 * sends that pedal downward (clockwise on screen). One turn per second.
 */

import { pedalAngle, worldX } from "../beat/timeline.js";
import { ANCHOR_X, GROUND_Y, RIG } from "../beat/world.js";

/** Knees stay on this side of the hip–ankle line: forward, toward the bars. */
export const KNEE_POLE = { x: RIG.handle.x, y: RIG.handle.y + 8 };

/**
 * Two-bone IK. The bend sign is the handlebar side of the hip–foot line,
 * the same for every phase and for both legs.
 * The foot argument is returned unchanged; the caller keeps it on the pedal.
 */
export function solveKnee(hip, foot, femur, tibia, pole = KNEE_POLE) {
  const dx = foot.x - hip.x;
  const dy = foot.y - hip.y;
  const dist = Math.hypot(dx, dy) || 1e-6;
  const cosA = (femur * femur + dist * dist - tibia * tibia) / (2 * femur * dist);
  const bend = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const base = Math.atan2(dy, dx);
  const candidates = [1, -1].map((sign) => {
    const a = base + sign * bend;
    const knee = {
      x: hip.x + Math.cos(a) * femur,
      y: hip.y + Math.sin(a) * femur,
    };
    const side = dx * (knee.y - hip.y) - dy * (knee.x - hip.x);
    return { knee, side };
  });
  const poleSide = dx * (pole.y - hip.y) - dy * (pole.x - hip.x);
  const same = (candidate) => Math.sign(candidate.side) === Math.sign(poleSide) || poleSide === 0;
  const pick = same(candidates[0]) ? candidates[0] : candidates[1];
  return pick.knee;
}

function rotateAround(pt, origin, angle) {
  if (!angle) return pt;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const x = pt.x - origin.x;
  const y = pt.y - origin.y;
  return { x: origin.x + x * c - y * s, y: origin.y + x * s + y * c };
}

/**
 * Webbed foot. The ball of the foot is the spindle (0, 0).
 * Toes point forward; the sole sits on the level pedal.
 */
function footOutline(ankle, tilt) {
  const local = [
    { x: -8, y: -1 },
    { x: -3, y: 1.2 },
    { x: 0, y: -0.4 },
    { x: 8, y: -0.2 },
    { x: 16, y: 0.6 },
    { x: 22, y: 3.4 },
    { x: 17, y: 6.6 },
    { x: 24, y: 8.8 },
    { x: 17, y: 11.4 },
    { x: 20, y: 14.6 },
    { x: 12, y: 12.4 },
    { x: 4, y: 7.7 },
    { x: -2, y: 4.2 },
  ];
  return local.map((pt) => rotateAround(
    { x: ankle.x + pt.x, y: ankle.y + pt.y },
    ankle,
    tilt,
  ));
}

function pedalAt(bb, angle) {
  return {
    x: bb.x + Math.cos(angle) * RIG.pedalR,
    y: bb.y - Math.sin(angle) * RIG.pedalR,
  };
}

export function poseAt(t, opts = {}) {
  const crank = opts.crank ?? pedalAngle(t);
  const headTurn = opts.headTurn ?? 0;
  const bob = Math.cos(crank * 2) * 1.5;
  const rear = { x: 0, y: RIG.wheelR };
  const front = { x: RIG.wheelbase, y: RIG.wheelR };
  const bb = { x: RIG.bb.x, y: RIG.bb.y };
  const hip = { x: RIG.hip.x, y: RIG.hip.y };
  const seat = { x: RIG.seat.x, y: RIG.seat.y };
  const pedalNear = pedalAt(bb, crank);
  const pedalFar = pedalAt(bb, crank + Math.PI);
  const ankleNear = { x: pedalNear.x, y: pedalNear.y };
  const ankleFar = { x: pedalFar.x, y: pedalFar.y };
  const kneeNear = solveKnee(hip, ankleNear, RIG.femur, RIG.tibia);
  const kneeFar = solveKnee(hip, ankleFar, RIG.femur, RIG.tibia);
  const tiltNear = -0.16 * Math.sin(crank);
  const tiltFar = -0.16 * Math.sin(crank + Math.PI);
  const body = { x: hip.x + 32, y: hip.y + 24 + bob };
  const neck = { x: hip.x + 66, y: hip.y + 42 + bob };
  const head = { x: hip.x + 102, y: hip.y + 78 + bob * 0.85 };
  const eye = rotateAround({ x: head.x + 12, y: head.y + 8 }, head, headTurn);
  const beakTop = rotateAround({ x: head.x - 8, y: head.y + 6 }, head, headTurn);
  const beakLow = rotateAround({ x: head.x - 12, y: head.y - 12 }, head, headTurn);
  const beakTip = rotateAround({ x: head.x + 62, y: head.y - 8 }, head, headTurn);
  const pouch = rotateAround({ x: head.x + 34, y: head.y - 30 }, head, headTurn);
  const tail = { x: hip.x - 48, y: hip.y + 18 + bob * 0.35 };
  const tailTip = { x: hip.x - 70, y: hip.y + 34 + bob * 0.2 };
  const wing = { x: hip.x + 36, y: hip.y + 30 + bob };
  const handle = { x: RIG.handle.x, y: RIG.handle.y };
  const wingTip = { x: handle.x - 2, y: handle.y + Math.sin(crank) * 1.2 };

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
      ankleNear,
      ankleFar,
      kneeNear,
      kneeFar,
      footNear: footOutline(ankleNear, tiltNear),
      footFar: footOutline(ankleFar, tiltFar),
      hip,
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
      handle,
      headTube: { x: RIG.headTube.x, y: RIG.headTube.y },
    },
  };
}
