// Downloads variety photos from haakmanflowerbulbs.com.
// Usage: node scripts/haakman-photos.mjs [--out dir] [name or slug ...]   (none = every variety, ~430)
// Output: <dir>/<slug>/<n>.<ext> and <dir>/varieties.json, dir defaults to scraped/haakman
// The photos are Haakman's: put them on the site only with their written permission (content/PHOTO-BRIEF.md)
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const BASE = "https://haakmanflowerbulbs.com/en/varieties/";
const WORKERS = 4;

const text = (html) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();

// The listing paginates in JS, but its A–Z block links every variety
export function parseSlugs(html) {
  const az = html.match(/<details class="hk-az"[\s\S]*?<\/details>/)?.[0] ?? "";
  return [...new Set([...az.matchAll(/\/en\/varieties\/([a-z0-9-]+)\//g)].map((m) => m[1]))];
}

// Orders list names ("Mrs. Medvedeva"); WordPress slugs drop accents, dots and apostrophes
export const toSlug = (name) =>
  name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function parseVariety(html) {
  const name = text(html.match(/<h1 class="hk-single__title">([\s\S]*?)<\/h1>/)?.[1] ?? "");
  const props = Object.fromEntries(
    [...html.matchAll(/hk-single__prop-label">([\s\S]*?)<\/div>\s*<div class="hk-single__prop-value">([\s\S]*?)<\/div>/g)].map(
      (m) => [text(m[1]), text(m[2])],
    ),
  );
  let photos = [...html.matchAll(/data-full="([^"]+)"/g)].map((m) => m[1]);
  // Varieties without a gallery only have the main image
  if (!photos.length) photos = [html.match(/<img[^>]*?src="([^"]+)"[^>]*class="hk-single__main-img"/)?.[1]].filter(Boolean);
  return { name, props, photos: [...new Set(photos)] };
}

async function get(url) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

const exists = (file) => access(file).then(() => true, () => false);

async function main(names, out) {
  const all = parseSlugs(await (await get(BASE)).text());
  const wanted = names.length ? [...new Set(names.map(toSlug))] : all;
  // Never fetch an unknown slug: WordPress redirects it to a similar variety ("strong" -> Strong Energy)
  const missing = wanted.filter((slug) => !all.includes(slug));
  if (missing.length) console.error(`not on haakman: ${missing.join(", ")}`);
  const slugs = wanted.filter((slug) => all.includes(slug));
  const queue = [...slugs];
  const result = [];
  await Promise.all(
    Array.from({ length: WORKERS }, async () => {
      while (queue.length) {
        const slug = queue.shift();
        try {
          const variety = parseVariety(await (await get(`${BASE}${slug}/`)).text());
          const dir = path.join(out, slug);
          await mkdir(dir, { recursive: true });
          const files = [];
          for (const [i, url] of variety.photos.entries()) {
            const file = path.join(dir, `${i + 1}${path.extname(new URL(url).pathname)}`);
            // Already downloaded files are kept, so a rerun only fetches what failed
            if (!(await exists(file))) await writeFile(file, Buffer.from(await (await get(url)).arrayBuffer()));
            files.push(file.replaceAll("\\", "/"));
          }
          result.push({ slug, ...variety, photos: files, sources: variety.photos });
          console.log(`${slug}: ${files.length}`);
        } catch (e) {
          console.error(`${slug}: ${e.message}`);
        }
      }
    }),
  );
  result.sort((a, b) => a.slug.localeCompare(b.slug));
  await mkdir(out, { recursive: true });
  await writeFile(path.join(out, "varieties.json"), JSON.stringify(result, null, 2));
  console.log(`${result.length}/${slugs.length} varieties -> ${out}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { out: { type: "string", default: "scraped/haakman" } },
  });
  await main(positionals, values.out);
}
