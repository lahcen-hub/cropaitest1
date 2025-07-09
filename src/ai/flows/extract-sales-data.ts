
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
  prompt: `You are an expert OCR system specializing in agricultural sales documents. Your task is to analyze the provided image and extract structured data. The image could be a printed receipt, an invoice, or a handwritten sales note.

- Carefully identify each line item in the document.
- For each item, extract the crop name, quantity, and unit (e.g., kg, box, ton).
- Standardize all crop names into English. For example, 'طماطم' or 'tomates' should become 'tomato'.
- Extract the transaction date (in YYYY-MM-DD format). If the date is not present, omit the field.
- The user's preferred language is {{preferredLanguage}}, which might provide context, but your output must conform to the specified English-based schema.
- Do not extract any prices, totals, currency, or vendor information.

Analyze this image:
{{media url=photoDataUri}}

Return the extracted information in the required JSON format.
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
