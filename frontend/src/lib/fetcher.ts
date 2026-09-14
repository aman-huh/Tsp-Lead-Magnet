const RAW_STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.STRAPI_URL ||
  "http://localhost:1337";

const STRAPI_URL = RAW_STRAPI_URL.replace(/\/+$/, "");

const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

interface FetcherOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function fetcher<T>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${STRAPI_URL}${cleanEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Request failed: ${response.status} - ${errorBody}`);
  }

  return response.json();
}

export function getStrapiMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${STRAPI_URL}${url.startsWith("/") ? url : `/${url}`}`;
}