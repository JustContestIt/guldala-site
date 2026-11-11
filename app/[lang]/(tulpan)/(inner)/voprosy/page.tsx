import { Faq } from "@/components/Faq";
import { getDict, pageMeta } from "@/lib/dict";

export async function generateMetadata() {
  const { t } = await getDict();
  return pageMeta("/voprosy", t.meta.faq.title, t.meta.faq.description);
}

export default async function FaqPage() {
  const { t } = await getDict();
  return (
    <div className="shell py-10 md:py-14">
      <h1 className="text-3xl sm:text-5xl">{t.home.faqTitle}</h1>
      <Faq className="mt-8" />
    </div>
  );
}
