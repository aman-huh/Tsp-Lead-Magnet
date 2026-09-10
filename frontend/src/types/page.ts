import { LandingPageSection } from "./sections";

export interface Page {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  sections?: LandingPageSection[];
}
