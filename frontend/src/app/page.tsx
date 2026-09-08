import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import ProblemAssessment from "@/components/sections/ProblemAssessment";
import SolutionHighlights from "@/components/sections/SolutionHighlights";
import CaseStudyShowcase from "@/components/sections/CaseStudyShowcase";
import BrandFit from "@/components/sections/BrandFit";
import OurWork from "@/components/sections/OurWork";
import ClientShowcase from "@/components/sections/ClientShowcase";
import OurProcess from "@/components/sections/OurProcess";
import FAQ from "@/components/sections/Faq";
import FooterReveal from "@/components/sections/FooterReveal";
import { getLandingPage } from "@/services/landing";
import { getBrands } from "@/services/brand";
import {
  HeroSection,
  ProblemAssessmentSection,
  SolutionHighlightsSection,
  CaseStudyShowcaseSection,
  BrandFitSection,
  OurWorkSection,
  ClientShowcaseSection,
  OurProcessSection,
  FaqSection,
  FooterSection,
  Brand,
} from "@/types";

export default async function Home() {
  let heroSection: HeroSection | undefined;
  let problemSection: ProblemAssessmentSection | undefined;
  let solutionSection: SolutionHighlightsSection | undefined;
  let caseStudyShowcaseSection: CaseStudyShowcaseSection | undefined;
  let brandFitSection: BrandFitSection | undefined;
  let ourWorkSection: OurWorkSection | undefined;
  let clientShowcaseSection: ClientShowcaseSection | undefined;
  let ourProcessSection: OurProcessSection | undefined;
  let faqSection: FaqSection | undefined;
  let footerSection: FooterSection | undefined;
  let brands: Brand[] = [];

  try {
    const [landingPage, fetchedBrands] = await Promise.all([
      getLandingPage(),
      getBrands(),
    ]);
    brands = fetchedBrands;
    heroSection = landingPage?.sections?.find(
      (section): section is HeroSection =>
        section.__component === "sections.hero"
    );
    problemSection = landingPage?.sections?.find(
      (section): section is ProblemAssessmentSection =>
        section.__component === "sections.problem-assessment"
    );
    solutionSection = landingPage?.sections?.find(
      (section): section is SolutionHighlightsSection =>
        section.__component === "sections.solution-highlights"
    );
    caseStudyShowcaseSection = landingPage?.sections?.find(
      (section): section is CaseStudyShowcaseSection =>
        section.__component === "sections.case-study-showcase"
    );
    brandFitSection = landingPage?.sections?.find(
      (section): section is BrandFitSection =>
        section.__component === "sections.brand-fit"
    );
    ourWorkSection = landingPage?.sections?.find(
      (section): section is OurWorkSection =>
        section.__component === "sections.our-work"
    );
    clientShowcaseSection = landingPage?.sections?.find(
      (section): section is ClientShowcaseSection =>
        section.__component === "sections.client-showcase"
    );
    ourProcessSection = landingPage?.sections?.find(
      (section): section is OurProcessSection =>
        section.__component === "sections.our-process"
    );
    faqSection = landingPage?.sections?.find(
      (section): section is FaqSection =>
        section.__component === "sections.faq"
    );
    footerSection = landingPage?.sections?.find(
      (section): section is FooterSection =>
        section.__component === "sections.footer"
    );
  } catch (error) {
    console.error("Failed to load landing page", error);
  }

  return (
    <>
      <Navbar />
      <FooterReveal footerData={footerSection}>
        <main className="w-full min-h-screen overflow-x-hidden bg-white">
          <Hero data={heroSection} />
          <ProblemAssessment data={problemSection} />
          <SolutionHighlights data={solutionSection} />
          <CaseStudyShowcase data={caseStudyShowcaseSection} />
          <BrandFit data={brandFitSection} />
          <OurWork data={ourWorkSection} />
          <ClientShowcase data={clientShowcaseSection} brands={brands} />
          <OurProcess data={ourProcessSection} />
          <FAQ data={faqSection} />
        </main>
      </FooterReveal>
    </>
  );
}