import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.SITE_URL || "https://why-quantum-breaks-rsa.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Why Quantum Breaks RSA",
    template: "%s | Why Quantum Breaks RSA",
  },
  description:
    "Interactive dashboard comparing classical RSA vulnerability to Shor's algorithm vs post-quantum cryptography resilience",
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
    locale: "en_US",
    url: siteUrl,
    siteName: "Why Quantum Breaks RSA",
    title: "Why Quantum Breaks RSA",
    description:
      "Interactive dashboard showing how quantum computers break RSA encryption and why post-quantum cryptography is the solution",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Quantum Breaks RSA",
    description:
      "Interactive dashboard showing how quantum computers break RSA encryption and why post-quantum cryptography is the solution",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a12] text-gray-100">
        {children}
      </body>
    </html>
  );
}
