'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing key findings from lab reports.
 *
 * The flow takes a list of report contents as input and returns a summarized report highlighting
 * potential issues or trends across multiple batches.
 *
 * @exports summarizeLabReports - The main function to trigger the report summarization flow.
 * @exports SummarizeLabReportsInput - The input type for the summarizeLabReports function.
 * @exports SummarizeLabReportsOutput - The output type for the summarizeLabReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLabReportsInputSchema = z.object({
  reportContents: z.array(z.string()).describe('An array of lab report contents to summarize.'),
});
export type SummarizeLabReportsInput = z.infer<typeof SummarizeLabReportsInputSchema>;

const SummarizeLabReportsOutputSchema = z.object({
  summary: z.string().describe('A summarized report highlighting key findings and potential issues.'),
});
export type SummarizeLabReportsOutput = z.infer<typeof SummarizeLabReportsOutputSchema>;

export async function summarizeLabReports(input: SummarizeLabReportsInput): Promise<SummarizeLabReportsOutput> {
  return summarizeLabReportsFlow(input);
}

const summarizeLabReportsPrompt = ai.definePrompt({
  name: 'summarizeLabReportsPrompt',
  input: {schema: SummarizeLabReportsInputSchema},
  output: {schema: SummarizeLabReportsOutputSchema},
  prompt: `You are an AI assistant helping regulators quickly identify potential issues or trends across multiple batches of Ayurvedic herbs.
  Please summarize the key findings from the following lab reports, highlighting any concerning pesticide levels, moisture content, or other relevant data that may indicate a problem. The reports are provided as an array of strings.
  \nReports:\n{{#each reportContents}}- {{{this}}}\n{{/each}}
  \nSummary:`,
});

const summarizeLabReportsFlow = ai.defineFlow(
  {
    name: 'summarizeLabReportsFlow',
    inputSchema: SummarizeLabReportsInputSchema,
    outputSchema: SummarizeLabReportsOutputSchema,
  },
  async input => {
    const {output} = await summarizeLabReportsPrompt(input);
    return output!;
  }
);
