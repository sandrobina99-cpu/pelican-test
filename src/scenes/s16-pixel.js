import { mount } from "./_placeholder.js";
import { SECTIONS } from "./catalog.js";

/**
 * Chinese for this section is Pelican Pixel, a subset of Fusion Pixel.
 * The picture itself is still a placeholder until the last batch.
 */
export const PIXEL_COPY = [
  "8-bit 像素游戏",
  "1980年代",
  "1980s",
  "第1关",
  "金币",
  "得分",
  "暂停",
  "鹈鹕",
  "继续骑",
];

const scene = mount({ ...SECTIONS[15], titleFace: "pixel" });
export default scene;
