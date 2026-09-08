import { StrapiMedia } from "./strapi";

export interface Brand {
  id: number;
  documentId?: string;
  name: string;
  slug?: string;
  description?: string | null;
  websiteUrl?: string | null;
  brandColor?: string | null;
  logo?: StrapiMedia | null;
  secondaryLogo?: StrapiMedia | null;
  desktopScreenshots?: StrapiMedia[];
  mobileScreenshots?: StrapiMedia[];
  desktopImage?: StrapiMedia | null;
  mobileImage?: StrapiMedia | null;
}
