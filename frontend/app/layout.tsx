import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ConditionalSiteChrome } from "@/components/layout/ConditionalSiteChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl, organizationJsonLd, SITE_NAME, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — Technical Interview Questions & Practice`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Practice real technical interview questions by programming language and category. Clear answers, diagrams, and guides to help you get hired.",
  keywords: [
    "technical interview questions",
    "programming interview prep",
    "coding interview",
    "system design interview",
    "SQL interview questions",
    "React interview questions",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Technical Interview Questions & Practice`,
    description:
      "Practice real technical interview questions by programming language and category.",
    images: [{ url: "/hero-interview.png", alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Technical Interview Questions & Practice`,
    description:
      "Practice real technical interview questions by programming language and category.",
    images: ["/hero-interview.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <ConditionalSiteChrome>{children}</ConditionalSiteChrome>
      </body>
    </html>
  );
}
