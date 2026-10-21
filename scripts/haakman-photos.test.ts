import { expect, it } from "vitest";
import { parseSlugs, parseVariety } from "./haakman-photos.mjs";

it("takes variety slugs from the A–Z block only", () => {
  const html = `<a href="https://haakmanflowerbulbs.com/en/varieties/feed/">
    <details class="hk-az"><summary>All</summary><ul>
      <li><a href="https://haakmanflowerbulbs.com/en/varieties/aafke/">Aafke</a></li>
      <li><a href="https://haakmanflowerbulbs.com/en/varieties/ace-pink/">Ace Pink</a></li>
      <li><a href="https://haakmanflowerbulbs.com/en/varieties/aafke/">Aafke</a></li>
    </ul></details>`;
  expect(parseSlugs(html)).toEqual(["aafke", "ace-pink"]);
});

it("parses name, props and full-size gallery photos", () => {
  const html = `<img src="https://x/a.webp" class="hk-single__main-img">
    <img src="https://x/a-140.webp" data-full="https://x/a.jpg?v=1">
    <img src="https://x/b-140.webp" data-full="https://x/b.webp">
    <h1 class="hk-single__title">Andre Citroen &amp; Co</h1>
    <div class="hk-single__prop-label">Colour</div>
    <div class="hk-single__prop-value">Pink</div>
    <div class="hk-single__prop-label">Geschikt 9°C</div>
    <div class="hk-single__prop-value"><span style="color:#009B4D">&#10003; Ja</span></div>`;
  expect(parseVariety(html)).toEqual({
    name: "Andre Citroen & Co",
    props: { Colour: "Pink", "Geschikt 9°C": "✓ Ja" },
    photos: ["https://x/a.jpg?v=1", "https://x/b.webp"],
  });
});

it("falls back to the main image without a gallery", () => {
  const html = `<img src="https://x/main.webp" alt="A" class="hk-single__main-img"><h1 class="hk-single__title">A</h1>`;
  expect(parseVariety(html).photos).toEqual(["https://x/main.webp"]);
});
