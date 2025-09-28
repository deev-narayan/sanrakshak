// src/ai/flows/suggest-species-alternatives.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest alternative species names if the user input is not in the approved list.
 *
 * It exports:
 * - `suggestSpeciesAlternatives`: An async function that takes a species name and returns a list of suggested alternatives.
 * - `SuggestSpeciesAlternativesInput`: The input type for the suggestSpeciesAlternatives function.
 * - `SuggestSpeciesAlternativesOutput`: The output type for the suggestSpeciesAlternatives function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestSpeciesAlternativesInputSchema = z.object({
  species: z.string().describe('The species name entered by the user.'),
});
export type SuggestSpeciesAlternativesInput = z.infer<typeof SuggestSpeciesAlternativesInputSchema>;

const SuggestSpeciesAlternativesOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A suggested alternative species name.')
  ).describe('A list of suggested alternative species names.')
});
export type SuggestSpeciesAlternativesOutput = z.infer<typeof SuggestSpeciesAlternativesOutputSchema>;

export async function suggestSpeciesAlternatives(input: SuggestSpeciesAlternativesInput): Promise<SuggestSpeciesAlternativesOutput> {
  return suggestSpeciesAlternativesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSpeciesAlternativesPrompt',
  input: { schema: SuggestSpeciesAlternativesInputSchema },
  output: { schema: SuggestSpeciesAlternativesOutputSchema },
  prompt: `You are a helpful assistant that suggests alternative species names based on user input.

The user has entered the following species name: {{{species}}}

Suggest a list of alternative species names that are similar to the user input. Only suggest species from the following valid list: Ashwagandha, Brahmi, Tulsi, Neem, Turmeric, Ginger.  Do not include the original input in the list.

Return a JSON object with a "suggestions" field containing the array of suggested species names. Do not include any other explanatory text. Be concise.
`
});

const suggestSpeciesAlternativesFlow = ai.defineFlow(
  {
    name: 'suggestSpeciesAlternativesFlow',
    inputSchema: SuggestSpeciesAlternativesInputSchema,
    outputSchema: SuggestSpeciesAlternativesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
