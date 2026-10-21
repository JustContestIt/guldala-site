import { SectionTitle } from "@/components/ui";
import { PLANTS } from "@/content/botanica";
import { getDict, pageMeta } from "@/lib/dict";
import { PlantCard } from "../cards";

export async function generateMetadata() {
  const { t } = await getDict();
  return pageMeta("/botanica/rasteniya", t.meta.plants.title, t.meta.plants.description);
}

export default async function PlantsPage() {
  const { t } = await getDict();
  const groups = [
    [t.botanica.inStock, PLANTS.filter((p) => p.availability === "in_stock")],
    [t.botanica.toOrder, PLANTS.filter((p) => p.availability === "to_order")],
  ] as const;
  return (
    <div className="shell py-12 md:py-16">
      <h1 className="text-3xl text-white sm:text-4xl">{t.botanica.plantsTitle}</h1>
      <p className="mt-2 max-w-2xl">{t.botanica.plantsLead}</p>
      {groups.map(([title, list]) => (
        <section key={title} className="mt-12">
          <SectionTitle title={title} dark />
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <li key={p.slug}><PlantCard p={p} n={PLANTS.indexOf(p) + 1} /></li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
