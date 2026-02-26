import { describe, expect, it } from "vitest";
import { calculateTimeZone, getTimezoneOptions } from "@/lib/converters/datetime/time-zone";

describe("getTimezoneOptions", () => {
  it("returns an array with at least one timezone", () => {
    const options = getTimezoneOptions();
    expect(Array.isArray(options)).toBe(true);
    expect(options.length).toBeGreaterThan(0);
  });

  it("each option has value, label, and region properties", () => {
    const options = getTimezoneOptions();
    const first = options[0];
    expect(first).toHaveProperty("value");
    expect(first).toHaveProperty("label");
    expect(first).toHaveProperty("region");
  });

  it("contains at least one America timezone option", () => {
    const options = getTimezoneOptions();
    const america = options.find((o) => o.value.startsWith("America/"));
    expect(america).toBeDefined();
  });
});

describe("calculateTimeZone", () => {
  it("returns null for missing dateTime", () => {
    expect(
      calculateTimeZone({ dateTime: "", fromTimezone: "UTC", toTimezone: "America/New_York" })
    ).toBeNull();
  });

  it("returns null for missing fromTimezone", () => {
    expect(
      calculateTimeZone({ dateTime: "2024-06-15T12:00", fromTimezone: "", toTimezone: "UTC" })
    ).toBeNull();
  });

  it("returns null for missing toTimezone", () => {
    expect(
      calculateTimeZone({ dateTime: "2024-06-15T12:00", fromTimezone: "UTC", toTimezone: "" })
    ).toBeNull();
  });

  it("returns non-null result for UTC to UTC", () => {
    const result = calculateTimeZone({
      dateTime: "2024-06-15T12:00",
      fromTimezone: "UTC",
      toTimezone: "UTC",
    });
    expect(result).not.toBeNull();
  });

  it("returns convertedDateTime as a Date object", () => {
    const result = calculateTimeZone({
      dateTime: "2024-06-15T12:00",
      fromTimezone: "UTC",
      toTimezone: "UTC",
    });
    expect(result!.convertedDateTime).toBeInstanceOf(Date);
  });

  it("returns formattedDate and formattedTime strings", () => {
    const result = calculateTimeZone({
      dateTime: "2024-06-15T12:00",
      fromTimezone: "UTC",
      toTimezone: "UTC",
    });
    expect(typeof result!.formattedDate).toBe("string");
    expect(result!.formattedDate.length).toBeGreaterThan(0);
    expect(typeof result!.formattedTime).toBe("string");
    expect(result!.formattedTime.length).toBeGreaterThan(0);
  });

  it("offset is 0 minutes for UTC to UTC", () => {
    const result = calculateTimeZone({
      dateTime: "2024-06-15T12:00",
      fromTimezone: "UTC",
      toTimezone: "UTC",
    });
    expect(result!.offsetMinutes).toBe(0);
  });

  it("UTC to America/New_York has negative offset (UTC-4 or UTC-5 depending on DST)", () => {
    const result = calculateTimeZone({
      dateTime: "2024-06-15T12:00",
      fromTimezone: "UTC",
      toTimezone: "America/New_York",
    });
    expect(result).not.toBeNull();
    // New York is UTC-4 in summer (EDT), UTC-5 in winter (EST)
    expect(result!.offsetMinutes).toBeLessThan(0);
  });
});
