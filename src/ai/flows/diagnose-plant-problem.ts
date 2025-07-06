// diagnose-plant-problem.ts
'use server';

/**
 * @fileOverview Diagnoses plant problems based on an image and provides treatment suggestions.
 *
 * - diagnosePlantProblem - A function that handles the plant problem diagnosis process.
 * - DiagnosePlantProblemInput - The input type for the diagnosePlantProblem function.
 * - DiagnosePlantProblemOutput - The return type for the diagnosePlantProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantProblemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the plant with the problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  preferredLanguage: z.enum(['en', 'fr', 'ar']).describe('The preferred language for the diagnosis and treatment suggestions.'),
  crops: z.array(z.string()).describe('The crops that the user grows.')
});
export type DiagnosePlantProblemInput = z.infer<typeof DiagnosePlantProblemInputSchema>;

const DiagnosePlantProblemOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the plant problem.'),
  treatment: z.string().describe('Treatment suggestions for the diagnosed problem.'),
});
export type DiagnosePlantProblemOutput = z.infer<typeof DiagnosePlantProblemOutputSchema>;

export async function diagnosePlantProblem(input: DiagnosePlantProblemInput): Promise<DiagnosePlantProblemOutput> {
  return diagnosePlantProblemFlow(input);
}

const diagnosePlantProblemPrompt = ai.definePrompt({
  name: 'diagnosePlantProblemPrompt',
  input: {schema: DiagnosePlantProblemInputSchema},
  output: {schema: DiagnosePlantProblemOutputSchema},
  prompt: `You are an expert in plant pathology. You will analyze the provided image of a plant and provide a diagnosis of any potential diseases or pests, as well as treatment suggestions in the user's preferred language.

  The user grows the following crops: {{crops}}

  Analyze the following image and provide a diagnosis and treatment:
  {{media url=photoDataUri}}

  Respond in {{preferredLanguage}}.`,
});

const diagnosePlantProblemFlow = ai.defineFlow(
  {
    name: 'diagnosePlantProblemFlow',
    inputSchema: DiagnosePlantProblemInputSchema,
    outputSchema: DiagnosePlantProblemOutputSchema,
  },
  async input => {
    const {output} = await diagnosePlantProblemPrompt(input);
    return output!;
  }
);
