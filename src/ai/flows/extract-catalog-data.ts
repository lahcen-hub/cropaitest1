'use server';

/**
 * @fileOverview Extracts structured product data from a catalog image or PDF.
 *
 * - extractCatalogData - A function that handles the catalog data extraction process.
 * - ExtractCatalogDataInput - The input type for the extractCatalogData function.
 * - ExtractCatalogDataOutput - The return type for the extractCatalogData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ProductSchema, PRODUCT_CATEGORIES } from '@/lib/types';

const ExtractCatalogDataInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "An image or PDF of a product catalog, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  preferredLanguage: z.enum(['en', 'fr', 'ar']).describe('The preferred language for understanding context, though output should be standardized.'),
});
export type ExtractCatalogDataInput = z.infer<typeof ExtractCatalogDataInputSchema>;

const CatalogDataSchema = z.object({
    products: z.array(ProductSchema.omit({ id: true, photoDataUri: true }))
}).describe('A list of products extracted from the catalog.');

export type ExtractCatalogDataOutput = z.infer<typeof CatalogDataSchema>;

export async function extractCatalogData(input: ExtractCatalogDataInput): Promise<ExtractCatalogDataOutput> {
  return extractCatalogDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractCatalogDataPrompt',
  input: {schema: ExtractCatalogDataInputSchema},
  output: {schema: CatalogDataSchema},
  prompt: `You are an expert OCR system specializing in agricultural product catalogs. Your task is to analyze the provided document (image or PDF) and extract a list of all products.

For each product, extract the following information:
- **name**: The name of the product.
- **category**: Classify the product into one of these categories: ${PRODUCT_CATEGORIES.join(', ')}. If unsure, classify as 'other'.
- **price**: The price of the product.
- **unit**: The unit of sale (e.g., 'kg', 'L', 'sac', 'unité').
- **description**: A brief description if available.

The user's preferred language is {{preferredLanguage}}, which might provide context, but your output must conform to the specified schema.

Analyze this document:
{{media url=documentDataUri}}

Return a list of all products found with their details.
`,
});

const extractCatalogDataFlow = ai.defineFlow(
  {
    name: 'extractCatalogDataFlow',
    inputSchema: ExtractCatalogDataInputSchema,
    outputSchema: CatalogDataSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
