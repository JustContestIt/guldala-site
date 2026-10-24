import { expect, it } from "vitest";
import { activeFilters, matches, readFilters, writeFilters } from "./catalog";

it("reads only known filter values from the query", () => {
  expect(readFilters(new URLSearchParams("q=Strong&color=red&color=nope&type=double&stock=1&view=list"))).toEqual({
    q: "Strong",
    colors: ["red"],
    type: "double",
    stock: true,
    view: "list",
  });
  expect(readFilters(new URLSearchParams("color=pink,white&type=x&stock=yes&view=table"))).toEqual({
    q: "",
    colors: ["white", "pink"],
    type: undefined,
    stock: false,
    view: "grid",
  });
});

it("writes the filters back and keeps the WhatsApp token", () => {
  const f = readFilters(new URLSearchParams("q=+love+"));
  expect(writeFilters({ ...f, colors: ["red", "pink"], stock: true }, "?c=abc&color=white")).toBe("?c=abc&q=love&color=red&color=pink&stock=1");
  expect(writeFilters(readFilters(new URLSearchParams()), "?color=red&view=list")).toBe("");
});

it("matches the name or color text, colors, type and stock", () => {
  const x = { text: "strong love красные классические", color: "red", type: "classic", inStock: true } as const;
  const f = readFilters(new URLSearchParams());
  expect(matches(x, f)).toBe(true);
  expect(matches(x, { ...f, q: " Крас " })).toBe(true);
  expect(matches(x, { ...f, q: "gold" })).toBe(false);
  expect(matches(x, { ...f, colors: ["pink", "red"] })).toBe(true);
  expect(matches(x, { ...f, colors: ["pink"] })).toBe(false);
  expect(matches(x, { ...f, type: "double" })).toBe(false);
  expect(matches({ ...x, inStock: false }, { ...f, stock: true })).toBe(false);
  expect(activeFilters({ ...f, q: "a", colors: ["red", "pink"], stock: true })).toBe(4);
});
