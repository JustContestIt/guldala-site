import { expect, it } from "vitest";
import { formatPhone, isBin, normalizePhone } from "./validate";

it("normalizes Kazakhstan phone numbers", () => {
  expect(normalizePhone("+7 777 100 66 67")).toBe("+77771006667");
  expect(normalizePhone("8 (777) 100-66-67")).toBe("+77771006667");
  expect(normalizePhone("77771006667")).toBe("+77771006667");
  expect(normalizePhone("+7 777 100 66")).toBeNull();
  expect(normalizePhone("+1 202 555 0100")).toBeNull();
});

it("formats the phone field as it's typed or pasted", () => {
  expect(["+7 ", "+7 7", "+7 7771", "+7 777 100 66 671", "87771006667", "8 (777) 100-66-67", "7771006667", "+77771006667", ""].map(formatPhone)).toEqual([
    "",
    "+7 7",
    "+7 777 1",
    "+7 777 100 66 67",
    "+7 777 100 66 67",
    "+7 777 100 66 67",
    "+7 777 100 66 67",
    "+7 777 100 66 67",
    "",
  ]);
  expect(normalizePhone(formatPhone("87771006667"))).toBe("+77771006667");
});

it("checks BIN is 12 digits", () => {
  expect(isBin("123456789012")).toBe(true);
  expect(isBin("12345678901")).toBe(false);
});
