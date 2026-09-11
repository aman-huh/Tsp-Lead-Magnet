import { fetcher } from "@/lib/fetcher";

export interface LeadPayload {
  hasShopifyWebsite?: string;
  shopifyUrl?: string;
  email?: string;
  phone?: string;
  name?: string;
  source?: string;
  submittedAt?: string;
  honeypot?: string;
  formData?: Record<string, unknown>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitLead(payload: LeadPayload): Promise<void> {
  if (payload.honeypot && payload.honeypot.trim()) {
    return;
  }

  const data: Record<string, unknown> = {
    source: payload.source ?? "hero_form",
    submittedAt: new Date().toISOString(),
  };

  if (payload.hasShopifyWebsite === "yes" || payload.hasShopifyWebsite === "no") {
    data.hasShopifyWebsite = payload.hasShopifyWebsite;
  }
  if (payload.shopifyUrl && payload.shopifyUrl.trim()) {
    data.shopifyUrl = payload.shopifyUrl.trim();
  }
  if (payload.email && EMAIL_REGEX.test(payload.email.trim())) {
    data.email = payload.email.trim();
  }
  if (payload.name && payload.name.trim()) {
    data.name = payload.name.trim();
  }

  const formData: Record<string, unknown> = { ...(payload.formData || {}) };
  if (payload.phone && payload.phone.trim()) {
    formData["Phone Number"] = payload.phone.trim();
  }
  data.formData = formData;

  try {
    await fetcher("/api/leads", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  } catch (err) {
    console.error("Failed to submit lead:", err);
    throw err;
  }
}
