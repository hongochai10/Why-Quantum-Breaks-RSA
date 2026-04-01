import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { hasLocale, getDictionary } from "./dictionaries";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.SITE_URL || "https://why-quantum-breaks-rsa.vercel.app";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.metadata.title,
      template: dict.metadata.titleTemplate,
    },
    description: dict.metadata.description,
    keywords: [
      "quantum computing",
      "RSA",
      "Shor's algorithm",
      "post-quantum cryptography",
      "ML-KEM",
      "NIST FIPS 203",
      "cryptography",
    ],
    authors: [{ name: "TechBi" }],
    openGraph: {
      type: "website",
      locale: lang === "vi" ? "vi_VN" : "en_US",
      url: `${siteUrl}/${lang}`,
      siteName: dict.metadata.title,
      title: dict.metadata.title,
      description: dict.metadata.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.title,
      description: dict.metadata.ogDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        en: `${siteUrl}/en`,
        vi: `${siteUrl}/vi`,
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a12] text-gray-100">
        {children}
      </body>
    </html>
  );
}
