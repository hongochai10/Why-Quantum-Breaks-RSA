"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n";
import { useDictionary } from "./DictionaryProvider";

export default function LocaleSwitcher({
  currentLocale,
}: {
  currentLocale: Locale;
}) {
  const pathname = usePathname();
  const { dict } = useDictionary();

  return (
    <div
      className="flex items-center gap-1 text-xs"
      role="group"
      aria-label={dict.localeSwitcher.label}
    >
      {locales.map((locale) => {
        const href = pathname.replace(`/${currentLocale}`, `/${locale}`);
        const isActive = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
              isActive
                ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
                : "text-gray-500 hover:text-gray-300 border border-transparent"
            }`}
          >
            {dict.localeSwitcher[locale]}
          </Link>
        );
      })}
    </div>
  );
}
