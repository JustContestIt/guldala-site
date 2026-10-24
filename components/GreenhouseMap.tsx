import { MAP } from "@/content/site";
import { getDict } from "@/lib/dict";
import { Icon } from "./icons";
import { ButtonLink } from "./ui";

// Address, the Yandex map and the exact point in 2GIS; on the home page, the contacts and the order page
export async function GreenhouseMap({ className = "" }: { className?: string }) {
  const { t } = await getDict();
  return (
    <div className={`grid gap-3 ${className}`}>
      <p className="flex items-start gap-2">
        <Icon name="pin" className="mt-0.5 size-5 text-accent" /> {t.contacts.address}
      </p>
      <iframe
        src={MAP.embed}
        title={t.contacts.map}
        loading="lazy"
        className="aspect-[3/2] w-full rounded-2xl border border-line bg-mint"
      />
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={MAP.gis}>
          <Icon name="pin" /> {t.contacts.gis}
        </ButtonLink>
        <ButtonLink href={MAP.yandex} variant="secondary">
          {t.contacts.yandex}
        </ButtonLink>
      </div>
    </div>
  );
}
