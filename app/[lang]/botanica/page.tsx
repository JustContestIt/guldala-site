import Link from "next/link";
import { Icon } from "@/components/icons";
import { Photo } from "@/components/Photo";
import { ButtonLink, SectionTitle } from "@/components/ui";
import { PLANTS, PROJECTS } from "@/content/botanica";
import { waLink } from "@/content/site";
import { getDict, pageMeta } from "@/lib/dict";
import { PlantCard, ProjectCard } from "./cards";
import { LeadForm } from "./LeadForm";

export async function generateMetadata() {
  const { t } = await getDict();
  return pageMeta("/", t.meta.botanica.title, t.meta.botanica.description);
}

export default async function BotanicaPage() {
  const { t, href } = await getDict();
  const b = t.botanica;
  const plants = [...PLANTS.filter((p) => p.availability === "in_stock").slice(0, 2), ...PLANTS.filter((p) => p.availability === "to_order").slice(0, 2)];

  return (
    <>
      <section className="shell grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-sm text-night-accent">{b.eyebrow}</p>
          <h1 className="mt-2 text-3xl leading-tight text-white sm:text-5xl">{b.h1}</h1>
          <p className="mt-4 text-lg">{b.lead}</p>
          <p className="mt-8 text-sm">{b.segmentsTitle}</p>
          <ul className="mt-2 grid grid-cols-2 gap-2">
            {(Object.keys(b.segments) as (keyof typeof b.segments)[]).map((s) => (
              <li key={s}>
                <a
                  href={s === "designer" ? "#dizayneram" : "#zayavka"}
                  className="flex min-h-12 items-center justify-between gap-2 rounded-xl border border-white/15 px-4 font-semibold text-white hover:border-night-accent"
                >
                  {b.segments[s]} <Icon name="arrow" className="size-4 text-night-accent" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Photo label={t.photos.botanicaHero} ratio="4/5" dark />
      </section>

      <section className="shell py-12 md:py-16">
        <SectionTitle title={b.projectsTitle} lead={b.projectsLead} dark />
        <ul className="grid gap-6 md:grid-cols-3">
          {PROJECTS.map((p) => (
            <li key={p.slug}><ProjectCard p={p} /></li>
          ))}
        </ul>
        <Link href={href("/proekty")} className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-night-accent hover:text-white">
          {b.allProjects} <Icon name="arrow" className="size-4" />
        </Link>
      </section>

      <section className="shell py-12 md:py-16">
        <SectionTitle title={b.plantsTitle} lead={b.plantsLead} dark />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {plants.map((p) => (
            <li key={p.slug}><PlantCard p={p} n={PLANTS.indexOf(p) + 1} /></li>
          ))}
        </ul>
        <Link href={href("/rasteniya")} className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-night-accent hover:text-white">
          {b.allPlants} <Icon name="arrow" className="size-4" />
        </Link>
      </section>

      <section className="bg-night-soft py-12 md:py-16">
        <div className="shell">
          <SectionTitle title={b.supplyTitle} lead={b.supplyNote} dark />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {b.supply.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-white/10 p-5">
                <span className="text-sm text-night-accent">{i + 1}</span>
                <h3 className="mt-2 text-lg text-white">{s.title}</h3>
                <p className="mt-1 text-sm">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell py-12 md:py-16">
        <SectionTitle title={b.processTitle} dark />
        <ol className="grid gap-x-8 gap-y-4 md:grid-cols-2">
          {b.process.map((s, i) => (
            <li key={s.title} className="flex gap-4 border-b border-white/10 pb-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-night-soft font-semibold text-night-accent">{i + 1}</span>
              <div>
                <h3 className="text-base text-white">{s.title}</h3>
                <p className="text-sm">{s.result}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell grid gap-6 pb-16 md:grid-cols-2">
        <div id="zayavka" className="scroll-mt-24 rounded-3xl bg-night-soft p-6 sm:p-8">
          <h2 className="text-2xl text-white">{b.leadTitle}</h2>
          <p className="mb-6 mt-2">{b.leadText}</p>
          <LeadForm kind="lead" t={t.forms} segments={b.objectTypes} />
        </div>
        <div id="dizayneram" className="scroll-mt-24 rounded-3xl border border-white/15 p-6 sm:p-8">
          <h2 className="text-2xl text-white">{b.designersTitle}</h2>
          <p className="mb-6 mt-2">{b.designersText}</p>
          <LeadForm kind="designer" t={t.forms} segments={b.objectTypes} />
          <ButtonLink href={waLink(t.wa.botanica)} variant="light" className="mt-6">
            <Icon name="chat" /> {t.wa.button}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
