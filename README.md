# 鹈鹕测试

一只鹈鹕骑着自行车，沿一条路穿过 20 种图画。全片 2 分 17 秒，1920×1080，由 p5.js 和 p5.brush 逐帧画出来。

现在仓库里是 **Stage 0（规格）和 Stage 1（无声骨架）**。20 个版块还是标了名字的色块，没有音乐。正式画风从下一阶段开始。

## 跑预览

需要 Node 20+、Google Chrome、ffmpeg。

```bash
npm install
npm run preview
```

打开终端里打印的地址。底部有播放 / 暂停、进度条和当前版块名。空格键播放，左右方向键每次跳一拍（0.5 秒）。画面是 `renderAt(t)`，拖动进度条会跳到那一帧，不依赖播放过的历史。

## 导出

```bash
npm test
node tools/shot.mjs --time 4 --out shots/intro.png
node tools/render.mjs --fps 30 --from 0 --to 137 --out frames/film --workers 3
node tools/encode.mjs --fps 30 --frames frames/film --out out/pelican-test-silent.mp4
node tools/sheet.mjs --frames frames/film --fps 30 --every 30 --out out/contact-sheet.png
# 接触表需要 Pillow：pip install pillow
npm run fps
```

`npm run fps` 把 t = 8–12 秒分别做成 30 fps 和 60 fps 的短片，方便以后选定帧率。Chrome 找不到时设置 `CHROME_PATH`。

## 目录

- `src/kit` 纸纹、屏幕坐标、2D 文字
- `src/beat` 节拍、时间表、世界尺寸
- `src/rig` 鹈鹕和自行车的姿势，以及两种画法
- `src/scenes` 序幕、20 个版块、结尾，一个版块一个文件
- `src/main` 镜头、调度、预览页
- `tools` 逐帧渲染、单帧截图、接触表、ffmpeg
- `briefs` `audio` 占位，下一阶段再用
- `SPEC.md` 时间、镜头、骨骼
- `docs/BRIEF.md` 完整创意简报

## 字体和依赖

中文用 OFL 字体，打进仓库，不依赖 macOS 系统字体。`Pelican Serif` / `Pelican Sans` 是 Noto Serif SC、Noto Sans SC 的子集，保留字体名已去掉。另外附上未改过的 Noto Sans Mono 和 Press Start 2P。详见 `public/fonts/README.md` 和 `THIRD_PARTY_NOTICES.md`。

p5 2.4.0（LGPL-2.1）和 p5.brush 3.0.0（MIT）。p5.brush 3 的 peer 是 p5 `^2.2`，和 2.4.0 匹配，所以没有退回 2.x 笔刷。笔刷只能画在 WebGL 上；汉字画在一张同样尺寸的 2D 层上，保证 1080p 清晰。

## 许可

代码 MIT，版权 2026 sandrobina99-cpu，见 `LICENSE`。

渲染出来的画面、接触表和预览录像归作者。这一阶段先不另写限制转载的媒体许可。

做法上参考过公开仓库 [Tunai-0511/meme67-art-history](https://github.com/Tunai-0511/meme67-art-history) 的流水线（纯函数帧、逐帧导出、接触表）。没有复制它的代码、文案、构图或画面，也没有使用它保留所有权利的影片、封面和音频。
