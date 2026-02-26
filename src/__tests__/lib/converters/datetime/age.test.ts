import { describe, expect, it } from "vitest";
import { calculateAge } from "@/lib/converters/datetime/age";

// Note: calculateAge uses `new Date()` internally for "today" reference,
// so we test structural properties and zodiac info that don't depend on today's date.

describe("calculateAge", () => {
  it("returns null for missing birthDate", () => {
    expect(calculateAge({ birthDate: "" })).toBeNull();
  });

  it("returns null for invalid birthDate string", () => {
    expect(calculateAge({ birthDate: "not-a-date" })).toBeNull();
  });

  it("returns null for future birth date", () => {
    expect(calculateAge({ birthDate: "2099-01-01" })).toBeNull();
  });

  it("returns non-null for valid past birth date", () => {
    const result = calculateAge({ birthDate: "2000-01-15" });
    expect(result).not.toBeNull();
  });

  it("returns positive years for a 1990 birth year", () => {
    const result = calculateAge({ birthDate: "1990-06-15" });
    expect(result).not.toBeNull();
    expect(result!.years).toBeGreaterThan(30);
  });

  it("includes totalDays as a positive number", () => {
    const result = calculateAge({ birthDate: "2000-01-15" });
    expect(result!.totalDays).toBeGreaterThan(0);
  });

  it("includes totalWeeks derived from totalDays", () => {
    const result = calculateAge({ birthDate: "2000-01-15" });
    expect(result!.totalWeeks).toBeGreaterThan(0);
    expect(result!.totalWeeks).toBe(Math.floor(result!.totalDays / 7));
  });

  it("includes zodiacSign for January 15 (capricorn)", () => {
    const result = calculateAge({ birthDate: "2000-01-15" });
    expect(result!.zodiacSign).toBe("capricorn");
  });

  it("includes zodiacSign for June 15 (gemini)", () => {
    const result = calculateAge({ birthDate: "2000-06-15" });
    expect(result!.zodiacSign).toBe("gemini");
  });

  it("includes chineseZodiac for year 2000 (dragon)", () => {
    const result = calculateAge({ birthDate: "2000-01-15" });
    expect(result!.chineseZodiac).toBe("dragon");
  });

  it("includes nextBirthday with a date", () => {
    const result = calculateAge({ birthDate: "2000-01-15" });
    expect(result!.nextBirthday).toBeDefined();
    expect(result!.nextBirthday.date).toBeInstanceOf(Date);
    expect(result!.nextBirthday.daysUntil).toBeGreaterThanOrEqual(0);
  });

  it("returns months between 0 and 11", () => {
    const result = calculateAge({ birthDate: "1990-06-15" });
    expect(result!.months).toBeGreaterThanOrEqual(0);
    expect(result!.months).toBeLessThanOrEqual(11);
  });
});
