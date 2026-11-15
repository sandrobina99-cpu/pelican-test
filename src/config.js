/**
 * Knobs the later stages should change here, not in the scene files.
 * Intro stays 2.5 bars, so every picture-frame crossing stays on beat 3.
 * Final picture is 60 fps. Bar 2 freezes hold the camera on the pelican.
 */

export const FILM = {
  renderFps: 60,
  introBars: 2.5,
  sectionBars: 3,
  outroBars: 6,
  /** "hold-on-pelican" keeps the framing locked to the rider through a bar-2 freeze. */
  bar2FreezeCamera: "hold-on-pelican",
};

/**
 * Travel speed relative to cruise. The integral from 0 to 6 seconds
 * must equal 6, so the rider still meets the next frame on the beat.
 * Section 5 (Song) eases off in bar 2 while the camera finds the pelican.
 */
export function motionScale(sectionId, localT) {
  if (sectionId !== 5) return 1;
  if (localT < 2) return 1.2;
  if (localT < 4) return 0.15;
  return 1.65;
}

/** How the shared skeleton is drawn while the rider is inside a section. */
export function styleForSection(id) {
  if (id === 1) return "rock";
  if (id === 5) return "ink";
  return "default";
}
