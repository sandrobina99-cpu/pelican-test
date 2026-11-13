/** Shared stage geometry. Timing lives in timeline.js; this file has no imports. */

export const OUT_W = 1920;
export const OUT_H = 1080;

/** Each section is painted in this square. */
export const ART = 1000;

/**
 * Resting camera: the art square's height fills the frame.
 * Width shows the square plus the road on either side.
 * 1000 * 1920/1080 = 1777.7̄ world units.
 */
export const VIEW_H = ART;
export const VIEW_W = ART * (OUT_W / OUT_H);

/** Wheel contact line, art y-down. */
export const GROUND_Y = 770;

/**
 * Local rig x (y-up, origin at the rear contact) that crosses a portal
 * when worldX equals the portal's x. Keeps the rider, not the rear hub,
 * centered in the frame at the cut.
 */
export const ANCHOR_X = 110;

/** How far ahead the camera looks between portals, in world units. */
export const LEAD = 420;

/** Peak extra zoom at a portal crossing. 0.07 = 7%. */
export const PUSH_ZOOM = 0.07;

/** Gaussian sigma (seconds) for the zoom pop, tight on the beat. */
export const PUSH_SIGMA = 0.24;

/** Wider sigma so the camera eases onto the portal before the pop. */
export const LEAD_SIGMA = 0.55;

export const PORTAL = { half: 188, top: 156, bot: 812 };

export const PLATE = { x: 210, y: 60, w: 580, h: 172 };

export const TITLE = {
  zh: { y: 82, size: 54 },
  en: { y: 148, size: 26 },
  era: { y: 186, size: 22 },
};

/**
 * Bicycle + pelican proportions in local y-up units.
 * Origin is the rear tyre's contact with the ground.
 */
export const RIG = {
  wheelR: 46,
  wheelbase: 178,
  pedalR: 20,
  femur: 58,
  tibia: 60,
  bb: { x: 84, y: 34 },
  hip: { x: 74, y: 114 },
  seat: { x: 60, y: 118 },
  headTube: { x: 150, y: 110 },
  handle: { x: 168, y: 134 },
};

/** Outro wall. 7×3, about 90% of frame width. */
export const GRID = {
  cols: 7,
  rows: 3,
  cell: 236,
  gap: 12,
  x: 98,
  y: 58,
};

export const GRID_W = GRID.cols * GRID.cell + (GRID.cols - 1) * GRID.gap;
export const GRID_H = GRID.rows * GRID.cell + (GRID.rows - 1) * GRID.gap;
