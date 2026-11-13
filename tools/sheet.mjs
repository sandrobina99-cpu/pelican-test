import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { at } from "../src/beat/timeline.js";
import { SECTIONS } from "../src/scenes/catalog.js";
import { parseArgs, root } from "./lib.mjs";

const args = parseArgs();
const fps = Number(args.fps ?? 30);
const every = Number(args.every ?? fps);
const framesDir = path.resolve(root, args.frames || "frames/film");
const out = path.resolve(root, args.out || "out/contact-sheet.png");
const files = fs.readdirSync(framesDir).filter((name) => /^f\d+\.png$/.test(name)).sort();
if (!files.length) throw new Error(`no frames in ${framesDir}`);

const picks = [];
for (let i = 0; i < files.length; i += every) picks.push(i);
if (picks.at(-1) !== files.length - 1) picks.push(files.length - 1);

const cells = picks.map((index) => {
  const t = index / fps;
  const info = at(t);
  const m = Math.floor(t / 60);
  const s = (t - m * 60).toFixed(1).padStart(4, "0");
  let name = "序幕";
  if (info.kind === "outro") name = "新闻发布会";
  else if (info.kind === "section") name = SECTIONS[info.section - 1].zh;
  return { file: files[index], label: `${m}:${s}  ${name}` };
});

const py = String.raw`
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
cells = json.loads(Path(sys.argv[1]).read_text())
src = Path(sys.argv[2])
font_path = sys.argv[3]
out = Path(sys.argv[4])
font = ImageFont.truetype(font_path, 16)
cols = 8
thumb_w, thumb_h = 320, 180
cap_h = 26
gap = 12
pad = 16
rows = (len(cells) + cols - 1) // cols
W = pad * 2 + cols * thumb_w + (cols - 1) * gap
H = pad * 2 + rows * (thumb_h + cap_h) + (rows - 1) * gap
sheet = Image.new("RGB", (W, H), (20, 17, 14))
draw = ImageDraw.Draw(sheet)
for i, cell in enumerate(cells):
    r, c = divmod(i, cols)
    x = pad + c * (thumb_w + gap)
    y = pad + r * (thumb_h + cap_h + gap)
    im = Image.open(src / cell["file"]).convert("RGB").resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
    sheet.paste(im, (x, y))
    draw.text((x + 2, y + thumb_h + 4), cell["label"], font=font, fill=(244, 239, 230))
out.parent.mkdir(parents=True, exist_ok=True)
sheet.save(out, optimize=True)
print(out, sheet.size, "cells", len(cells))
`;

const indexPath = path.join(root, "tmp", "sheet-index.json");
fs.mkdirSync(path.dirname(indexPath), { recursive: true });
fs.writeFileSync(indexPath, JSON.stringify(cells));
const script = path.join(root, "tmp", "sheet.py");
fs.writeFileSync(script, py);
const result = spawnSync("python3", [
  script,
  indexPath,
  framesDir,
  path.join(root, "public/fonts/PelicanSans-Bold.otf"),
  out,
], { encoding: "utf8" });
if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  throw new Error("contact sheet needs Pillow (pip install pillow)");
}
console.log(result.stdout.trim());
