import { CompanyStrip } from "@/components/home/CompanyStrip";
import { FocusCategories } from "@/components/home/FocusCategories";
import { HomeHero } from "@/components/home/HomeHero";
import { RecentQuestions } from "@/components/home/RecentQuestions";
import { TopLanguages } from "@/components/home/TopLanguages";

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <TopLanguages />
      <CompanyStrip />
      <FocusCategories />
      <RecentQuestions />
    </main>
  );
}
