import {
  SectionHeader,
  ButtonComponent,
  ProblemCard,
  Feature,
  CaseStudy,
  BrandCard,
  ListItem,
  ProcessCard,
  ProcessCardMobile,
  FaqItem,
} from "./shared";
import { LeadForm } from "./form";
import { Brand } from "./brand";
import { StrapiMedia } from "./strapi";

export interface HeroSection {
  id: number;
  __component: "sections.hero";
  header?: SectionHeader;
  primaryButton?: ButtonComponent;
  leadForm?: LeadForm;
  brandLogos?: StrapiMedia[];
}

export interface ProblemAssessmentSection {
  id: number;
  __component: "sections.problem-assessment";
  header?: SectionHeader;
  problemCards?: ProblemCard[];
  summaryText?: string;
  submitButton?: ButtonComponent;
}

export interface SolutionHighlightsSection {
  id: number;
  __component: "sections.solution-highlights";
  header?: SectionHeader;
  features?: Feature[];
}

export interface CaseStudyShowcaseSection {
  id: number;
  __component: "sections.case-study-showcase";
  header?: SectionHeader;
  caseStudies?: CaseStudy[];
}

export interface BrandFitSection {
  id: number;
  __component: "sections.brand-fit";
  header?: SectionHeader;
  suitableCard?: BrandCard;
  unsuitableCard?: BrandCard;
}

export interface OurWorkSection {
  id: number;
  __component: "sections.our-work";
  header?: SectionHeader;
  projects?: Brand[];
}

export interface ClientShowcaseSection {
  id: number;
  __component: "sections.client-showcase";
  badge?: string;
  title?: string;
  mobileTitle?: string;
  description?: string;
  actions?: ButtonComponent[];
  services?: ListItem[];
}

export interface OurProcessSection {
  id: number;
  __component: "sections.our-process";
  eyebrow?: string;
  mobileEyebrow?: string | null;
  header?: SectionHeader;
  CTA?: ButtonComponent;
  desktopCta?: ButtonComponent[];
  cards?: ProcessCard[];
  desktopCards?: ProcessCard[];
  mobileCards?: ProcessCardMobile[];
}

export interface FaqSection {
  id: number;
  __component: "sections.faq";
  heading?: SectionHeader;
  questions?: FaqItem[];
}

export interface FooterIntro {
  id?: number;
  heading?: string;
  description?: string;
  subDescription?: string;
}

export interface FooterLink {
  id?: number;
  text?: string | null;
  platform?: string | null;
  URL?: string | null;
}

export interface FooterContact {
  id?: number;
  location?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface FooterSection {
  id: number;
  __component: "sections.footer";
  intro?: FooterIntro;
  socialLinks?: FooterLink[];
  quickLinks?: FooterLink[];
  contacts?: FooterContact[];
  marquee?: string | null;
}

export interface SharedButtonSection {
  id: number;
  __component: "shared.button";
  text: string;
  url?: string;
}

export interface NavbarSection {
  id: number;
  __component: "sections.navbar";
  pageLinks?: FooterLink[];
  contacts?: FooterContact[];
  socialLinks?: FooterLink[];
  cta?: ButtonComponent;
}

export type LandingPageSection =
  | HeroSection
  | ProblemAssessmentSection
  | SolutionHighlightsSection
  | CaseStudyShowcaseSection
  | BrandFitSection
  | OurWorkSection
  | ClientShowcaseSection
  | OurProcessSection
  | FaqSection
  | FooterSection
  | NavbarSection
  | SharedButtonSection
  | { id: number; __component: string; [key: string]: unknown };

