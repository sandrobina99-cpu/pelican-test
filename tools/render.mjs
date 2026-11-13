import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { chromeArgs, chromePath, parseArgs, root, startServer } from "./lib.mjs";

const args = parseArgs();
const fps = Number(args.fps ?? 30);
const from = Number(args.from ?? 0);
const to = Number(args.to ?? 137);
const workers = Math.max(1, Number(args.workers ?? 3));
const outDir = path.resolve(root, args.out || "frames/film");
const count = Math.round((to - from) * fps);

if (!Number.isFinite(count) || count <= 0) {
  throw new Error(`empty range ${from}..${to} at ${fps} fps`);
}

fs.mkdirSync(outDir, { recursive: true });
const server = await startServer();
const browser = await puppeteer.launch({
  executablePath: chromePath(),
  headless: "new",
  protocolTimeout: 180000,
  args: chromeArgs,
});

async function makePage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  page.on("pageerror", (err) => console.error("PAGE", err.message));
  const pagePath = args.page || "/public/index.html?export=1";
  await page.goto(`${server.url}${pagePath}`, {
    waitUntil: "networkidle0",
    timeout: 120000,
  });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });
  return page;
}

async function renderIndex(page, index) {
  const t = from + index / fps;
  const file = path.join(outDir, `f${String(index).padStart(5, "0")}.png`);
  if (fs.existsSync(file) && fs.statSync(file).size > 1000) return false;
  const dataUrl = await page.evaluate((time) => {
    // Draw twice so the read sees this time, not the previous frame's buffer.
    window.renderAt(time);
    window.renderAt(time);
    const out = document.createElement("canvas");
    out.width = 1920;
    out.height = 1080;
    const ctx = out.getContext("2d");
    const gl = document.querySelector("#gl") || document.querySelector("canvas");
    ctx.drawImage(gl, 0, 0);
    const text = document.querySelector("#text");
    if (text) ctx.drawImage(text, 0, 0);
    return out.toDataURL("image/png");
  }, t);
  const payload = dataUrl.split(",")[1];
  fs.writeFileSync(file, Buffer.from(payload, "base64"));
  return true;
}

try {
  const pages = [];
  for (let i = 0; i < workers; i++) pages.push(await makePage());
  let cursor = 0;
  let done = 0;
  const started = Date.now();

  async function run(page) {
    for (;;) {
      const index = cursor;
      cursor += 1;
      if (index >= count) return;
      let wrote = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          wrote = await renderIndex(page, index);
          break;
        } catch (err) {
          console.error(`frame ${index} attempt ${attempt} failed: ${err.message}`);
          if (attempt === 2) throw err;
        }
      }
      if (wrote) done += 1;
      else done += 1;
      if (done % 50 === 0 || done === count) {
        const sec = (Date.now() - started) / 1000;
        console.log(`${done}/${count}  ${(done / sec).toFixed(2)} fps`);
      }
    }
  }

  await Promise.all(pages.map((page) => run(page)));
  console.log(`wrote ${count} frames to ${outDir}`);
} finally {
  await browser.close();
  await server.close();
}
