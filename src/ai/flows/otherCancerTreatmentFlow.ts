
'use server';
/**
 * @fileOverview Handles cases for 'Other' cancer types, typically indicating missing specific guidelines.
 *
 * - diagnoseOtherCancer - A function that handles the 'Other' cancer type scenario.
 * - OtherCancerTreatmentInput - The input type (defined in treatmentFlowTypes.ts).
 * - CancerTreatmentOutput - The return type (defined in treatmentFlowTypes.ts).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { 
  OtherCancerTreatmentInputSchema, 
  type OtherCancerTreatmentInput,
  CancerTreatmentOutputSchema,
  type CancerTreatmentOutput 
} from './treatmentFlowTypes';

const otherCancerPrompt = ai.definePrompt({
  name: 'otherCancerGuidelinePrompt',
  input: { schema: OtherCancerTreatmentInputSchema },
  output: { schema: CancerTreatmentOutputSchema },
  prompt: `You are an AI assistant. The user has selected 'Other' as the cancer type.
This typically means specific guidelines for this cancer type are not yet integrated or a specific document was not uploaded.

Your response should be:
- 'recommendation': "Cannot provide a specific treatment recommendation for 'Other' cancer types without a relevant uploaded NCCN (or equivalent) clinical guideline document. Please specify the cancer type if known and upload corresponding guidelines."
- 'references': "N/A"
- 'noRecommendationReason': "Guidelines for 'Other' unspecified cancer types are not available or a specific document was not provided."

The 'guidelineDocumentContent' provided by the user for 'Other' cancer type was:
{{{guidelineDocumentContent}}}

Patient Case Details (for context, but recommendation should be generic as above):
Cancer Type: {{{cancerType}}}
Diagnostic Confirmation: {{{diagnosticConfirmation}}}
Staging Evaluation: {{{stagingEvaluation}}}
Disease Extent: {{{diseaseExtent}}}
Surgical Procedure: {{{surgicalProcedure}}}

Provide your output in the specified JSON format.`,
});

const otherCancerTreatmentFlow = ai.defineFlow(
  {
    name: 'otherCancerTreatmentFlow',
    inputSchema: OtherCancerTreatmentInputSchema,
    outputSchema: CancerTreatmentOutputSchema,
  },
  async (input) => {
    const { output } = await otherCancerPrompt(input);
    if (!output) {
      return {
        recommendation: "Error: AI model did not return an output for 'Other' cancer type.",
        references: "N/A",
        noRecommendationReason: "AI model processing error."
      };
    }
     return {
        recommendation: output.recommendation || "Cannot provide a specific treatment recommendation for 'Other' cancer types without a relevant uploaded NCCN (or equivalent) clinical guideline document.",
        references: output.references || "N/A",
        noRecommendationReason: output.noRecommendationReason || "Guidelines for 'Other' unspecified cancer types are not available or a specific document was not provided."
    };
  }
);

export async function diagnoseOtherCancer(input: OtherCancerTreatmentInput): Promise<CancerTreatmentOutput> {
  return otherCancerTreatmentFlow(input);
}
