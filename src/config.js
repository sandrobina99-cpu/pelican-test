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
  if (sectionId === 5) {
    if (localT < 2) return 1.2;
    if (localT < 4) return 0.15;
    return 1.65;
  }
  // Egypt bar 2 nearly freezes into the mural stride. The other two bars
  // speed up so the next frame is still met on the beat: 3 + 0.1 + 2.9 = 6.
  if (sectionId === 2) {
    if (localT < 2) return 1.5;
    if (localT < 4) return 0.05;
    return 1.45;
  }
  return 1;
}

/** How the shared skeleton is drawn while the rider is inside a section. */
export function styleForSection(id) {
  if (id === 1) return "rock";
  if (id === 2) return "egypt";
  if (id === 3) return "rubbing";
  if (id === 4) return "tang";
  if (id === 5) return "ink";
  if (id === 6) return "qingming";
  if (id === 7) return "maya";
  if (id === 8) return "mughal";
  if (id === 9) return "bada";
  if (id === 10) return "wayang";
  if (id === 11) return "ukiyo";
  if (id === 12) return "starry";
  if (id === 13) return "scream";
  if (id === 14) return "shadow";
  if (id === 15) return "scope";
  if (id === 16) return "pixel";
  if (id === 17) return "chat";
  if (id === 18) return "vapor";
  if (id === 20) return "code";
  return "default";
}
