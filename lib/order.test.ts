import { describe, expect, it } from "vitest";
import { linesFromPicks, parsePicks, prepaymentAmount, quote, serializePicks, slotsFor } from "./order";
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

  it("100 % at least 30 days before pickup takes 10 % off every stem, as the CRM does (review 12.11.2026, Ц2)", () => {
    const lines = [{ productId: ID.red, packs: 4 }]; // 120 × 90 ₸ at 100 % on DAY
    expect(quote(season, lines, 100, DAY, "2026-11-20")).toMatchObject({ subtotal: 10_800, discount: { pct: 10, amount: 1_080 }, total: 9_720, prepayment: 9_720 });
    expect(quote(season, lines, 100, DAY, "2026-11-19").discount).toEqual({ pct: 0, amount: 0 }); // 29 days
    expect(quote(season, lines, 100, DAY).discount.pct).toBe(0); // no date yet
    expect(quote(season, lines, 80, DAY, "2027-03-05")).toMatchObject({ discount: { pct: 0, amount: 0 }, total: 120 * 95 });
  });

  it("flags lines above stock and colors that are out", () => {
    const q = quote(season, [{ productId: ID.pink, packs: 9 }, { productId: ID.orange, packs: 4 }, { productId: ID.red, packs: 4 }], 100, DAY);
    expect(q.overStock).toEqual([ID.pink, ID.orange]);
    expect(quote(season, [{ productId: ID.pink, packs: 8 }], 100, DAY).overStock).toEqual([]);
  });

  it("counts packs and the minimum by the CRM's pack size", () => {
    const small = { ...season, season: { ...season.season, packSize: 25 } };
    expect(quote(small, [{ productId: ID.red, packs: 4 }], 100, DAY)).toMatchObject({ stems: 100, missingStems: 20 });
    expect(quote(small, [{ productId: ID.red, packs: 5 }], 100, DAY)).toMatchObject({ stems: 125, missingStems: 0 });
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
    expect(slotsFor(season.season, "2027-03-02", "2026-10-25")).toHaveLength(3);
    expect(slotsFor(season.season, "2027-03-06", "2026-10-25")).toContain("21:00–23:00");
    expect(slotsFor(season.season, "2027-03-09", "2026-10-25")).toEqual([]);
    expect(slotsFor(season.season, "2027-03-02", "2027-03-03")).toEqual([]); // inside the window, but already past
    expect(slotsFor({ ...season.season, peakHoursFrom: "" }, "2027-03-06", "2026-10-25")).toHaveLength(3); // the CRM sends "" = no evening hours
  });
});
