'use server';

/**
 * @fileOverview Generates a personalized irrigation and fertilization calendar for a farm.
 *
 * - generateFarmCalendar - A function that generates the calendar.
 * - GenerateFarmCalendarInput - The input type for the generateFarmCalendar function.
 * - GenerateFarmCalendarOutput - The return type for the generateFarmCalendar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFarmCalendarInputSchema = z.object({
  cropType: z.string().describe('The type of crop being grown (e.g., tomato, potato, citrus).'),
  surfaceArea: z.number().describe('The total surface area of the farm in square meters.'),
  location: z.string().describe('The location of the farm (e.g., city, region).'),
  preferredLanguage: z.enum(['en', 'fr', 'ar']).describe('The preferred language for the calendar.'),
});
export type GenerateFarmCalendarInput = z.infer<typeof GenerateFarmCalendarInputSchema>;

const GenerateFarmCalendarOutputSchema = z.object({
  calendar: z.string().describe('A personalized irrigation and fertilization calendar.'),
});
export type GenerateFarmCalendarOutput = z.infer<typeof GenerateFarmCalendarOutputSchema>;

export async function generateFarmCalendar(input: GenerateFarmCalendarInput): Promise<GenerateFarmCalendarOutput> {
  return generateFarmCalendarFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFarmCalendarPrompt',
  input: {schema: GenerateFarmCalendarInputSchema},
  output: {schema: GenerateFarmCalendarOutputSchema},
  prompt: `You are an expert agricultural advisor.

  Based on the crop type, surface area, and location, generate a personalized irrigation and fertilization calendar.

  Crop Type: {{{cropType}}}
  Surface Area: {{{surfaceArea}}} square meters
  Location: {{{location}}}

  The calendar should include specific dates and amounts for irrigation and fertilization.
  Consider local weather conditions when creating the calendar.
  Provide the calendar in a clear and easy-to-understand format.
  Respond in {{preferredLanguage}}.
`,
});

const generateFarmCalendarFlow = ai.defineFlow(
  {
    name: 'generateFarmCalendarFlow',
    inputSchema: GenerateFarmCalendarInputSchema,
    outputSchema: GenerateFarmCalendarOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
