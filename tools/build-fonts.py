#!/usr/bin/env python3
"""Subset Noto Sans/Serif SC into Pelican Sans/Serif and vendor Latin faces.

Source fonts are downloaded to a cache (not committed). Outputs under
public/fonts/ are OFL: the CJK faces are renamed subsets because OFL
reserved names cannot stay on a modified font. Noto Sans Mono and
Press Start 2P are copied unmodified.
"""

from __future__ import annotations

import urllib.request
from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "fonts"
CACHE = Path("/tmp/pelican-font-src")

SOURCES = {
    "serif": "https://fonts.gstatic.com/s/notoserifsc/v36/H4cyBXePl9DZ0Xe7gG9cyOj7uK2-n-D2rd4FY7RcrCWv.ttf",
    "sans400": "https://fonts.gstatic.com/s/notosanssc/v41/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYw.ttf",
    "sans700": "https://fonts.gstatic.com/s/notosanssc/v41/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaGzjCnYw.ttf",
    "mono": "https://fonts.gstatic.com/s/notosansmono/v37/BngrUXNETWXI6LwhGYvaxZikqZqK6fBq6kPvUce2oAZcdthSBUsYck4-_FNJ49o.ttf",
    "pixel": "https://fonts.gstatic.com/s/pressstart2p/v16/e3t4euO8T-267oIAQAu6jDQyK0nS.ttf",
}


def fetch(key: str) -> Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    dest = CACHE / f"{key}.ttf"
    if dest.exists() and dest.stat().st_size > 1000:
        return dest
    urllib.request.urlretrieve(SOURCES[key], dest)
    return dest


def charset() -> str:
    chunks = []
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if any(part in {"node_modules", "fonts", "vendor", "frames", "out", "tmp"} for part in path.parts):
            continue
        if path.suffix.lower() not in {".js", ".mjs", ".html", ".md", ".py", ".txt"}:
            continue
        chunks.append(path.read_text(encoding="utf-8", errors="ignore"))
    extra = "".join(chr(c) for c in range(32, 127))
    extra += "——「」『』《》（）【】、。·…～！？：；，　"
    return "".join(chunks) + extra


def rename(font: TTFont, family: str, style: str, ps: str) -> None:
    name = font["name"]
    name.names = [rec for rec in name.names if rec.nameID not in {1, 2, 3, 4, 6, 16, 17}]
    full = f"{family} {style}"

    def set_name(nid: int, value: str) -> None:
        name.setName(value, nid, 3, 1, 0x409)
        name.setName(value, nid, 1, 0, 0)

    set_name(1, family)
    set_name(2, style)
    set_name(4, full)
    set_name(6, ps)
    set_name(16, family)
    set_name(17, style)
    set_name(3, f"{ps}:OFL subset")


def subset(src: Path, dest: Path, family: str, style: str, ps: str, text: str) -> None:
    font = TTFont(src)
    options = Options()
    options.layout_features = ["*"]
    options.recommended_glyphs = True
    options.notdef_glyph = True
    options.notdef_outline = True
    options.name_IDs = ["*"]
    options.glyph_names = True
    options.hinting = False
    tool = Subsetter(options=options)
    tool.populate(text=text)
    tool.subset(font)
    rename(font, family, style, ps)
    dest.parent.mkdir(parents=True, exist_ok=True)
    font.save(dest)
    print(f"{dest.name}: {dest.stat().st_size // 1024} KB, glyphs {font['maxp'].numGlyphs}")


def main() -> None:
    text = charset()
    OUT.mkdir(parents=True, exist_ok=True)
    subset(fetch("serif"), OUT / "PelicanSerif-SemiBold.otf", "Pelican Serif", "SemiBold", "PelicanSerif-SemiBold", text)
    subset(fetch("sans400"), OUT / "PelicanSans-Regular.otf", "Pelican Sans", "Regular", "PelicanSans-Regular", text)
    subset(fetch("sans700"), OUT / "PelicanSans-Bold.otf", "Pelican Sans", "Bold", "PelicanSans-Bold", text)
    mono = fetch("mono")
    pixel = fetch("pixel")
    (OUT / "NotoSansMono-Regular.ttf").write_bytes(mono.read_bytes())
    (OUT / "PressStart2P-Regular.ttf").write_bytes(pixel.read_bytes())
    print("copied mono and Press Start 2P")


if __name__ == "__main__":
    main()
