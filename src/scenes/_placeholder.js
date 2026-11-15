import { GROUND_Y, PLATE } from "../beat/world.js";

/** Stage-1 stand-in: a flat field, a road band, and a title plate. */
export function mount(meta) {
  return {
    meta,
    draw(p, ctx) {
      const gag = ctx.gag || 0;
      p.noStroke();
      p.fill(meta.bg);
      p.rect(-4, -4, 1008, GROUND_Y + 8);
      p.fill(meta.road);
      p.rect(-4, GROUND_Y, 1008, 1000 - GROUND_Y + 8);
      p.stroke(meta.ink);
      p.strokeWeight(3);
      p.fill(meta.plate);
      p.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
      if (gag > 0.04) {
        p.noStroke();
        p.fill(255, 255, 255, 22 * gag);
        p.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
      }
    },
  };
}
