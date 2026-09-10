import { fetcher } from "@/lib/fetcher";
import { FormEntity, LeadForm, StrapiResponse } from "@/types";

export const DEFAULT_CALLBACK_FORM: LeadForm = {
  id: 101,
  Steps: [
    {
      id: 1,
      formTitle: "Get a callback",
      description:
        "Let's make something amazing together.\nBook a call - we've got coffee (or tea) ready and are always up for a good conversation.",
      fields: [
        {
          id: 1,
          label: "Email",
          placeholder: "Enter Email",
          type: "email",
          required: true,
        },
        {
          id: 2,
          label: "Phone Number",
          placeholder: "Enter Phone Number",
          type: "phone",
          required: true,
        },
        {
          id: 3,
          label: "Shopify Link (Optional)",
          placeholder: "Enter Shopify link",
          type: "text",
          required: false,
        },
      ],
      primaryButton: {
        id: 1,
        text: "Book My Free Call",
      },
      footerText:
        "We'll reach out within 24 hours — no spam, just expert guidance.",
    },
  ],
};

export const DEFAULT_INSTANT_QUOTE_FORM: LeadForm = {
  id: 102,
  pricingTiers: [
    { id: 1, label: "Essential", minAmount: 100000, maxAmount: 200000 },
    { id: 2, label: "Balanced", minAmount: 200000, maxAmount: 500000, recommended: true },
    { id: 3, label: "Premium", minAmount: 500000, maxAmount: 1000000 },
  ],
  Steps: [
    {
      id: 1,
      title: "Store Info",
      formTitle: "Get an instant quote",
      description:
        "Book a free consultation with us. We'll discuss materials, your vision, and provide an estimate.",
      fields: [
        {
          id: 1,
          label: "Do you own a Shopify website ?",
          type: "radio",
          required: true,
          options: [
            { id: 1, label: "Yes, I do", value: "yes" },
            { id: 2, label: "No, I want to build one", value: "no" },
          ],
        },
        {
          id: 2,
          label: "Add your Shopify link (optional)",
          placeholder: "We'll personalize your quote based on your current setup.",
          type: "text",
        },
      ],
      primaryButton: {
        id: 1,
        text: "Continue",
      },
    },
    {
      id: 2,
      title: "Budget range",
      formTitle: "Choose your budget range",
      description: "Select what's not working and your preferred budget.",
      fields: [
        {
          id: 3,
          label: "What needs Improvement ?",
          type: "select",
          required: true,
          options: [
            { id: 3, label: "UX issue\nConfusing Design", value: "uxIssues" },
            { id: 4, label: "Conversion issues\nLow sales or drop-offs.", value: "conversionIssues" },
            { id: 5, label: "Outdated Design\nOld & Messy Design", value: "outdatedDesign" },
          ],
        },
        {
          id: 4,
          label: "Select your budget range",
          type: "radio",
          required: true,
          options: [
            { id: 6, label: "Essential\nSimple Redesign", value: "essential" },
            { id: 7, label: "Balanced\nModern, improved UX", value: "balanced" },
            { id: 8, label: "Premium\nHigh-performance Shopify", value: "premium" },
          ],
        },
        {
          id: 5,
          label: "Other issues (optional)",
          placeholder: "Any other issues your shopify store is facing",
          type: "text",
        },
      ],
      primaryButton: {
        id: 2,
        text: "Get My Estimate",
      },
    },
    {
      id: 3,
      title: "Your Estimate",
      formTitle: "Your Instant Quote Is Ready!",
      description: "Based on your inputs, here's your estimated range.",
      showEstimate: true,
      fields: [
        {
          id: 6,
          label: "Phone Number",
          placeholder: "Enter Phone Number",
          type: "phone",
          required: true,
        },
        {
          id: 7,
          label: "Email (optional)",
          placeholder: "Enter Email",
          type: "email",
        },
      ],
      primaryButton: {
        id: 3,
        text: "Book My Free Call",
      },
      footerText: "We'll review your store and send insights - no commitments.",
    },
  ],
};

export async function getFormBySlug(slug: string): Promise<LeadForm | undefined> {
  try {
    const response = await fetcher<StrapiResponse<FormEntity[]>>("/api/forms", {
      params: {
        "filters[slug][$eq]": slug,
        "populate[form][populate][Steps][populate][fields][populate][options]": "*",
        "populate[form][populate][Steps][populate][primaryButton]": "*",
        "populate[form][populate][pricingTiers]": "*",
      },
    });

    const strapiForm = response.data?.[0]?.form;
    if (strapiForm) return strapiForm;
  } catch {
    // Fallback to built-in form definition
  }

  if (slug === "callback") {
    return DEFAULT_CALLBACK_FORM;
  }
  if (slug === "instant-quote") {
    return DEFAULT_INSTANT_QUOTE_FORM;
  }
  return undefined;
}
