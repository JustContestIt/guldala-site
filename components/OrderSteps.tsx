import { getDict } from "@/lib/dict";
import { Icon, type IconName } from "./icons";

const ICONS: IconName[] = ["list", "check", "card", "truck"];

export async function OrderSteps() {
  const { t } = await getDict();
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {t.steps.map((s, i) => (
        <li key={s.title} className="rounded-2xl border border-line p-5">
          <div className="flex items-center gap-3 text-accent">
            <Icon name={ICONS[i]} className="size-6" />
            <span className="text-sm text-muted">{t.stepN(i + 1)}</span>
          </div>
          <h3 className="mt-3 text-lg">{s.title}</h3>
          <p className="mt-1 text-sm text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
