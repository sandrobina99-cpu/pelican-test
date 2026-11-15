/** Integer-pixel canvas text. Families are the vendored OFL faces. */

export const SERIF = "Pelican Serif";
export const SANS = "Pelican Sans";
export const PIXEL = "Pelican Pixel";

const pixelCache = new Map();

/** Crisp integer scale of the 12px pixel face. */
export function pixelText(ctx, str, x, y, px, align = "left") {
  const scale = Math.max(2, Math.round(px / 12));
  const color = ctx.fillStyle || "#111";
  const key = `${str}|${color}|${scale}`;
  let sprite = pixelCache.get(key);
  if (!sprite) {
    const probe = document.createElement("canvas").getContext("2d");
    probe.font = `12px "${PIXEL}"`;
    const w = Math.max(4, Math.ceil(probe.measureText(str).width) + 2);
    const src = document.createElement("canvas");
    src.width = w;
    src.height = 16;
    const sctx = src.getContext("2d");
    sctx.font = `12px "${PIXEL}"`;
    sctx.fillStyle = color;
    sctx.textBaseline = "top";
    sctx.fillText(str, 1, 1);
    sprite = document.createElement("canvas");
    sprite.width = w * scale;
    sprite.height = 16 * scale;
    const bctx = sprite.getContext("2d");
    bctx.imageSmoothingEnabled = false;
    bctx.drawImage(src, 0, 0, sprite.width, sprite.height);
    pixelCache.set(key, sprite);
  }
  const dx = align === "center" ? Math.round(x - sprite.width / 2) : Math.round(x);
  const prev = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sprite, dx, Math.round(y));
  ctx.imageSmoothingEnabled = prev;
}

export function setFont(ctx, family, px, weight = 400) {
  const size = Math.max(10, Math.round(px));
  ctx.font = `${weight} ${size}px "${family}", "Noto Sans SC", sans-serif`;
  return size;
}

export function text(ctx, str, x, y) {
  ctx.fillText(str, Math.round(x), Math.round(y));
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}
