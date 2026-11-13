import test from "node:test";
import assert from "node:assert/strict";
import { poseAt, solveKnee, KNEE_POLE } from "../src/rig/pose.js";
import { RIG } from "../src/beat/world.js";
import { cameraAt, worldToScreen } from "../src/main/camera.js";

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function bendSide(hip, foot, knee) {
  const dx = foot.x - hip.x;
  const dy = foot.y - hip.y;
  return dx * (knee.y - hip.y) - dy * (knee.x - hip.x);
}

test("both knees stay on the handlebar side and the feet stay on the pedals", () => {
  let maxExt = 0;
  let minExt = 1;
  let maxKnee = -Infinity;
  let side = 0;
  for (let i = 0; i < 32; i++) {
    const pose = poseAt(0, { crank: (i / 32) * Math.PI * 2 });
    const { hip, seat } = pose.points;
    assert.deepEqual(hip, { x: RIG.hip.x, y: RIG.hip.y });
    assert.deepEqual(seat, hip);
    const pairs = [
      [pose.points.kneeNear, pose.points.ankleNear, pose.points.pedalNear],
      [pose.points.kneeFar, pose.points.ankleFar, pose.points.pedalFar],
    ];
    for (const [knee, ankle, pedal] of pairs) {
      assert.deepEqual(ankle, pedal);
      assert.ok(Math.abs(dist(hip, knee) - RIG.femur) < 0.05);
      assert.ok(Math.abs(dist(knee, ankle) - RIG.tibia) < 0.05);
      const ext = dist(hip, ankle) / (RIG.femur + RIG.tibia);
      maxExt = Math.max(maxExt, ext);
      minExt = Math.min(minExt, ext);
      maxKnee = Math.max(maxKnee, knee.y);
      const s = Math.sign(bendSide(hip, ankle, knee));
      if (!side) side = s;
      assert.equal(s, side);
      assert.equal(s, Math.sign(bendSide(hip, ankle, solveKnee(hip, ankle, RIG.femur, RIG.tibia, KNEE_POLE))));
    }
  }
  assert.ok(maxExt > 0.9 && maxExt < 0.95, `farthest extension ${maxExt}`);
  assert.ok(maxKnee < RIG.hip.y - 12, `knee rose to ${maxKnee}`);
});

test("the two pedals are opposite and the crank matches the chainring circle", () => {
  const pose = poseAt(0.3);
  const { bb, pedalNear, pedalFar } = pose.points;
  const dx = pedalNear.x - bb.x + (pedalFar.x - bb.x);
  const dy = pedalNear.y - bb.y + (pedalFar.y - bb.y);
  assert.ok(Math.hypot(dx, dy) < 1e-6);
  assert.ok(Math.abs(dist(bb, pedalNear) - RIG.pedalR) < 1e-6);
  assert.ok(RIG.pedalR > RIG.chainringR);
});

test("the same time always yields the same pose", () => {
  const a = poseAt(42.5);
  const b = poseAt(42.5);
  assert.equal(a.crank, b.crank);
  assert.equal(a.wheel, b.wheel);
  assert.deepEqual(a.points.kneeNear, b.points.kneeNear);
  assert.deepEqual(a.points.ankleNear, a.points.pedalNear);
});

test("a crossing centers the portal", () => {
  const cam = cameraAt(11);
  assert.ok(Math.abs(cam.x - 1000) < 1e-6);
  assert.ok(cam.zoom > 1.06);
  const [sx, sy] = worldToScreen(1000, 500, cam);
  assert.ok(Math.abs(sx - 960) < 1);
  assert.ok(Math.abs(sy - 540) < 1);
});
