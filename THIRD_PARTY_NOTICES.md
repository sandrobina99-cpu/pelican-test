# Third-party notices

No source from [Tunai-0511/meme67-art-history](https://github.com/Tunai-0511/meme67-art-history) is copied into this repository. That project's video, cover, rendered frames, and audio are all rights reserved and are not used or adapted. Its MIT license would be reproduced here if any of its code were reused; none was.

## Libraries

- **p5.js 2.4.0** — LGPL-2.1 — https://p5js.org — https://github.com/processing/p5.js/tree/v2.4.0
  Vendored as `public/vendor/p5.min.js`. The license text is `public/vendor/p5-LICENSE.txt`. The unminified source ships in the upstream package and repository; this vendored file can be replaced with another build of the same library.
- **p5.brush 3.0.0** — MIT — Copyright (c) 2023-2026 Alejandro Campos Uribe — https://github.com/acamposuribe/p5.brush
  Vendored as `public/vendor/p5.brush.js`. License text: `public/vendor/p5.brush-LICENSE.md`.
  npm peer dependency is `p5@^2.2`. p5 2.4.0 satisfies it. The 3.0.0 build draws on a WebGL canvas; this project keeps that canvas and composites a 2D text layer on top.
- **puppeteer-core 24.15.0** — Apache-2.0 — https://github.com/puppeteer/puppeteer
  Installed from npm, not vendored. Used only to capture frames.
- **ffmpeg** — not bundled. The encode step calls a system ffmpeg (LGPL/GPL build, depending on how it was compiled).

## Fonts

SIL Open Font License 1.1. Full text: `public/fonts/OFL-1.1.txt`. Credits: `public/fonts/README.md`.

- **Pelican Serif SemiBold** — subset of Noto Serif SC SemiBold. Copyright (c) 2017-2024 Adobe. Reserved Font Names removed because the font is subsetted.
- **Pelican Sans Regular / Bold** — subsets of Noto Sans SC. Copyright (c) 2014-2021 Adobe, with Reserved Font Name "Source". Distributed here under new family names, not under "Noto" or "Source".
- **Noto Sans Mono Regular** — Copyright 2022 The Noto Project Authors. Copied unmodified.
- **Press Start 2P** — Copyright 2012 The Press Start 2P Project Authors (cody@zone38.net), with Reserved Font Name "Press Start 2P". Copied unmodified.

No macOS system fonts are used.
