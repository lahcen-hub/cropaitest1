
'use server';

/**
 * @fileOverview Extracts structured data from an image of a sales receipt or note.
 *
 * - extractSalesData - A function that handles the sales data extraction process.
 * - ExtractSalesDataInput - The input type for the extractSalesData function.
 * - ExtractSalesDataOutput - The return type for the extractSalesData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { SalesDataSchema } from '@/lib/types';

const ExtractSalesDataInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An image of a sales document (receipt, invoice, or handwritten note), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  preferredLanguage: z.enum(['en', 'fr', 'ar']).describe('The preferred language for understanding context, though output should be standardized.'),
});
export type ExtractSalesDataInput = z.infer<typeof ExtractSalesDataInputSchema>;

export type ExtractSalesDataOutput = z.infer<typeof SalesDataSchema>;

export async function extractSalesData(input: ExtractSalesDataInput): Promise<ExtractSalesDataOutput> {
  return extractSalesDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSalesDataPrompt',
  input: {schema: ExtractSalesDataInputSchema},
  output: {schema: SalesDataSchema},
  prompt: `You are an expert OCR system specializing in agricultural sales documents. Your task is to analyze the provided image and extract all key information.

- Scan the document for the transaction **date** and format it as YYYY-MM-DD.
- Identify the **client or buyer name**.
- For each item/crop listed, extract its **name**.
- For the quantity, specifically look for the value associated with **"Poids net total (kg)"** and extract it for the **quantity** field.
- Extract the **unit** (e.g., kg).
- Extract the **price** (unit price or total price for the line).
- Find and extract the **total amount** of the sale.
- Standardize all crop names into English. For example, 'طماطم' or 'tomates' should become 'tomato'.
- The user's preferred language is {{preferredLanguage}}, which might provide context, but your output must conform to the specified English-based schema.

Analyze this image:
{{media url=photoDataUri}}

Return the transaction date, client name, total amount, and a list of all items with their details.
`,
});

const extractSalesDataFlow = ai.defineFlow(
  {
    name: 'extractSalesDataFlow',
    inputSchema: ExtractSalesDataInputSchema,
    outputSchema: SalesDataSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
