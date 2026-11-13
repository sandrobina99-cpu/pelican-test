/**
 * 120 BPM clock for 《鹈鹕测试》.
 * 1 beat = 0.5 s, 1 bar = 2 s (4/4).
 * Musical bar 0 starts at t = 0. Beat-in-bar 0 is the downbeat.
 * Section boundaries fall on beat-in-bar 2 (the second strong beat),
 * because Intro is 2.5 bars and every section is 3 bars. See SPEC.md.
 */

import { ART } from "./world.js";

export const BPM = 120;
export const BEAT = 60 / BPM;
export const BAR = BEAT * 4;
export const INTRO_DUR = 2.5 * BAR;
export const SECTION_DUR = 3 * BAR;
export const SECTION_COUNT = 20;
export const OUTRO_DUR = 6 * BAR;
export const OUTRO_START = INTRO_DUR + SECTION_COUNT * SECTION_DUR;
export const TOTAL = OUTRO_START + OUTRO_DUR;

/** One pedal revolution. Two beats. */
export const PEDAL_PERIOD = 2 * BEAT;

export const SECTION_W = ART;

export function sectionStart(k) {
  return INTRO_DUR + SECTION_DUR * (k - 1);
}

export function sectionEnd(k) {
  return INTRO_DUR + SECTION_DUR * k;
}

/** Portal times: entering sections 1–20, then the exit into the outro. */
export function crossingTimes() {
  const times = [];
  for (let k = 1; k <= SECTION_COUNT; k++) times.push(sectionStart(k));
  times.push(OUTRO_START);
  return times;
}

/**
 * Forward position of the rider's anchor.
 * Section k = 1 occupies world x in [0, SECTION_W).
 * Constant cruise in stage 1 (motionScale is 1). Later gags may
 * integrate a per-section scale; keep this the single source of x(t).
 */
export function motionScale(_sectionId, _localT) {
  return 1;
}

export function worldX(t) {
  return (t - INTRO_DUR) * (SECTION_W / SECTION_DUR);
}

/** Radians, increasing. One full turn every PEDAL_PERIOD. */
export function pedalAngle(t) {
  return (t / PEDAL_PERIOD) * Math.PI * 2;
}

/**
 * 0 = downbeat (beat 1), 1 = beat 2, 2 = beat 3 (also strong), 3 = beat 4.
 * Returns the phase of the beat that contains t, not a rounded nearest beat.
 */
export function beatInBar(t) {
  const index = Math.floor(t / BEAT + 1e-9);
  return ((index % 4) + 4) % 4;
}

export function isDownbeat(t, eps = 1e-6) {
  const q = t / BEAT;
  const nearest = Math.round(q);
  return Math.abs(q - nearest) <= eps && ((nearest % 4) + 4) % 4 === 0;
}

export function isStrongBeat(t, eps = 1e-6) {
  const q = t / BEAT;
  const nearest = Math.round(q);
  if (Math.abs(q - nearest) > eps) return false;
  const phase = ((nearest % 4) + 4) % 4;
  return phase === 0 || phase === 2;
}

/**
 * Bar 2 of a section (local 2..4 s). 0 at the edges, 1 at the midpoint.
 * Stage 1 uses this only as a title-card pulse. Speed stays at 1.
 */
export function gagEnergy(localT) {
  if (localT < 2 || localT > 4) return 0;
  return Math.sin(((localT - 2) / 2) * Math.PI);
}

export function at(t) {
  const tt = Math.min(TOTAL, Math.max(0, t));
  const beat = beatInBar(tt);
  if (tt < INTRO_DUR) {
    return {
      kind: "intro",
      section: 0,
      localT: tt,
      bar: Math.min(3, Math.floor(tt / BAR) + 1),
      beat,
      t: tt,
    };
  }
  if (tt >= OUTRO_START) {
    const localT = tt - OUTRO_START;
    return {
      kind: "outro",
      section: 21,
      localT,
      bar: Math.min(6, Math.floor(localT / BAR) + 1),
      beat,
      t: tt,
    };
  }
  const k = Math.floor((tt - INTRO_DUR) / SECTION_DUR) + 1;
  const localT = tt - sectionStart(k);
  return {
    kind: "section",
    section: k,
    localT,
    bar: Math.min(3, Math.floor(localT / BAR) + 1),
    beat,
    t: tt,
  };
}
