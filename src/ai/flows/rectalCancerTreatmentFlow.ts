
'use server';
/**
 * @fileOverview Generates a Rectal Cancer treatment recommendation. (Simplified for now, can be expanded like ColonCancer)
 *
 * - diagnoseRectalCancer - A function that handles the Rectal Cancer diagnosis and recommendation process.
 * - RectalCancerTreatmentInput - The input type (defined in treatmentFlowTypes.ts).
 * - CancerTreatmentOutput - The return type (defined in treatmentFlowTypes.ts).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { 
  RectalCancerTreatmentInputSchema, 
  type RectalCancerTreatmentInput,
  CancerTreatmentOutputSchema,
  type CancerTreatmentOutput 
} from './treatmentFlowTypes';

// Simplified prompt for Rectal Cancer, similar to Breast Cancer for now
// Can be expanded with iterative logic like ColonCancerTreatmentFlow later.
const rectalCancerPrompt = ai.definePrompt({
  name: 'rectalCancerGuidelineCheckPrompt',
  input: { schema: RectalCancerTreatmentInputSchema },
  output: { schema: CancerTreatmentOutputSchema },
  prompt: `You are an AI assistant for oncologists.
Based on the following patient case details and the provided Clinical Guidelines Document Content for Rectal Cancer:

IF the 'guidelineDocumentContent' explicitly states 'No guideline document currently available for Rectal Cancer' OR if it is a generic placeholder and does not appear to contain specific, relevant guideline information for Rectal Cancer,
THEN:
  - The 'recommendation' field MUST state: "No specific guideline document is currently available for Rectal Cancer. Please upload relevant guidelines."
  - The 'references' field MUST be "N/A".
  - The 'noRecommendationReason' field MUST explain this.
ELSE (relevant guideline content is provided):
  - Generate a concise recommendation based SOLELY on this content and patient details.
  - For 'references', state "References to be fully implemented based on specific guideline content." or extract key phrases.
  - 'noRecommendationReason' can be omitted or state "Recommendation based on simulated guidelines."

Clinical Guidelines Document Content:
{{{guidelineDocumentContent}}}

Patient Case Details for Rectal Cancer:
Cancer Type: {{{cancerType}}}
Diagnostic Confirmation: {{{diagnosticConfirmation}}}
Staging Evaluation: {{{stagingEvaluation}}}
Disease Extent: {{{diseaseExtent}}}
Surgical Procedure: {{{surgicalProcedure}}}
Lymph Node Assessment: {{{lymphNodeAssessment}}}
Post-Surgery Analysis: {{{postSurgeryAnalysis}}}
Tumor Type: {{{tumorType}}}
Grade: {{{grade}}}
T Stage: {{{tStage}}}
N Stage: {{{nStage}}}
{{#if vascularLymphaticInvasion}}
Vascular/Lymphatic Invasion: Yes
{{else}}
Vascular/Lymphatic Invasion: No
{{/if}}

Provide your output in the specified JSON format.`,
});

const rectalCancerTreatmentFlow = ai.defineFlow(
  {
    name: 'rectalCancerTreatmentFlow',
    inputSchema: RectalCancerTreatmentInputSchema,
    outputSchema: CancerTreatmentOutputSchema,
  },
  async (input) => {
    const { output } = await rectalCancerPrompt(input);
     if (!output) {
      return {
        recommendation: "Error: AI model did not return an output for Rectal Cancer.",
        references: "N/A",
        noRecommendationReason: "AI model processing error."
      };
    }
    return {
        recommendation: output.recommendation || "No recommendation generated.",
        references: output.references || (output.noRecommendationReason ? "N/A" : "No specific references extracted."),
        noRecommendationReason: output.noRecommendationReason
    };
  }
);

export async function diagnoseRectalCancer(input: RectalCancerTreatmentInput): Promise<CancerTreatmentOutput> {
  return rectalCancerTreatmentFlow(input);
}
