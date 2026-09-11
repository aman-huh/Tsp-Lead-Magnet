import { fetcher } from "@/lib/fetcher";
import { Page, StrapiResponse } from "@/types";

export const PAGE_SECTIONS_POPULATE: Record<string, string> = {
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
  "populate[sections][on][shared.button][populate]": "*",
};

export async function getHomePage(): Promise<Page | undefined> {
  try {
    const response = await fetcher<StrapiResponse<Page[]>>("/api/pages", {
      params: {
        "filters[$or][0][slug][$eq]": "landing-page",
        "filters[$or][1][slug][$eq]": "home",
        "sort[0]": "updatedAt:desc",
        "pagination[pageSize]": "1",
        ...PAGE_SECTIONS_POPULATE,
      },
    });

    if (response.data?.[0]) {
      return response.data[0];
    }

    const fallbackResponse = await fetcher<StrapiResponse<Page[]>>("/api/pages", {
      params: {
        "pagination[pageSize]": "1",
        "sort[0]": "updatedAt:desc",
        ...PAGE_SECTIONS_POPULATE,
      },
    });

    return fallbackResponse.data?.[0];
  } catch (error) {
    console.error("Failed to load home page:", error);
    return undefined;
  }
}

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  try {
    const response = await fetcher<StrapiResponse<Page[]>>("/api/pages", {
      params: {
        "filters[slug][$eq]": slug,
        ...PAGE_SECTIONS_POPULATE,
      },
    });

    return response.data?.[0];
  } catch (error) {
    console.error(`Failed to load page with slug "${slug}":`, error);
    return undefined;
  }
}

export async function getAllPages(): Promise<Page[]> {
  try {
    const response = await fetcher<StrapiResponse<Page[]>>("/api/pages", {
      params: {
        "fields[0]": "slug",
        "fields[1]": "title",
      },
    });

    return response.data || [];
  } catch (error) {
    console.error("Failed to load all pages:", error);
    return [];
  }
}
