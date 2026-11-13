import { crossingTimes, worldX } from "../beat/timeline.js";
import {
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

/** Camera center in world units (y-down) plus a uniform zoom. */
export function cameraAt(t) {
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
