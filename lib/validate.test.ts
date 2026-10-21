import { expect, it } from "vitest";
import { isBin, normalizePhone } from "./validate";

it("normalizes Kazakhstan phone numbers", () => {
  expect(normalizePhone("+7 777 100 66 67")).toBe("+77771006667");
  expect(normalizePhone("8 (777) 100-66-67")).toBe("+77771006667");
  expect(normalizePhone("77771006667")).toBe("+77771006667");
  expect(normalizePhone("+7 777 100 66")).toBeNull();
  expect(normalizePhone("+1 202 555 0100")).toBeNull();
});

it("checks BIN is 12 digits", () => {
  expect(isBin("123456789012")).toBe(true);
  expect(isBin("12345678901")).toBe(false);
});
