import { LandingPageSection } from "./sections";
import { LeadForm } from "./form";

export interface AuditBarData {
  id?: number;
  auditText?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  leadForm?: LeadForm;
}

export interface Page {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  sections?: LandingPageSection[];
  auditBar?: AuditBarData;
}
