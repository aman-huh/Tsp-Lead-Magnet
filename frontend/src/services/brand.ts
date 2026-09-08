import { fetcher } from "@/lib/fetcher";
import { Brand, StrapiResponse } from "@/types";

export async function getBrands(): Promise<Brand[]> {
  try {
    const response = await fetcher<StrapiResponse<Brand[]>>("/api/brands", {
      params: {
        populate: "*",
      },
    });

    return response.data || [];
  } catch (error) {
    console.error("Failed to load brands:", error);
    return [];
  }
}
