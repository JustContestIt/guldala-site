import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui";
import { waLink } from "@/content/site";
import { getDict } from "@/lib/dict";

export default async function NotFound() {
  const { t, href } = await getDict();
  return (
    <section className="shell py-24 text-center">
      <h1 className="text-3xl sm:text-4xl">{t.notFound.h1}</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">{t.notFound.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href={href("/tulpan")}>{t.notFound.tulips}</ButtonLink>
        <ButtonLink href={waLink(t.wa.hello)} variant="secondary">
          <Icon name="chat" /> {t.wa.button}
        </ButtonLink>
      </div>
    </section>
  );
}
