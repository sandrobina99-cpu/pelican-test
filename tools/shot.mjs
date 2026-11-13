import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { chromeArgs, chromePath, parseArgs, root, startServer } from "./lib.mjs";

const args = parseArgs();
const server = await startServer();
const browser = await puppeteer.launch({
  executablePath: chromePath(),
  headless: "new",
  args: chromeArgs,
});

async function shot(page, t, file) {
  await page.evaluate((time) => window.renderAt(time), t);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({
    path: file,
    type: "png",
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
  });
  console.log(t.toFixed(3), file);
}

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  page.on("pageerror", (err) => console.error("PAGE", err.message));
  await page.goto(`${server.url}/public/index.html?export=1`, {
    waitUntil: "networkidle0",
    timeout: 120000,
  });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });

  if (args.times) {
    const dir = args.out || path.join(root, "shots");
    for (const part of String(args.times).split(",")) {
      const t = Number(part);
      const name = `t${t.toFixed(2).replace(".", "_")}.png`;
      await shot(page, t, path.join(dir, name));
    }
  } else {
    const t = Number(args.time ?? 0);
    const file = args.out || path.join(root, "shots", "frame.png");
    await shot(page, t, file);
  }
} finally {
  await browser.close();
  await server.close();
}
