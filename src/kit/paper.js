import { mulberry32 } from "./rng.js";

/**
 * Intro paper, drawn in the current screen space (origin top-left).
 * Rebuilt every frame from a fixed seed so nothing calls readPixels.
 * A few p5.brush strokes sit in the margins when the page is still opaque.
 */
export function drawPaper(p, alpha) {
  const a = Math.max(0, Math.min(1, alpha));
  if (a <= 0) return;
  const inkA = Math.round(255 * a);

  p.push();
  p.noStroke();
  p.fill(243, 234, 215, inkA);
  p.rect(0, 0, 1920, 1080);

  const rnd = mulberry32(20260313);
  p.stroke(92, 70, 46, Math.max(1, Math.round(34 * a)));
  for (let i = 0; i < 2800; i++) {
    const x = rnd() * 1920;
    const y = rnd() * 1080;
    p.strokeWeight(rnd() < 0.18 ? 1.25 : 0.55);
    const len = 8 + rnd() * 18;
    p.line(x, y, x + len, y + (rnd() - 0.5) * 2.2);
  }

  if (a > 0.92) {
    const brush = globalThis.brush;
    if (brush) {
      try {
        p.randomSeed(11);
        p.noiseSeed(29);
        brush.scaleBrushes(1.35);
        brush.set("HB", "#6a5646", 0.85);
        brush.line(80, 70, 340, 96);
        brush.line(70, 98, 300, 112);
        brush.set("2B", "#3e3228", 1.05);
        brush.line(1460, 120, 1820, 86);
        brush.line(1500, 148, 1780, 156);
      } catch (err) {
        console.warn("p5.brush paper strokes skipped", err);
      }
    }
  }

  p.pop();
}
