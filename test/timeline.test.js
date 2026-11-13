import test from "node:test";
import assert from "node:assert/strict";
import {
  BAR,
  BEAT,
  INTRO_DUR,
  OUTRO_DUR,
  OUTRO_START,
  PEDAL_PERIOD,
  SECTION_COUNT,
  SECTION_DUR,
  TOTAL,
  at,
  beatInBar,
  crossingTimes,
  isDownbeat,
  isStrongBeat,
  pedalAngle,
  sectionEnd,
  sectionStart,
  worldX,
} from "../src/beat/timeline.js";
import { CUES } from "../src/beat/cues.js";
import { GRID_W, OUT_W } from "../src/beat/world.js";
import { SECTIONS } from "../src/scenes/catalog.js";

test("the film is 137 seconds at 120 BPM", () => {
  assert.equal(BEAT, 0.5);
  assert.equal(BAR, 2);
  assert.equal(INTRO_DUR, 5);
  assert.equal(SECTION_DUR, 6);
  assert.equal(SECTION_COUNT, 20);
  assert.equal(OUTRO_DUR, 12);
  assert.equal(OUTRO_START, 125);
  assert.equal(TOTAL, 137);
});

test("section k runs from 5+6(k-1) to 5+6k", () => {
  for (let k = 1; k <= 20; k++) {
    assert.equal(sectionStart(k), 5 + 6 * (k - 1));
    assert.equal(sectionEnd(k), 5 + 6 * k);
  }
  assert.equal(worldX(5), 0);
  assert.equal(worldX(11), 1000);
  assert.equal(worldX(125), 20000);
});

test("portal crossings land on beat 3, a strong beat", () => {
  const times = crossingTimes();
  assert.equal(times.length, 21);
  assert.deepEqual(times.slice(0, 3), [5, 11, 17]);
  assert.equal(times.at(-1), 125);
  for (const t of times) {
    assert.equal(beatInBar(t), 2);
    assert.equal(isStrongBeat(t), true);
    assert.equal(isDownbeat(t), false);
  }
});

test("one pedal revolution is two beats", () => {
  assert.equal(PEDAL_PERIOD, 1);
  assert.ok(Math.abs(pedalAngle(1) - Math.PI * 2) < 1e-9);
  assert.ok(Math.abs(pedalAngle(0.5) - Math.PI) < 1e-9);
});

test("bars inside a section", () => {
  assert.equal(at(0).kind, "intro");
  assert.equal(at(5).section, 1);
  assert.equal(at(5).bar, 1);
  assert.equal(at(7).bar, 2);
  assert.equal(at(9).bar, 3);
  assert.equal(at(11).section, 2);
  assert.equal(at(11).localT, 0);
  assert.equal(at(125).kind, "outro");
  assert.equal(at(137).kind, "outro");
  assert.equal(at(137).localT, 12);
});

test("captions and flashes sit on the beats named in the spec", () => {
  assert.equal(isStrongBeat(CUES.introLine1), true);
  assert.equal(isDownbeat(CUES.introLine2), true);
  assert.equal(isDownbeat(CUES.outroCaption1), true);
  assert.equal(isDownbeat(CUES.outroCaption2), true);
  for (const t of CUES.flashes) assert.equal(isStrongBeat(t), true);
  assert.equal(CUES.flypast, 136.5);
  assert.ok(CUES.flypast < TOTAL);
  assert.equal(beatInBar(CUES.flypast), 1);
});

test("the wall is about 90% of the frame and there are 20 sections", () => {
  assert.ok(Math.abs(GRID_W / OUT_W - 0.9) < 0.01);
  assert.equal(SECTIONS.length, 20);
  assert.deepEqual(SECTIONS.map((s) => s.id), Array.from({ length: 20 }, (_, i) => i + 1));
});
