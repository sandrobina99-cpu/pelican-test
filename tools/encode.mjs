import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parseArgs, root } from "./lib.mjs";

const args = parseArgs();
const fps = String(args.fps ?? 30);
const frames = path.resolve(root, args.frames || "frames/film");
const out = path.resolve(root, args.out || "out/pelican-test-silent.mp4");
const crf = String(args.crf ?? 18);
const preset = String(args.preset ?? "medium");

fs.mkdirSync(path.dirname(out), { recursive: true });

await new Promise((resolve, reject) => {
  const ff = spawn("ffmpeg", [
    "-y",
    "-framerate", fps,
    "-start_number", "0",
    "-i", path.join(frames, "f%05d.png"),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", crf,
    "-preset", preset,
    "-movflags", "+faststart",
    "-an",
    out,
  ], { stdio: "inherit" });
  ff.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
});
console.log(out);
