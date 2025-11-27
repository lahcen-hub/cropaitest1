"use server";

import { extractCatalogData, ExtractCatalogDataInput, ExtractCatalogDataOutput } from "@/ai/flows/extract-catalog-data";

export async function extractCatalogDataAction(input: ExtractCatalogDataInput): Promise<{ data: ExtractCatalogDataOutput | null, error: string | null }> {
    try {
        const result = await extractCatalogData(input);
        return { data: result, error: null };
    } catch (e: any) {
        console.error(e);
        return { data: null, error: e.message || "An unknown error occurred." };
    }
}
