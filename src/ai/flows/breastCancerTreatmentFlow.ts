
'use server';
/**
 * @fileOverview Generates a Breast Cancer treatment recommendation, primarily handling cases with missing guidelines.
 *
 * - diagnoseBreastCancer - A function that handles the Breast Cancer diagnosis and recommendation process.
 * - BreastCancerTreatmentInput - The input type (defined in treatmentFlowTypes.ts).
 * - CancerTreatmentOutput - The return type (defined in treatmentFlowTypes.ts).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { 
  BreastCancerTreatmentInputSchema, 
  type BreastCancerTreatmentInput,
  CancerTreatmentOutputSchema,
  type CancerTreatmentOutput 
} from './treatmentFlowTypes';

// Simplified prompt for Breast Cancer, focusing on guideline availability
const breastCancerPrompt = ai.definePrompt({
  name: 'breastCancerGuidelineCheckPrompt',
  input: { schema: BreastCancerTreatmentInputSchema },
  output: { schema: CancerTreatmentOutputSchema },
  prompt: `You are an AI assistant for oncologists.
The user has provided case details for Breast Cancer and the content of a clinical guideline document.

Your primary task is to check the 'guidelineDocumentContent'.
IF the 'guidelineDocumentContent' explicitly states 'No guideline document currently available for Breast Cancer' OR if it is a generic placeholder (e.g., starts with 'Placeholder: No PDF uploaded...') AND it does not appear to contain specific, relevant guideline information for Breast Cancer,
THEN:
  - The 'recommendation' field MUST state clearly: "No specific guideline document is currently available for Breast Cancer to generate a treatment recommendation. Please upload the relevant NCCN (or equivalent) guidelines for Breast Cancer."
  - The 'references' field MUST be "N/A".
  - The 'noRecommendationReason' field MUST explain that the specific guidelines for Breast Cancer were not provided.
ELSE (if relevant guideline content seems to be provided, even if simulated but specific to Breast Cancer):
  - Generate a concise, preliminary recommendation based SOLELY on this provided content and the patient's case details.
  - For 'references', state "References to be fully implemented based on specific guideline content." or extract key phrases if obvious.
  - 'noRecommendationReason' can be omitted or state "Recommendation based on simulated guidelines."

Clinical Guidelines Document Content:
{{{guidelineDocumentContent}}}

Patient Case Details for Breast Cancer:
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

const breastCancerTreatmentFlow = ai.defineFlow(
  {
    name: 'breastCancerTreatmentFlow',
    inputSchema: BreastCancerTreatmentInputSchema,
    outputSchema: CancerTreatmentOutputSchema,
  },
  async (input) => {
    const { output } = await breastCancerPrompt(input);
    if (!output) {
      return {
        recommendation: "Error: AI model did not return an output for Breast Cancer.",
        references: "N/A",
        noRecommendationReason: "AI model processing error."
      };
    }
    // Ensure all fields are present, even if some are default/fallback values from the prompt's logic
    return {
        recommendation: output.recommendation || "No recommendation generated.",
        references: output.references || (output.noRecommendationReason ? "N/A" : "No specific references extracted."),
        noRecommendationReason: output.noRecommendationReason
    };
  }
);

export async function diagnoseBreastCancer(input: BreastCancerTreatmentInput): Promise<CancerTreatmentOutput> {
  return breastCancerTreatmentFlow(input);
}
