import React from "react";
import Hero from "@/components/sections/Hero";
import ProblemAssessment from "@/components/sections/ProblemAssessment";
import SolutionHighlights from "@/components/sections/SolutionHighlights";
import CaseStudyShowcase from "@/components/sections/CaseStudyShowcase";
import BrandFit from "@/components/sections/BrandFit";
import OurWork from "@/components/sections/OurWork";
import ClientShowcase from "@/components/sections/ClientShowcase";
import OurProcess from "@/components/sections/OurProcess";
import FAQ from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import {
  LandingPageSection,
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

interface SectionRendererProps {
  sections?: LandingPageSection[];
  brands?: Brand[];
}

export default function SectionRenderer({
  sections,
  brands,
}: SectionRendererProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => {
        const key = section.id
          ? `${section.__component}-${section.id}`
          : `${section.__component}-${index}`;

        switch (section.__component) {
          case "sections.hero":
            return <Hero key={key} data={section as HeroSection} />;
          case "sections.problem-assessment":
            return (
              <ProblemAssessment
                key={key}
                data={section as ProblemAssessmentSection}
              />
            );
          case "sections.solution-highlights":
            return (
              <SolutionHighlights
                key={key}
                data={section as SolutionHighlightsSection}
              />
            );
          case "sections.case-study-showcase":
            return (
              <CaseStudyShowcase
                key={key}
                data={section as CaseStudyShowcaseSection}
              />
            );
          case "sections.brand-fit":
            return <BrandFit key={key} data={section as BrandFitSection} />;
          case "sections.our-work":
            return <OurWork key={key} data={section as OurWorkSection} />;
          case "sections.client-showcase":
            return (
              <ClientShowcase
                key={key}
                data={section as ClientShowcaseSection}
                brands={brands}
              />
            );
          case "sections.our-process":
            return (
              <OurProcess key={key} data={section as OurProcessSection} />
            );
          case "sections.faq":
            return <FAQ key={key} data={section as FaqSection} />;
          case "sections.footer":
            return <Footer key={key} data={section as FooterSection} />;
          default:
            return null;
        }
      })}
    </>
  );
}
