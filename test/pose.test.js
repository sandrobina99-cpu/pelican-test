import test from "node:test";
import assert from "node:assert/strict";
import { poseAt } from "../src/rig/pose.js";
import { RIG } from "../src/beat/world.js";
import { cameraAt, worldToScreen } from "../src/main/camera.js";

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

test("both legs stay on the pedals", () => {
  for (let i = 0; i < 32; i++) {
    const pose = poseAt(0, { crank: (i / 32) * Math.PI * 2 });
    const pairs = [
      [pose.points.kneeNear, pose.points.pedalNear],
      [pose.points.kneeFar, pose.points.pedalFar],
    ];
    for (const [knee, foot] of pairs) {
      assert.ok(Math.abs(dist(pose.points.hip, knee) - RIG.femur) < 0.05);
      assert.ok(Math.abs(dist(knee, foot) - RIG.tibia) < 0.05);
      assert.ok(knee.y + 0.2 >= Math.min(pose.points.hip.y, foot.y));
    }
  }
});

test("the two pedals are opposite", () => {
  const pose = poseAt(0.3);
  const { bb, pedalNear, pedalFar } = pose.points;
  const dx = pedalNear.x - bb.x + (pedalFar.x - bb.x);
  const dy = pedalNear.y - bb.y + (pedalFar.y - bb.y);
  assert.ok(Math.hypot(dx, dy) < 1e-6);
});

test("the same time always yields the same pose", () => {
  const a = poseAt(42.5);
  const b = poseAt(42.5);
  assert.equal(a.crank, b.crank);
  assert.equal(a.wheel, b.wheel);
  assert.deepEqual(a.points.kneeNear, b.points.kneeNear);
});

test("a crossing centers the portal", () => {
  const cam = cameraAt(11);
  assert.ok(Math.abs(cam.x - 1000) < 1e-6);
  assert.ok(cam.zoom > 1.06);
  const [sx, sy] = worldToScreen(1000, 500, cam);
  assert.ok(Math.abs(sx - 960) < 1);
  assert.ok(Math.abs(sy - 540) < 1);
});
