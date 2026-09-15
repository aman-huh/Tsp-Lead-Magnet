import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import ProblemAssessment from "@/components/sections/ProblemAssessment";
import SolutionHighlights from "@/components/sections/SolutionHighlights";

const CaseStudyShowcase = dynamic(() => import("@/components/sections/CaseStudyShowcase"));
const BrandFit = dynamic(() => import("@/components/sections/BrandFit"));
const OurWork = dynamic(() => import("@/components/sections/OurWork"));
const ClientShowcase = dynamic(() => import("@/components/sections/ClientShowcase"));
const OurProcess = dynamic(() => import("@/components/sections/OurProcess"));
const FAQ = dynamic(() => import("@/components/sections/Faq"));
const Footer = dynamic(() => import("@/components/sections/Footer"));
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
