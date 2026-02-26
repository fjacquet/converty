import { describe, expect, it } from "vitest";
import {
  bpmFromMs,
  calculateBPM,
  getTempoMarking,
  TEMPO_MARKINGS,
} from "@/lib/converters/music/bpm";

describe("calculateBPM", () => {
  it("returns null for bpm <= 0", () => {
    expect(calculateBPM(0)).toBeNull();
    expect(calculateBPM(-10)).toBeNull();
  });

  it("returns null for bpm > 1000", () => {
    expect(calculateBPM(1001)).toBeNull();
  });

  it("calculates 120bpm: msPerBeat = 500", () => {
    const result = calculateBPM(120);
    expect(result).not.toBeNull();
    expect(result?.msPerBeat).toBeCloseTo(500, 1);
  });

  it("calculates hz = bpm/60 for 120bpm → 2.0Hz", () => {
    const result = calculateBPM(120);
    expect(result?.hz).toBeCloseTo(2.0, 2);
  });

  it("barLength4_4 = 4 × msPerBeat for 120bpm", () => {
    const result = calculateBPM(120);
    expect(result?.barLength4_4).toBeCloseTo(2000, 1);
  });

  it("quarter note duration = msPerBeat", () => {
    const result = calculateBPM(120);
    const quarter = result?.noteValues.find((n) => n.symbol === "1/4");
    expect(quarter?.durationMs).toBeCloseTo(500, 1);
  });

  it("includes 11 note values", () => {
    const result = calculateBPM(120);
    expect(result?.noteValues).toHaveLength(11);
  });
});

describe("bpmFromMs", () => {
  it("converts 500ms per beat to 120 bpm", () => {
    expect(bpmFromMs(500)).toBeCloseTo(120, 0);
  });
});

describe("getTempoMarking", () => {
  it("returns allegro for 130 bpm", () => {
    expect(getTempoMarking(130)).toBe("allegro");
  });

  it("returns andante for 90 bpm", () => {
    expect(getTempoMarking(90)).toBe("andante");
  });

  it("returns empty string for out-of-range", () => {
    expect(getTempoMarking(0)).toBe("");
  });
});

describe("TEMPO_MARKINGS", () => {
  it("contains multiple tempo markings", () => {
    expect(TEMPO_MARKINGS.length).toBeGreaterThan(5);
  });

  it("each marking has key, minBpm, maxBpm", () => {
    for (const marking of TEMPO_MARKINGS) {
      expect(marking).toHaveProperty("key");
      expect(marking).toHaveProperty("minBpm");
      expect(marking).toHaveProperty("maxBpm");
    }
  });
});
