import type { Metadata } from "next";
import { ContactView } from "@/components/pages/ContactView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildPageMetadata, contactPageJsonLd } from "@/lib/seo";
import { siteContact } from "@/lib/site-pages";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact InterviewHub",
  description:
    "Email Abdul Rafay at InterviewHub with a question, correction, content request, or feedback. Based in Rawalpindi, Pakistan.",
  path: "/contact",
  keywords: ["contact InterviewHub", "interview prep feedback", "suggest interview questions"],
});

export default function ContactPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          contactPageJsonLd(siteContact.email),
        ]}
      />
      <ContactView />
    </main>
  );
}
