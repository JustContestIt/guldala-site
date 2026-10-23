import { describe, expect, it } from "vitest";
import { parseItems, prepaymentAmount, quote, slotsFor } from "./order";
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

  it("rounds prepayment up to a whole tenge", () => {
    expect(prepaymentAmount(1001, 40)).toBe(401);
  });

  it("marks the order closed after the last price period", () => {
    expect(quote(season, [{ productId: ID.red, packs: 4 }], 100, "2027-03-08").closed).toBe(true);
  });

  it("rejects malformed items and unknown products", () => {
    expect(parseItems(`${ID.red}:4,${ID.whiteDouble}:2`)).toEqual([
      { productId: ID.red, packs: 4 },
      { productId: ID.whiteDouble, packs: 2 },
    ]);
    expect(parseItems(`${ID.red}:-1`)).toBeNull();
    expect(parseItems(`${ID.red}:4;drop`)).toBeNull();
    expect(parseItems("red-classic:4")).toBeNull();
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
