import { StrapiMedia } from "./strapi";

export interface SectionHeader {
  id: number;
  title: string;
  description?: string;
}

export interface ButtonComponent {
  id: number;
  text: string;
  url?: string | null;
}

export interface ClientShowcase {
  id: number;
  heading?: string;
  logos?: StrapiMedia[];
}

export interface ProblemCard {
  id: number;
  title: string;
  description?: string;
  identifier: string;
}

export interface Feature {
  id: number;
  title?: string;
  description?: string;
  backgroundColor?: "navy" | "lavender" | "sage" | string;
  illustration?: StrapiMedia | null;
}

export interface CaseStudy {
  id: number;
  clientName: string;
  beforeImage?: StrapiMedia | null;
  afterImage?: StrapiMedia | null;
  beforeLabel?: string | null;
  afterLabel?: string | null;
  mobileBeforeImage?: StrapiMedia | null;
  afterMobileImage?: StrapiMedia | null;
}

export interface BrandItem {
  id: number;
  text?: string | null;
}

export interface BrandCard {
  id: number;
  title: string;
  varient?: "suitable" | "unsuitable";
  items?: BrandItem[];
}

export interface ListItem {
  id: number;
  Text?: string;
  text?: string;
}

export interface ProcessCard {
  id: number;
  variant?: "content" | "media";
  size?: "default" | "wide";
  title?: string | null;
  description?: string | null;
  icon?: StrapiMedia | null;
  cta?: ButtonComponent | null;
  media?: StrapiMedia | null;
  hoverList?: ListItem[];
}

export interface FaqItem {
  id: number;
  question: string;
  answer?: string | null;
}