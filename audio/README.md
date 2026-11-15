# 音频

Stage 1 没有声音。

正式配乐全部程序合成，不用外部采样。规格见 `docs/BRIEF.md` 的音乐一节和 `SPEC.md`。成片阶段再用 OfflineAudioContext 导出 WAV，由 ffmpeg 和画面合成。
