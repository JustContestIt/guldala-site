import { describe, expect, it } from "vitest";
import { buildMockSeason } from "./mock-season";
import { almatyDay, pricePerStem } from "./pricing";

const at = (iso: string) => buildMockSeason(new Date(iso));

describe("season prices", () => {
  it("shows today's price at 100% prepayment and the next period", () => {
    const s = at("2026-10-21T12:00:00+05:00");
    expect(s.season.saleOpen).toBe(true);
    expect(s.prices.classic).toEqual({ today: 90, next: { from: "2026-12-01", price: 100 } });
    expect(s.prices.double).toEqual({ today: 120, next: { from: "2026-12-01", price: 130 } });
  });

  it("switches period at Almaty midnight, not UTC", () => {
    expect(at("2026-11-30T23:59:00+05:00").prices.classic.today).toBe(90);
    expect(at("2026-12-01T00:00:00+05:00").prices.classic.today).toBe(100);
    expect(almatyDay(new Date("2026-11-30T20:00:00Z"))).toBe("2026-12-01");
  });

  it("adds the surcharge for lower prepayment", () => {
    const grid = at("2026-10-21T12:00:00+05:00").priceGrid;
    expect(pricePerStem(grid, "classic", 40, "2026-10-21")).toBe(105);
    expect(pricePerStem(grid, "classic", 60, "2026-10-21")).toBe(100);
    expect(pricePerStem(grid, "classic", 80, "2026-10-21")).toBe(95);
    expect(pricePerStem(grid, "double", 100, "2027-02-16")).toBe(165);
  });

  it("closes the sale after the last period", () => {
    const s = at("2027-03-08T10:00:00+05:00");
    expect(s.season.saleOpen).toBe(false);
    expect(s.prices.classic.next).toBeNull();
    expect(pricePerStem(s.priceGrid, "classic", 100, "2027-03-08")).toBeNull();
  });
});
