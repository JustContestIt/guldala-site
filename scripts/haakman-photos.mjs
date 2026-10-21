// Downloads variety photos from haakmanflowerbulbs.com.
// Usage: node scripts/haakman-photos.mjs [slug ...]   (no slugs = every variety, ~430)
// Output: scraped/haakman/<slug>/<n>.<ext> and scraped/haakman/varieties.json
// The photos are Haakman's: put them on the site only with their written permission (content/PHOTO-BRIEF.md)
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const BASE = "https://haakmanflowerbulbs.com/en/varieties/";
const OUT = "scraped/haakman";
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

async function main(only) {
  const slugs = only.length ? only : parseSlugs(await (await get(BASE)).text());
  const queue = [...slugs];
  const result = [];
  await Promise.all(
    Array.from({ length: WORKERS }, async () => {
      while (queue.length) {
        const slug = queue.shift();
        try {
          const variety = parseVariety(await (await get(`${BASE}${slug}/`)).text());
          const dir = path.join(OUT, slug);
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
  await mkdir(OUT, { recursive: true });
  await writeFile(path.join(OUT, "varieties.json"), JSON.stringify(result, null, 2));
  console.log(`${result.length}/${slugs.length} varieties -> ${OUT}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2));
