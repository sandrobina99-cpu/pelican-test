/**
 * On-screen event times. Numbers are the contract in SPEC.md.
 * Caption "land" times are when opacity reaches 1.
 */

export const CUES = {
  introSketch: 0.35,
  introLine1: 1.0,
  introLine2: 4.0,
  introSource: 4.0,
  /** Paper starts opening onto the road. */
  introReveal: 4.05,
  introRevealEnd: 4.9,
  /** Captions leave before the portal cut. */
  introCaptionOut: 4.55,
  introCaptionGone: 4.92,

  outroPullEnd: 126.15,
  outroCaption1: 126.0,
  outroCaption1Out: 127.15,
  outroCaption1Gone: 127.45,
  outroPushStart: 127.4,
  outroPushEnd: 132.0,
  outroCaption2: 134.0,
  flashes: [128, 129, 130, 131],
  /** Last beat onset inside the 137 s film. */
  flypast: 136.5,
  flypastHalf: 0.22,
};

export function smoothstep(u) {
  const x = Math.min(1, Math.max(0, u));
  return x * x * (3 - 2 * x);
}

/** 0 before t0, 1 after t1, smooth between. */
export function ramp(t, t0, t1) {
  if (t1 === t0) return t >= t1 ? 1 : 0;
  return smoothstep((t - t0) / (t1 - t0));
}
