import { LandingPageSection } from "./sections";
import { StrapiMedia } from "./strapi";

export interface LandingPage {
  id: number;
  documentId: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  sections?: LandingPageSection[];
}

export interface GlobalSettings {
  id: number;
  documentId: string;
  siteName: string;
  siteDescription: string;
  brandLogos?: StrapiMedia[];
}
