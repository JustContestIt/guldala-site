import { Photo } from "@/components/Photo";
import { Ph } from "@/components/ui";
import type { Plant, Project } from "@/content/botanica";
import { getDict } from "@/lib/dict";
import { tenge } from "@/lib/format";

export async function PlantCard({ p, n }: { p: Plant; n: number }) {
  const { t } = await getDict();
  const inStock = p.availability === "in_stock";
  return (
    <article>
      <Photo label={inStock ? t.photos.plantReal : t.photos.plantNursery} ratio="4/5" dark />
      <p className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${inStock ? "bg-mint text-accent-dark" : "bg-warn-bg text-warn"}`}>
        {inStock ? t.botanica.inStock : t.botanica.toOrder}
      </p>
      <h3 className="mt-2 text-base text-white">{p.name ?? <Ph>{`${t.ph.plant} ${n}`}</Ph>}</h3>
      <p className="mt-1 text-sm italic">{p.latinName ?? <Ph>{t.ph.latin}</Ph>}</p>
      <p className="mt-1 text-sm">
        {t.botanica.size}: {p.size ?? <Ph>{t.ph.size}</Ph>}
        {" · "}
        {p.price ? tenge(p.price) : <Ph>{t.ph.price}</Ph>}
      </p>
    </article>
  );
}

export async function ProjectCard({ p }: { p: Project }) {
  const { t } = await getDict();
  return (
    <article>
      <Photo label={t.photos.project} ratio="3/2" dark />
      <p className="mt-3 text-sm text-night-accent">{t.botanica.objectTypes[p.objectType]}</p>
      <h3 className="mt-1 text-lg text-white">{p.title ?? <Ph>{t.ph.project}</Ph>}</h3>
    </article>
  );
}
