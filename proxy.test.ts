import { describe, expect, it } from "vitest";
import { route } from "./proxy";

const B = "https://botanica.guldala.kz";
const main = (p: string) => route("guldala.kz", p, B);
const bot = (p: string) => route("botanica.guldala.kz", p, B);

describe("proxy route", () => {
  it("serves Russian tulip pages from /ru and leaves /kz alone", () => {
    expect(main("/")).toEqual({ rewrite: "/ru" });
    expect(main("/tulpan/sorta")).toEqual({ rewrite: "/ru/tulpan/sorta" });
    expect(main("/kz/tulpan")).toBeNull();
    expect(main("/ru/tulpan")).toBeNull();
    expect(main("/botanical-garden")).toEqual({ rewrite: "/ru/botanical-garden" }); // only the /botanica segment moves
  });

  it("sends /botanica on the main host to the subdomain", () => {
    expect(main("/botanica")).toEqual({ redirect: `${B}/` });
    expect(main("/botanica/rasteniya")).toEqual({ redirect: `${B}/rasteniya` });
    expect(main("/kz/botanica")).toEqual({ redirect: `${B}/kz` });
    expect(main("/kz/botanica/proekty")).toEqual({ redirect: `${B}/kz/proekty` });
  });

  it("serves the Botanica landing on botanica.<host> with short paths", () => {
    expect(bot("/")).toEqual({ rewrite: "/ru/botanica" });
    expect(bot("/rasteniya")).toEqual({ rewrite: "/ru/botanica/rasteniya" });
    expect(bot("/kz")).toEqual({ rewrite: "/kz/botanica" });
    expect(bot("/kz/proekty")).toEqual({ rewrite: "/kz/botanica/proekty" });
    expect(bot("/botanica/proekty")).toEqual({ rewrite: "/ru/botanica/proekty" }); // old long links still work
    expect(bot("/ru/botanica/opengraph-image")).toBeNull(); // the share card URL Next generates
  });
});
