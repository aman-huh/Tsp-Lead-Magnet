import { ButtonComponent } from "./shared";

export interface BudgetRange {
  id: number;
  label?: string;
  minAmount?: number;
  maxAmount?: number;
  recommended?: boolean;
}

export type FormFieldType =
  | "text"
  | "email"
  | "phone"
  | "url"
  | "textarea"
  | "radio"
  | "select";

export interface FormFieldOption {
  id: number;
  label: string;
  value: string;
}

export interface FormField {
  id: number;
  label: string;
  placeholder?: string;
  type: FormFieldType;
  required?: boolean;
  options?: FormFieldOption[];
}

export interface FormStep {
  id: number;
  title?: string;
  formTitle?: string;
  description?: string;
  fields?: FormField[];
  primaryButton?: ButtonComponent;
  footerText?: string;
  showEstimate?: boolean;
  layout?: "default" | "two-column";
}

export interface LeadForm {
  id: number;
  Steps?: FormStep[];
  pricingTiers?: BudgetRange[];
  successMessage?: string;
}

export interface FormEntity {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  form?: LeadForm;
}
