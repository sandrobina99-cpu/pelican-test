import { at, crossingTimes, worldX } from "../beat/timeline.js";
import { smoothstep } from "../beat/cues.js";
import { FILM } from "../config.js";
import {
  GROUND_Y,
  LEAD,
  LEAD_SIGMA,
  OUT_H,
  OUT_W,
  PUSH_SIGMA,
  PUSH_ZOOM,
  VIEW_H,
  VIEW_W,
} from "../beat/world.js";

function bell(t, sigma) {
  let peak = 0;
  for (const tc of crossingTimes()) {
    const d = (t - tc) / sigma;
    const g = Math.exp(-d * d);
    if (g > peak) peak = g;
  }
  return peak;
}

export function pushAmount(t) {
  return bell(t, PUSH_SIGMA);
}

export function leadAmount(t) {
  return bell(t, LEAD_SIGMA);
}

function standardCamera(t) {
  const zoomEnv = pushAmount(t);
  const leadEnv = leadAmount(t);
  return {
    x: worldX(t) + LEAD * (1 - leadEnv),
    y: VIEW_H / 2,
    zoom: 1 + PUSH_ZOOM * zoomEnv,
    push: zoomEnv,
    lead: leadEnv,
  };
}

function lerpCam(a, b, u) {
  return {
    x: a.x + (b.x - a.x) * u,
    y: a.y + (b.y - a.y) * u,
    zoom: a.zoom + (b.zoom - a.zoom) * u,
    push: b.push,
    lead: b.lead,
  };
}

/**
 * Song landscape: start wide enough that the rider is a speck under the peak,
 * then push in and, through the bar-2 hold, keep the frame locked on the pelican.
 */
function songCamera(t, localT, base) {
  const px = worldX(t);
  const wide = { x: 4500, y: 340, zoom: 0.4, push: base.push, lead: 0 };
  const tight = {
    x: px,
    y: GROUND_Y - 70,
    zoom: 1.58,
    push: base.push,
    lead: 0,
  };
  if (FILM.bar2FreezeCamera !== "hold-on-pelican") return base;
  if (localT < 1.5) return wide;
  if (localT < 3.15) return lerpCam(wide, tight, smoothstep((localT - 1.5) / 1.65));
  if (localT < 4.2) return tight;
  return lerpCam(tight, base, smoothstep((localT - 4.2) / 1.2));
}

/** Vertical video: keep the rider inside the centered 9:16 column. */
function verticalCamera(t, base) {
  return { ...base, x: worldX(t) + 140 * (1 - base.lead), lead: base.lead };
}

/** Camera center in world units (y-down) plus a uniform zoom. */
export function cameraAt(t) {
  const base = standardCamera(t);
  const info = at(t);
  if (info.kind === "section" && info.section === 5) return songCamera(t, info.localT, base);
  if (info.kind === "section" && info.section === 19) return verticalCamera(t, base);
  return base;
}

export function viewSize(cam) {
  return { w: VIEW_W / cam.zoom, h: VIEW_H / cam.zoom };
}

export function pxPerUnit(cam) {
  return (OUT_H / VIEW_H) * cam.zoom;
}

/** World y-down point → screen pixels, origin top-left. */
export function worldToScreen(wx, wy, cam) {
  const { w, h } = viewSize(cam);
  return [
    ((wx - cam.x) / w) * OUT_W + OUT_W / 2,
    ((wy - cam.y) / h) * OUT_H + OUT_H / 2,
  ];
}
