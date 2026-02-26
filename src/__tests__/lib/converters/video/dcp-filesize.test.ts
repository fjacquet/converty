import { describe, expect, it } from "vitest";
import { calculateDCPFilesize } from "@/lib/converters/video/dcp-filesize";

describe("calculateDCPFilesize", () => {
  it("returns null for zero duration", () => {
    expect(calculateDCPFilesize(0, "2k")).toBeNull();
  });

  it("calculates 2K feature film size > 0", () => {
    const result = calculateDCPFilesize(120, "2k");
    expect(result).not.toBeNull();
    expect(result?.totalGB).toBeGreaterThan(0);
  });

  it("4K is larger than 2K for same duration", () => {
    const twoK = calculateDCPFilesize(120, "2k");
    const fourK = calculateDCPFilesize(120, "4k");
    expect(twoK).not.toBeNull();
    expect(fourK).not.toBeNull();
    expect(fourK?.totalBytes ?? 0).toBeGreaterThan(twoK?.totalBytes ?? 0);
  });

  it("4K bitrate is 500 Mbps", () => {
    const result = calculateDCPFilesize(120, "4k");
    expect(result?.videoBitrate).toBe(500);
  });

  it("2K bitrate is 250 Mbps", () => {
    const result = calculateDCPFilesize(120, "2k");
    expect(result?.videoBitrate).toBe(250);
  });

  it("includes audio bytes > 0", () => {
    const result = calculateDCPFilesize(120, "2k");
    expect(result?.audioBytes).toBeGreaterThan(0);
  });

  it("returns formatted string in GB or TB", () => {
    const result = calculateDCPFilesize(120, "2k");
    expect(result?.formatted).toMatch(/GB|TB/);
  });
});
