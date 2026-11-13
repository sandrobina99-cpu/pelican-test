import { OUT_H, OUT_W } from "../beat/world.js";

/**
 * Screen space: origin top-left, +y down, 1 unit = 1 pixel.
 * p5's default WEBGL camera is already matched to the canvas at z = 0,
 * so we only reset the model matrix. A custom ortho() here flips Y.
 */
export function enterStage(p) {
  p.resetMatrix();
  const gl = p.drawingContext;
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.depthMask(false);
  gl.depthFunc(gl.ALWAYS);
  p.translate(-OUT_W / 2, -OUT_H / 2);
}
