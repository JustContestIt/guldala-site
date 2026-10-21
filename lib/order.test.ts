import { describe, expect, it } from "vitest";
import { buildMockSeason } from "./mock-season";
import { parseItems, prepaymentAmount, quote, slotsFor } from "./order";

const season = buildMockSeason(new Date("2026-10-21T12:00:00+05:00"));
const DAY = "2026-10-21";

describe("order quote", () => {
  it("asks for more until 120 stems in total", () => {
    expect(quote(season, [{ productId: "red-classic", packs: 3 }], 100, DAY).missingStems).toBe(30);
    expect(quote(season, [{ productId: "red-classic", packs: 2 }, { productId: "white-classic", packs: 2 }], 100, DAY).missingStems).toBe(0);
  });

  it("splits the total into prepayment and remainder", () => {
    const q = quote(season, [{ productId: "red-classic", packs: 4 }, { productId: "white-double", packs: 2 }], 60, DAY);
    // 120 × 100 ₸ + 60 × 130 ₸ at 60 %
    expect(q.total).toBe(19_800);
    expect(q.prepayment).toBe(11_880);
    expect(q.remainder).toBe(7_920);
  });

  it("flags lines above stock and colors that are out", () => {
    const q = quote(season, [{ productId: "pink-classic", packs: 9 }, { productId: "orange-classic", packs: 4 }, { productId: "red-classic", packs: 4 }], 100, DAY);
    expect(q.overStock).toEqual(["pink-classic", "orange-classic"]);
    expect(quote(season, [{ productId: "pink-classic", packs: 8 }], 100, DAY).overStock).toEqual([]);
  });

  it("rounds prepayment up to a whole tenge", () => {
    expect(prepaymentAmount(1001, 40)).toBe(401);
  });

  it("marks the order closed after the last price period", () => {
    expect(quote(season, [{ productId: "red-classic", packs: 4 }], 100, "2027-03-08").closed).toBe(true);
  });

  it("rejects malformed items and unknown products", () => {
    expect(parseItems("red-classic:4,white-double:2")).toEqual([
      { productId: "red-classic", packs: 4 },
      { productId: "white-double", packs: 2 },
    ]);
    expect(parseItems("red-classic:-1")).toBeNull();
    expect(parseItems("red-classic:4;drop")).toBeNull();
    expect(quote(season, [{ productId: "blue-classic", packs: 4 }], 100, DAY).unknown).toEqual(["blue-classic"]);
  });

  it("offers evening slots only on peak days inside the pickup window", () => {
    expect(slotsFor(season.season, "2027-03-02")).toHaveLength(3);
    expect(slotsFor(season.season, "2027-03-06")).toContain("21:00–23:00");
    expect(slotsFor(season.season, "2027-03-09")).toEqual([]);
  });
});
