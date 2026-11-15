import { mulberry32 } from "./rng.js";

const plates = new Map();

/** Draw a still plate once. The buffer stays; later frames only blit it. */
export function bake(p, key, w, h, draw) {
  let g = plates.get(key);
  if (g) return g;
  g = p.createGraphics(w, h);
  g.pixelDensity(1);
  draw(g);
  plates.set(key, g);
  return g;
}

export function grain(g, x, y, w, h, seed, rgba, count) {
  const rnd = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    const px = x + rnd() * w;
    const py = y + rnd() * h;
    g.stroke(rgba[0], rgba[1], rgba[2], rgba[3]);
    g.strokeWeight(rnd() < 0.16 ? 1.15 : 0.45);
    const len = 5 + rnd() * 14;
    g.line(px, py, px + len, py + (rnd() - 0.5) * 2.2);
  }
}

export function insidePoly(poly, x, y) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

export function polySpans(poly, y) {
  const xs = [];
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi <= y && yj > y) || (yj <= y && yi > y)) {
      xs.push(xi + ((y - yi) / (yj - yi)) * (xj - xi));
    }
  }
  xs.sort((a, b) => a - b);
  const spans = [];
  for (let i = 0; i + 1 < xs.length; i += 2) spans.push([xs[i], xs[i + 1]]);
  return spans;
}
