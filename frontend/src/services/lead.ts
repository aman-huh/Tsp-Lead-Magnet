import { fetcher } from "@/lib/fetcher";

export interface LeadPayload {
  hasShopifyWebsite?: string;
  shopifyUrl?: string;
  email?: string;
  name?: string;
  source?: string;
  submittedAt?: string;
  formData?: Record<string, unknown>;
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  await fetcher("/api/leads", {
    method: "POST",
    body: JSON.stringify({
      data: {
        ...payload,
        source: payload.source ?? "hero_form",
        submittedAt: new Date().toISOString(),
      },
    }),
  });
}
