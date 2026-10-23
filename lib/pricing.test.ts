import { describe, expect, it } from "vitest";
import { almatyDay, pricePerStem } from "./pricing";
import { season } from "./season.fixture";

const grid = season.priceGrid;

describe("season prices", () => {
  it("picks the period that contains the day, at the chosen prepayment", () => {
    expect(pricePerStem(grid, "classic", 100, "2026-10-21")).toBe(90);
    expect(pricePerStem(grid, "classic", 40, "2026-10-21")).toBe(105);
    expect(pricePerStem(grid, "classic", 60, "2026-10-21")).toBe(100);
    expect(pricePerStem(grid, "classic", 80, "2026-10-21")).toBe(95);
    expect(pricePerStem(grid, "double", 100, "2027-02-16")).toBe(165);
  });

  it("switches period at Almaty midnight, not UTC", () => {
    expect(almatyDay(new Date("2026-11-30T20:00:00Z"))).toBe("2026-12-01");
    expect(pricePerStem(grid, "classic", 100, "2026-11-30")).toBe(90);
    expect(pricePerStem(grid, "classic", 100, "2026-12-01")).toBe(100);
  });

  it("has no price after the last period", () => {
    expect(pricePerStem(grid, "classic", 100, "2027-03-08")).toBeNull();
  });
});
