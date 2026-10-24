import { describe, expect, it } from "vitest";
import { linesFromPicks, parsePicks, prepaymentAmount, quote, serializePicks, slotsFor, storageDays } from "./order";
import { ID, season } from "./season.fixture";

const DAY = "2026-10-21";

describe("order quote", () => {
  it("asks for more until 120 stems in total", () => {
    expect(quote(season, [{ productId: ID.red, packs: 3 }], 100, DAY).missingStems).toBe(30);
    expect(quote(season, [{ productId: ID.red, packs: 2 }, { productId: ID.white, packs: 2 }], 100, DAY).missingStems).toBe(0);
  });

  it("splits the total into prepayment and remainder", () => {
    const q = quote(season, [{ productId: ID.red, packs: 4 }, { productId: ID.whiteDouble, packs: 2 }], 60, DAY);
    // 120 × 100 ₸ + 60 × 130 ₸ at 60 %
    expect(q.total).toBe(19_800);
    expect(q.prepayment).toBe(11_880);
    expect(q.remainder).toBe(7_920);
  });

  it("flags lines above stock and colors that are out", () => {
    const q = quote(season, [{ productId: ID.pink, packs: 9 }, { productId: ID.orange, packs: 4 }, { productId: ID.red, packs: 4 }], 100, DAY);
    expect(q.overStock).toEqual([ID.pink, ID.orange]);
    expect(quote(season, [{ productId: ID.pink, packs: 8 }], 100, DAY).overStock).toEqual([]);
  });

  it("adds the fridge by the day from the order day to pickup, and takes the prepayment of it too", () => {
    expect(storageDays(DAY, "2026-10-24")).toBe(3);
    expect(storageDays(DAY, DAY)).toBe(0);
    expect(storageDays(DAY, "")).toBe(0);
    const q = quote(season, [{ productId: ID.red, packs: 4 }], 60, DAY, storageDays(DAY, "2026-10-24") * season.season.storageFeePerDay);
    // 120 × 100 ₸ + 3 days × 1 000 ₸ at 60 %
    expect(q).toMatchObject({ fee: 3_000, total: 15_000, prepayment: 9_000, remainder: 6_000 });
  });

  it("rounds prepayment up to a whole tenge", () => {
    expect(prepaymentAmount(1001, 40)).toBe(401);
  });

  it("marks the order closed after the last price period", () => {
    expect(quote(season, [{ productId: ID.red, packs: 4 }], 100, "2027-03-08").closed).toBe(true);
  });

  it("adds varieties of one color into one line and keeps their names", () => {
    const varieties = [
      { slug: "strong-love", name: "Strong Love", color: "red", type: "classic" },
      { slug: "bullit", name: "Bullit", color: "red", type: "classic" },
      { slug: "polar-bear", name: "Polar Bear", color: "white", type: "classic" },
      { slug: "nowhere", name: "Nowhere", color: "yellow", type: "classic" }, // no such product in the season
    ] as const;
    const r = linesFromPicks({ "strong-love": 3, bullit: 1, "polar-bear": 2, nowhere: 5, unknown: 4 }, [...varieties], season.stock);
    expect(r.lines).toEqual([
      { productId: ID.red, packs: 4 },
      { productId: ID.white, packs: 2 },
    ]);
    expect(r.sorts).toEqual([
      { name: "Strong Love", packs: 3 },
      { name: "Bullit", packs: 1 },
      { name: "Polar Bear", packs: 2 },
    ]);
  });

  it("rejects malformed picks and unknown products", () => {
    expect(parsePicks("strong-love:3,polar-bear:12")).toEqual({ "strong-love": 3, "polar-bear": 12 });
    expect(serializePicks({ "strong-love": 3, bullit: 0 })).toBe("strong-love:3");
    expect(parsePicks("strong-love:-1")).toBeNull();
    expect(parsePicks("strong-love:3;drop")).toBeNull();
    expect(parsePicks("Strong Love:3")).toBeNull();
    const unknown = "99999999-9999-4999-8999-999999999999";
    expect(quote(season, [{ productId: unknown, packs: 4 }], 100, DAY).unknown).toEqual([unknown]);
  });

  it("offers evening slots only on peak days inside the pickup window", () => {
    expect(slotsFor(season.season, "2027-03-02")).toHaveLength(3);
    expect(slotsFor(season.season, "2027-03-06")).toContain("21:00–23:00");
    expect(slotsFor(season.season, "2027-03-09")).toEqual([]);
    expect(slotsFor({ ...season.season, peakHoursFrom: "" }, "2027-03-06")).toHaveLength(3); // the CRM sends "" = no evening hours
  });
});
