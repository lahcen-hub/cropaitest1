'use server';

/**
 * @fileOverview Extracts structured data from an image of an invoice.
 *
 * - extractInvoiceData - A function that handles the invoice data extraction process.
 * - ExtractInvoiceDataInput - The input type for the extractInvoiceData function.
 * - ExtractInvoiceDataOutput - The return type for the extractInvoiceData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { InvoiceDataSchema } from '@/lib/types';

const ExtractInvoiceDataInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An image of an invoice or receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  preferredLanguage: z.enum(['en', 'fr', 'ar']).describe('The preferred language for understanding context, though output should be standardized.'),
});
export type ExtractInvoiceDataInput = z.infer<typeof ExtractInvoiceDataInputSchema>;

export type ExtractInvoiceDataOutput = z.infer<typeof InvoiceDataSchema>;

export async function extractInvoiceData(input: ExtractInvoiceDataInput): Promise<ExtractInvoiceDataOutput> {
  return extractInvoiceDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractInvoiceDataPrompt',
  input: {schema: ExtractInvoiceDataInputSchema},
  output: {schema: InvoiceDataSchema},
  prompt: `You are an expert OCR system specializing in agricultural invoices and receipts for farm expenses. Your task is to analyze the provided image and extract specific information: supplier name, transaction date, items purchased (with quantity, unit, and price), and the total amount.

- Scan the document for the transaction **date** and format it as YYYY-MM-DD.
- Identify the **supplier or vendor name**.
- For each item listed, extract its **name**, **quantity**, **unit**, and **price**.
- Find and extract the **total amount** of the invoice.
- The user's preferred language is {{preferredLanguage}}, which might provide context, but your output must conform to the specified schema.

Analyze this image:
{{media url=photoDataUri}}

Return the supplier, date, total amount, and a list of items with their details.
`,
});

const extractInvoiceDataFlow = ai.defineFlow(
  {
    name: 'extractInvoiceDataFlow',
    inputSchema: ExtractInvoiceDataInputSchema,
    outputSchema: InvoiceDataSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
