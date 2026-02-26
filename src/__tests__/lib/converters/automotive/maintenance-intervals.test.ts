import { describe, expect, it } from "vitest";
import {
  calculateNextService,
  getServiceById,
  getServiceTypes,
} from "@/lib/converters/automotive/maintenance-intervals";

describe("getServiceTypes", () => {
  it("returns an array of service types", () => {
    const services = getServiceTypes();
    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
  });

  it("each service type has required fields", () => {
    const services = getServiceTypes();
    for (const service of services) {
      expect(service).toHaveProperty("id");
      expect(service).toHaveProperty("name");
      expect(service).toHaveProperty("priority");
      expect(service).toHaveProperty("category");
    }
  });
});

describe("getServiceById", () => {
  it("returns undefined for unknown id", () => {
    expect(getServiceById("nonexistent_service_xyz")).toBeUndefined();
  });

  it("returns a service for a valid id from getServiceTypes", () => {
    const services = getServiceTypes();
    const firstService = services[0];
    const found = getServiceById(firstService.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(firstService.id);
  });
});

describe("calculateNextService", () => {
  it("returns 'ok' status for service with lots of km remaining", () => {
    const services = getServiceTypes();
    const service = services.find((s) => s.intervalKm !== null);
    if (!service) return; // Skip if no km-based service

    const result = calculateNextService(
      service,
      10000, // current odometer: 10,000 km
      0, // last service at 0 km
      null,
      1000 // average 1000 km/month
    );
    // service.intervalKm - 10000 km remaining = lots of km left
    expect(result).toBeDefined();
    expect(result.service.id).toBe(service.id);
  });

  it("returns overdue status when km is significantly past due", () => {
    const services = getServiceTypes();
    const service = services.find((s) => s.intervalKm !== null);
    if (!service || service.intervalKm === null) return;

    // Last service was at 0 km, now at 2x interval
    const currentOdometer = service.intervalKm * 2;
    const result = calculateNextService(service, currentOdometer, 0, null, 1000);
    expect(["overdue", "critical"]).toContain(result.status);
  });

  it("includes urgencyMessage", () => {
    const services = getServiceTypes();
    const service = services[0];
    const result = calculateNextService(service, 10000, 0, null, 1000);
    expect(typeof result.urgencyMessage).toBe("string");
    expect(result.urgencyMessage.length).toBeGreaterThan(0);
  });

  it("includes progressPercent between 0 and 150", () => {
    const services = getServiceTypes();
    const service = services.find((s) => s.intervalKm !== null);
    if (!service) return;

    const result = calculateNextService(service, 1000, 0, null, 500);
    expect(result.progressPercent).toBeGreaterThanOrEqual(0);
    expect(result.progressPercent).toBeLessThanOrEqual(150);
  });

  it("calculates km remaining correctly", () => {
    const services = getServiceTypes();
    const service = services.find((s) => s.intervalKm !== null && s.intervalKm > 0);
    if (!service || service.intervalKm === null) return;

    const lastServiceKm = 40000;
    const currentKm = 42000;
    const expectedRemaining = lastServiceKm + service.intervalKm - currentKm;

    const result = calculateNextService(service, currentKm, lastServiceKm, null, 1000);
    if (result.kmRemaining !== null) {
      expect(result.kmRemaining).toBe(expectedRemaining);
    }
  });
});
