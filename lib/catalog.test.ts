import { expect, it } from "vitest";
import { isTall, shadesOf, VARIETIES } from "../content/varieties";
import { activeFilters, matches, readFilters, writeFilters } from "./catalog";

it("reads only known filter values from the query", () => {
  expect(readFilters(new URLSearchParams("q=Strong&color=red&color=nope&type=double&stock=1&tall=1&two=1&view=list"))).toEqual({
    q: "Strong",
    colors: ["red"],
    type: "double",
    stock: true,
    tall: true,
    twoTone: true,
    view: "list",
  });
  expect(readFilters(new URLSearchParams("color=pink,cream,white&type=x&stock=yes&tall=0&view=table"))).toEqual({
    q: "",
    colors: ["white", "cream", "pink"],
    type: undefined,
    stock: false,
    tall: false,
    twoTone: false,
    view: "grid",
  });
});

it("writes the filters back and keeps the WhatsApp token", () => {
  const f = readFilters(new URLSearchParams("q=+love+"));
  expect(writeFilters({ ...f, colors: ["red", "pink"], stock: true }, "?c=abc&color=white")).toBe("?c=abc&q=love&color=red&color=pink&stock=1");
  expect(writeFilters({ ...f, q: "", tall: true, twoTone: true }, "?two=1")).toBe("?tall=1&two=1");
  expect(writeFilters(readFilters(new URLSearchParams()), "?color=red&view=list")).toBe("");
});

it("matches the name or color text, colors, type, stock, stem and two-tone", () => {
  const x = { text: "strong love красные классические", color: "red", type: "classic", inStock: true, tall: false, twoTone: false } as const;
  const f = readFilters(new URLSearchParams());
  expect(matches(x, f)).toBe(true);
  expect(matches(x, { ...f, q: " Крас " })).toBe(true);
  expect(matches(x, { ...f, q: "gold" })).toBe(false);
  expect(matches(x, { ...f, colors: ["pink", "red"] })).toBe(true);
  expect(matches(x, { ...f, colors: ["pink"] })).toBe(false);
  expect(matches(x, { ...f, type: "double" })).toBe(false);
  expect(matches({ ...x, inStock: false }, { ...f, stock: true })).toBe(false);
  expect(matches(x, { ...f, tall: true })).toBe(false);
  expect(matches({ ...x, tall: true, twoTone: true }, { ...f, tall: true, twoTone: true })).toBe(true);
  expect(matches(x, { ...f, twoTone: true })).toBe(false);
  expect(activeFilters({ ...f, q: "a", colors: ["red", "pink"], stock: true, tall: true, twoTone: true })).toBe(6);
});

it("puts cream varieties in the white line, but filters them as cream", () => {
  const fondue = VARIETIES.find((v) => v.slug === "fondue")!;
  expect([fondue.color, fondue.shades[0]]).toEqual(["white", "cream"]);
  expect(shadesOf({ color: "white", type: "classic" })).toEqual(["white", "cream"]);
  expect(VARIETIES.filter(isTall).map((v) => v.slug)).toEqual([
    "body-builder", "roman-empire", "polar-bear", "memphis", "sissi", "tresor", "fortress", "delta-storm",
  ]);
});
