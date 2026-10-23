import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui";
import { PROJECTS } from "@/content/botanica";
import { getDict, pageMeta } from "@/lib/dict";
import { ProjectCard } from "../cards";

export async function generateMetadata() {
  const { t } = await getDict();
  return pageMeta("/proekty", t.meta.projects.title, t.meta.projects.description);
}

export default async function ProjectsPage() {
  const { t, href } = await getDict();
  return (
    <div className="shell py-12 md:py-16">
      <h1 className="text-3xl text-white sm:text-4xl">{t.botanica.projectsTitle}</h1>
      <p className="mt-2 max-w-2xl">{t.botanica.projectsLead}</p>
      <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <li key={p.slug}><ProjectCard p={p} /></li>
        ))}
      </ul>
      <ButtonLink href={`${href("/")}#zayavka`} variant="light" className="mt-10">
        {t.botanica.leadTitle} <Icon name="arrow" className="size-4" />
      </ButtonLink>
    </div>
  );
}
