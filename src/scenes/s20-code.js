import { worldToScreen } from "../main/camera.js";
import { setFont, text } from "../kit/text2d.js";
import { SECTIONS } from "./catalog.js";

const meta = SECTIONS[19];

const LINES = [
  "function drawAnswer(t) {",
  "  const frame = rideFrame(t);",
  "  circle(rear, 46);",
  "  circle(front, R);",
  "  line(rear, bracket, bar);",
  "  const R = 46;",
  "  fillBody(frame);",
  "  beak(frame);",
  "  return frame;",
  "}",
];

/** Our own editor. The drawing on the right appears in step with these lines. */
export default {
  meta,
  draw(p) {
    p.noStroke();
    p.fill("#0E1116");
    p.rect(-8, -8, 1016, 1016);
    p.fill("#12171E");
    p.rect(0, 0, 46, 1000);
    for (let i = 0; i < 28; i++) {
      p.fill(i % 2 ? "#10151C" : "#0E1116");
      p.rect(46, 70 + i * 28, 430, 28);
    }
  },
  overlay(ctx, { cam, localT }) {
    const blink = localT > 2.05 && localT < 2.55;
    const shown = Math.min(LINES.length, Math.floor((localT / 6) * LINES.length) + 1);
    const [x, y] = worldToScreen(19000 + 64, 280, cam);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    for (let i = 0; i < shown; i++) {
      let line = LINES[i];
      if (blink && line.startsWith("  const R")) line = "  const R = 80;";
      const comment = line.trim().startsWith("//");
      ctx.fillStyle = comment ? "#6A8F72" : "#C8E6C4";
      if (line.includes("circle") || line.includes("line(") || line.includes("fill") || line.includes("beak")) {
        ctx.fillStyle = "#9AF0A8";
      }
      setFont(ctx, "Noto Sans Mono", 18, 400);
      text(ctx, line, x, y + i * 28);
      if (blink && line.startsWith("  const R")) {
        ctx.fillStyle = "#9AF0A8";
        text(ctx, "▍", x + line.length * 10, y + i * 28);
      }
    }
  },
};
