'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing intelligent event suggestions to users based on their profile and past activity.
 *
 * - `suggestEvents` - A function that takes a user profile and past events as input and returns a list of suggested events.
 * - `SuggestedEventsInput` - The input type for the `suggestEvents` function.
 * - `SuggestedEventsOutput` - The return type for the `suggestEvents` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedEventsInputSchema = z.object({
  userProfile: z
    .string()
    .describe('A description of the user profile including interests, role, and any other relevant information.'),
  pastEvents: z
    .string()
    .describe('A list of past events the user has attended or shown interest in.'),
  allEvents: z.string().describe('A comprehensive list of all available events.'),
});
export type SuggestedEventsInput = z.infer<typeof SuggestedEventsInputSchema>;

const SuggestedEventsOutputSchema = z.object({
  suggestedEvents: z
    .string()
    .describe('A list of suggested events tailored to the user based on their profile and past activity.'),
});
export type SuggestedEventsOutput = z.infer<typeof SuggestedEventsOutputSchema>;

export async function suggestEvents(input: SuggestedEventsInput): Promise<SuggestedEventsOutput> {
  return suggestedEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEventsPrompt',
  input: {schema: SuggestedEventsInputSchema},
  output: {schema: SuggestedEventsOutputSchema},
  prompt: `You are an event recommendation system. You will receive a user profile, a list of past events they have shown interest in, and a list of all available events.

  Based on this information, you will provide a list of suggested events that are most relevant to the user.

  User Profile: {{{userProfile}}}
  Past Events: {{{pastEvents}}}
  All Events: {{{allEvents}}}

  Suggested Events:`,
});

const suggestedEventsFlow = ai.defineFlow(
  {
    name: 'suggestEventsFlow',
    inputSchema: SuggestedEventsInputSchema,
    outputSchema: SuggestedEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
