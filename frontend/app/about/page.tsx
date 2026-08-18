import type { Metadata } from "next";
import { AboutView } from "@/components/pages/AboutView";
import { JsonLd } from "@/components/seo/JsonLd";
import { aboutPageJsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About InterviewHub",
  description:
    "InterviewHub helps developers prepare for technical interviews with real questions by language and category, clear answers, and diagrams.",
  path: "/about",
  keywords: [
    "about InterviewHub",
    "technical interview practice",
    "coding interview prep",
  ],
});

export default function AboutPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          aboutPageJsonLd(),
        ]}
      />
      <AboutView />
    </main>
  );
}
