"use server";

import { extractInvoiceData, ExtractInvoiceDataInput, ExtractInvoiceDataOutput } from "@/ai/flows/extract-invoice-data";

export async function extractInvoiceDataAction(input: ExtractInvoiceDataInput): Promise<{ data: ExtractInvoiceDataOutput | null, error: string | null }> {
    try {
        const result = await extractInvoiceData(input);
        return { data: result, error: null };
    } catch (e: any) {
        console.error(e);
        return { data: null, error: e.message || "An unknown error occurred." };
    }
}
