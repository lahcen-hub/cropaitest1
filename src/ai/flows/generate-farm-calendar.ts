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

const CalendarEventSchema = z.object({
    week: z.number().describe("The week number of the task, starting from week 1."),
    task: z.string().describe("A brief summary of the task for the week (e.g., 'First Irrigation', 'NPK Fertilization')."),
    instructions: z.string().describe("Detailed instructions for the task, including amounts, methods, and any specific considerations."),
});

const GenerateFarmCalendarOutputSchema = z.object({
  calendar: z.array(CalendarEventSchema).describe('A list of weekly tasks for the farm calendar, covering the entire crop cycle.'),
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

  Based on the crop type, surface area, and location, generate a personalized, week-by-week irrigation and fertilization calendar covering the entire cycle from planting to harvest.

  Crop Type: {{{cropType}}}
  Surface Area: {{{surfaceArea}}} square meters
  Location: {{{location}}}

  - The output must be a structured list of tasks.
  - For each week, provide a clear task summary and detailed instructions.
  - Consider local weather patterns for the given location when creating the schedule.
  - Ensure the response is in the user's preferred language: {{preferredLanguage}}.
  - The calendar should be in a table-friendly format.
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
