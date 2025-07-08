'use server';

/**
 * @fileOverview Analyzes a soil report to generate a personalized irrigation and fertilization schedule.
 *
 * - generateScheduleFromSoil - A function that handles the soil analysis and schedule generation process.
 * - GenerateScheduleFromSoilInput - The input type for the function.
 * - GenerateScheduleFromSoilOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateScheduleFromSoilInputSchema = z.object({
  soilReportDataUri: z
    .string()
    .describe(
      "An image of the soil analysis report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  cropType: z.string().describe('The type of crop this schedule is for (e.g., tomato, potato).'),
  surfaceArea: z.number().describe('The total surface area of the farm in square meters.'),
  location: z.string().describe('The location of the farm (e.g., city, region).'),
  preferredLanguage: z.enum(['en', 'fr', 'ar']).describe('The preferred language for the generated schedules and analysis.'),
});
export type GenerateScheduleFromSoilInput = z.infer<typeof GenerateScheduleFromSoilInputSchema>;


const SoilParameterSchema = z.object({
    parameter: z.string().describe("The name of the soil parameter (e.g., 'pH', 'Nitrogen (N)')."),
    value: z.string().describe("The value of the parameter as extracted from the report."),
    status: z.enum(['low', 'ideal', 'high', 'n/a']).describe("The interpretation of the parameter's level for the selected crop."),
});

const SoilAnalysisSchema = z.object({
    interpretation: z.string().describe("A brief, high-level summary interpreting the soil analysis results for the specified crop."),
    parameters: z.array(SoilParameterSchema).describe("A list of key soil parameters extracted from the report."),
});

const ScheduleEventSchema = z.object({
    week: z.number().describe("The week number of the task, starting from week 1."),
    task: z.string().describe("A brief summary of the task for the week (e.g., 'First Irrigation', 'NPK Fertilization')."),
    instructions: z.string().describe("Detailed instructions for the task, including amounts, methods, and any specific considerations based on the soil analysis."),
});

const GenerateScheduleFromSoilOutputSchema = z.object({
  soilAnalysis: SoilAnalysisSchema,
  fertilizationSchedule: z.array(ScheduleEventSchema).describe('A list of weekly fertilization tasks, covering the entire crop cycle.'),
  irrigationSchedule: z.array(ScheduleEventSchema).describe('A list of weekly irrigation tasks, covering the entire crop cycle.'),
});
export type GenerateScheduleFromSoilOutput = z.infer<typeof GenerateScheduleFromSoilOutputSchema>;


export async function generateScheduleFromSoil(input: GenerateScheduleFromSoilInput): Promise<GenerateScheduleFromSoilOutput> {
  return generateScheduleFromSoilFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateScheduleFromSoilPrompt',
  input: {schema: GenerateScheduleFromSoilInputSchema},
  output: {schema: GenerateScheduleFromSoilOutputSchema},
  prompt: `You are an expert agronomist specializing in soil science and crop management. Your task is to analyze an uploaded soil analysis report image, extract key data, interpret it, and generate personalized irrigation and fertilization schedules.

**Input Details:**
- **Crop Type:** {{{cropType}}}
- **Surface Area:** {{{surfaceArea}}} square meters
- **Location:** {{{location}}}
- **Language:** {{preferredLanguage}}
- **Soil Report Image:** {{media url=soilReportDataUri}}

**Instructions:**

1.  **OCR and Data Extraction:**
    - Analyze the provided image of the soil report.
    - Extract the following key parameters: pH, EC (Electrical Conductivity), Nitrogen (N), Phosphorus (P), Potassium (K), Organic Matter (%), and Soil Type/Texture (e.g., Loamy, Sandy, Clay).
    - If a value is not present in the report, do not include it in the parameters list.

2.  **Interpretation & Analysis:**
    - For each extracted parameter, determine if its value is 'low', 'ideal', or 'high' for the specified **{{{cropType}}}**. If you cannot determine the status, use 'n/a'.
    - Provide a concise, high-level **interpretation** summarizing the soil's condition and its suitability for the crop. For example: "The soil has a neutral pH, ideal for tomatoes. Nitrogen levels are low, which will require supplementation. The sandy texture will affect water retention."

3.  **Generate Fertilization Schedule:**
    - Create a week-by-week fertilization plan for the entire crop cycle, from planting to harvest.
    - The schedule must be tailored to the extracted soil analysis results and the specific needs of the **{{{cropType}}}**.
    - For each week, specify the task (e.g., "Apply NPK 10-20-10"), and detailed instructions including the amount of fertilizer (e.g., in kg/hectare) and the application method.

4.  **Generate Irrigation Schedule:**
    - Create a week-by-week irrigation plan.
    - This plan must be adjusted based on the soil's texture (e.g., sandy soils require more frequent, shorter irrigation cycles).
    - Provide clear instructions on frequency and duration.

5.  **Final Output:**
    - Ensure all text in the final output (interpretation, tasks, instructions, etc.) is in the user's preferred language: **{{preferredLanguage}}**.
    - Structure the entire response according to the required JSON output schema.`,
});

const generateScheduleFromSoilFlow = ai.defineFlow(
  {
    name: 'generateScheduleFromSoilFlow',
    inputSchema: GenerateScheduleFromSoilInputSchema,
    outputSchema: GenerateScheduleFromSoilOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
