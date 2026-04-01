import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { DictionaryProvider } from "@/components/DictionaryProvider";
import HomeClient from "@/components/HomeClient";
import type { Locale } from "@/lib/i18n";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <DictionaryProvider dictionary={dict} lang={lang as Locale}>
      <HomeClient />
    </DictionaryProvider>
  );
}
