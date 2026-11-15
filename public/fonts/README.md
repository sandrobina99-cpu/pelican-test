# Fonts

These files are shipped with the repo so a Linux render matches a preview elsewhere. No macOS system fonts are used.

| File | Family in CSS | What it is |
|---|---|---|
| `PelicanSerif-SemiBold.otf` | Pelican Serif | Subset of Noto Serif SC SemiBold. Copyright (c) 2017-2024 Adobe. |
| `PelicanSans-Regular.otf` | Pelican Sans | Subset of Noto Sans SC Regular. Copyright (c) 2014-2021 Adobe, Reserved Font Name "Source". |
| `PelicanSans-Bold.otf` | Pelican Sans | Subset of Noto Sans SC Bold. Same copyright. |
| `NotoSansMono-Regular.ttf` | Noto Sans Mono | Unmodified. Copyright 2022 The Noto Project Authors. |
| `PressStart2P-Regular.ttf` | Press Start 2P | Unmodified. Copyright 2012 The Press Start 2P Project Authors. Reserved Font Name "Press Start 2P". |
| `PelicanPixel-12.ttf` | Pelican Pixel | Subset of Fusion Pixel 12px Mono zh-Hans (TakWolf, OFL, 2026.11.10). No Reserved Font Name. Renamed because it is a subset. 8-bit Chinese uses this face. |

The Pelican faces are subsets, so the OFL reserved names (Noto, Source) are not used as the font family. License text: `OFL-1.1.txt`.

Rebuild subsets after adding on-screen copy:

```bash
python3 tools/build-fonts.py
```

Press Start 2P has no Chinese glyphs. Latin pixel lettering such as `1UP` can use it. Chinese in the 8-bit section uses Pelican Pixel. Rebuild that subset with `python3 tools/build-fonts.py` after editing `src/scenes/s16-pixel.js`.
