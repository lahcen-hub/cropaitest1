"use server";

import { extractSalesData, ExtractSalesDataInput, ExtractSalesDataOutput } from "@/ai/flows/extract-sales-data";

export async function extractSalesDataAction(input: ExtractSalesDataInput): Promise<{ data: ExtractSalesDataOutput | null, error: string | null }> {
    try {
        const result = await extractSalesData(input);
        return { data: result, error: null };
    } catch (e: any) {
        console.error(e);
        return { data: null, error: e.message || "An unknown error occurred." };
    }
}
