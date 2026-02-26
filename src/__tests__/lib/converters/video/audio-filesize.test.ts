import { describe, expect, it } from "vitest";
import { calculateAudioFilesize } from "@/lib/converters/video/audio-filesize";

describe("calculateAudioFilesize", () => {
  it("returns null for zero duration", () => {
    expect(calculateAudioFilesize(0, "mp3")).toBeNull();
  });

  it("calculates mp3 typical size for 180s", () => {
    // 256kbps typical × 180s / 8 / 1024 / 1024 ≈ 5.5MB
    const result = calculateAudioFilesize(180, "mp3");
    expect(result).not.toBeNull();
    expect(result?.estimatedMB).toBeGreaterThan(0);
  });

  it("higher bitrate format gives larger file", () => {
    const mp3 = calculateAudioFilesize(180, "mp3", "typical");
    const wav = calculateAudioFilesize(180, "wav", "typical");
    expect(mp3).not.toBeNull();
    expect(wav).not.toBeNull();
    expect(wav?.estimatedBytes ?? 0).toBeGreaterThan(mp3?.estimatedBytes ?? 0);
  });

  it("high quality gives larger file than low quality", () => {
    const low = calculateAudioFilesize(180, "mp3", "low");
    const high = calculateAudioFilesize(180, "mp3", "high");
    expect(low).not.toBeNull();
    expect(high).not.toBeNull();
    expect(high?.estimatedBytes ?? 0).toBeGreaterThan(low?.estimatedBytes ?? 0);
  });

  it("returns formatted string", () => {
    const result = calculateAudioFilesize(180, "mp3");
    expect(result?.formatted).toMatch(/MB|GB/);
  });

  it("duration field matches input", () => {
    const result = calculateAudioFilesize(180, "mp3");
    expect(result?.duration).toBe(180);
  });
});
