import { fetcher } from "@/lib/fetcher";
import { GlobalSettings, LandingPage, StrapiResponse } from "@/types";

export async function getLandingPage() {
  const response = await fetcher<StrapiResponse<LandingPage>>(
    "/api/landing-page",
    {
      params: {
        "populate[sections][on][sections.hero][populate][header]": "*",
        "populate[sections][on][sections.hero][populate][primaryButton]": "*",
        "populate[sections][on][sections.hero][populate][brandLogos]": "true",
        "populate[sections][on][sections.hero][populate][leadForm][populate][Steps][populate][fields][populate][options]": "*",
        "populate[sections][on][sections.hero][populate][leadForm][populate][Steps][populate][primaryButton]": "*",
        "populate[sections][on][sections.hero][populate][leadForm][populate][pricingTiers]": "*",
        "populate[sections][on][sections.problem-assessment][populate]": "*",
        "populate[sections][on][sections.solution-highlights][populate][header]": "*",
        "populate[sections][on][sections.solution-highlights][populate][features][populate]": "*",
        "populate[sections][on][sections.case-study-showcase][populate][header]": "*",
        "populate[sections][on][sections.case-study-showcase][populate][caseStudies][populate]": "*",
        "populate[sections][on][sections.brand-fit][populate][header]": "*",
        "populate[sections][on][sections.brand-fit][populate][suitableCard][populate][items]": "*",
        "populate[sections][on][sections.brand-fit][populate][unsuitableCard][populate][items]": "*",
        "populate[sections][on][sections.our-work][populate][header]": "*",
        "populate[sections][on][sections.our-work][populate][projects][populate]": "*",
        "populate[sections][on][sections.client-showcase][populate][actions]": "*",
        "populate[sections][on][sections.client-showcase][populate][services]": "*",
        "populate[sections][on][sections.our-process][populate][header]": "*",
        "populate[sections][on][sections.our-process][populate][CTA]": "*",
        "populate[sections][on][sections.our-process][populate][desktopCta]": "*",
        "populate[sections][on][sections.our-process][populate][desktopCards][populate]": "*",
        "populate[sections][on][sections.our-process][populate][mobileCards][populate]": "*",
        "populate[sections][on][sections.faq][populate][heading]": "*",
        "populate[sections][on][sections.faq][populate][questions]": "*",
        "populate[sections][on][sections.footer][populate]": "*",
      },
    }
  );

  return response.data;
}

export async function getGlobal(): Promise<GlobalSettings | undefined> {
  try {
    const response = await fetcher<StrapiResponse<GlobalSettings>>("/api/global", {
      params: {
        populate: "*",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to load global settings", error);
    return undefined;
  }
}