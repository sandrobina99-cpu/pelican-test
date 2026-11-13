import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

function run(script, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(here, script), ...args], { stdio: "inherit" });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`))));
  });
}

// Same pan-heavy window: section 1's ride into the portal at t = 11.
const from = "8";
const to = "12";

await run("render.mjs", ["--fps", "30", "--from", from, "--to", to, "--out", "frames/pan30", "--workers", "3"]);
await run("encode.mjs", ["--fps", "30", "--frames", "frames/pan30", "--out", "out/pan-30fps.mp4", "--preset", "veryfast"]);
await run("render.mjs", ["--fps", "60", "--from", from, "--to", to, "--out", "frames/pan60", "--workers", "3"]);
await run("encode.mjs", ["--fps", "60", "--frames", "frames/pan60", "--out", "out/pan-60fps.mp4", "--preset", "veryfast"]);
