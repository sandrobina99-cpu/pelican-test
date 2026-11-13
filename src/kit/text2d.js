/** Integer-pixel canvas text. Families are the vendored OFL faces. */

export const SERIF = "Pelican Serif";
export const SANS = "Pelican Sans";

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
