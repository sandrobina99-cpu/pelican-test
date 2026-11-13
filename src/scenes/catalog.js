/** Section identity, stage-1 placeholder colors, and the preview label. */

export const SECTIONS = [
  { id: 1, slug: "sahara", zh: "撒哈拉岩画", en: "Saharan Rock Art", era: "约前4000", eraEn: "c. 4000 BCE", bg: "#C4783A", road: "#8C4E22", plate: "#F3D7B0", ink: "#2A1408" },
  { id: 2, slug: "egypt", zh: "埃及壁画", en: "Egyptian Mural", era: "约前1300", eraEn: "c. 1300 BCE", bg: "#C9A15A", road: "#8E6A30", plate: "#F6E6B8", ink: "#1A2744" },
  { id: 3, slug: "han", zh: "汉画像石拓片", en: "Han Stone Rubbing", era: "约100", eraEn: "c. 100 CE", bg: "#161616", road: "#2C2C2C", plate: "#F4F1EA", ink: "#161616" },
  { id: 4, slug: "tang", zh: "唐代白描", en: "Tang Line Drawing", era: "约750", eraEn: "c. 750", bg: "#F6F1E6", road: "#D9D0C0", plate: "#FFFCF7", ink: "#1A1A1A" },
  { id: 5, slug: "song", zh: "宋代山水", en: "Song Landscape", era: "约1000", eraEn: "c. 1000", bg: "#D5D8D2", road: "#B4BAB2", plate: "#F4F7F4", ink: "#1C2A24" },
  { id: 6, slug: "qingming", zh: "清明上河图", en: "Qingming River Scene", era: "约1100", eraEn: "c. 1100", bg: "#E6D3A8", road: "#C4A574", plate: "#FBF6EA", ink: "#3A2918" },
  { id: 7, slug: "maya", zh: "玛雅抄本", en: "Maya Codex", era: "约1200", eraEn: "c. 1200", bg: "#E4C98A", road: "#C4A15A", plate: "#F8E7C0", ink: "#6E1A12" },
  { id: 8, slug: "mughal", zh: "莫卧儿细密画", en: "Mughal Miniature", era: "约1600", eraEn: "c. 1600", bg: "#F3E6C8", road: "#D4BC90", plate: "#FFF8EA", ink: "#143C2E" },
  { id: 9, slug: "bada", zh: "八大山人写意", en: "Bada Shanren", era: "约1690", eraEn: "c. 1690", bg: "#F7F4EE", road: "#E4E0D6", plate: "#FFFdf8", ink: "#111111" },
  { id: 10, slug: "wayang", zh: "爪哇皮影戏", en: "Wayang Kulit", era: "约1800", eraEn: "c. 1800", bg: "#3A1E10", road: "#2A140C", plate: "#F6E2B0", ink: "#2A140C" },
  { id: 11, slug: "ukiyo", zh: "浮世绘", en: "Ukiyo-e", era: "1830年代", eraEn: "1830s", bg: "#F3E2C8", road: "#E0C8A4", plate: "#FFF6EA", ink: "#1A3358" },
  { id: 12, slug: "starry", zh: "梵高《星月夜》", en: "The Starry Night", era: "1889", eraEn: "1889", bg: "#12215A", road: "#0C1738", plate: "#F4E7A0", ink: "#12215A" },
  { id: 13, slug: "scream", zh: "蒙克《呐喊》", en: "The Scream", era: "1893", eraEn: "1893", bg: "#E25B32", road: "#B84322", plate: "#F8E1D2", ink: "#1A0C10" },
  { id: 14, slug: "nosferatu", zh: "《诺斯费拉图》", en: "Nosferatu", era: "1922", eraEn: "1922", bg: "#C8C2B4", road: "#A39E92", plate: "#F7F3EA", ink: "#1A120C" },
  { id: 15, slug: "scope", zh: "示波器矢量图", en: "Oscilloscope Vector", era: "1950年代", eraEn: "1950s", bg: "#04140C", road: "#021008", plate: "#0C2A18", ink: "#7DFF9A" },
  { id: 16, slug: "pixel", zh: "8-bit 像素游戏", en: "8-bit Pixel Game", era: "1980年代", eraEn: "1980s", bg: "#241445", road: "#140C28", plate: "#3A2468", ink: "#FFE14A" },
  { id: 17, slug: "chat", zh: "早期聊天窗口", en: "Early Chat Window", era: "2000年代", eraEn: "2000s", bg: "#E4EAF1", road: "#C5D0DC", plate: "#FFFFFF", ink: "#1A2330" },
  { id: 18, slug: "vapor", zh: "蒸汽波", en: "Vaporwave", era: "2010年代", eraEn: "2010s", bg: "#3A2158", road: "#241238", plate: "#4A2A6A", ink: "#FFD0F0" },
  { id: 19, slug: "vertical", zh: "竖屏短视频", en: "Vertical Short Video", era: "2020年代", eraEn: "2020s", bg: "#101114", road: "#0A0A0C", plate: "#1A1C22", ink: "#FFFFFF" },
  { id: 20, slug: "code", zh: "代码美学", en: "Code Aesthetic", era: "2020年代", eraEn: "2020s", bg: "#0E1116", road: "#0A0D12", plate: "#161B22", ink: "#9AF0A8" },
];

export function eraLine(meta) {
  if (meta.era === meta.eraEn) return meta.era;
  return `${meta.era}  ·  ${meta.eraEn}`;
}

export function labelFor(info) {
  if (!info || info.kind === "intro") return "序幕";
  if (info.kind === "outro") return "新闻发布会";
  const meta = SECTIONS[info.section - 1];
  if (!meta) return "";
  return `${meta.id} ${meta.zh} · ${meta.en}`;
}
