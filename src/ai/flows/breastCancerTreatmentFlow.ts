
'use server';
/**
 * @fileOverview Generates a Breast Cancer treatment recommendation with a direct, single-prompt approach.
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

// A single, comprehensive prompt to generate the final recommendation and references directly.
const breastCancerTreatmentPrompt = ai.definePrompt({
  name: 'breastCancerTreatmentPrompt',
  input: { schema: BreastCancerTreatmentInputSchema },
  output: { schema: CancerTreatmentOutputSchema },
  prompt: `You are an expert oncologist AI specializing in Breast Cancer. Your task is to generate a final, clear, and concise treatment recommendation and extract supporting references.

**CRITICAL INSTRUCTIONS:**
1.  Your entire response, including all clinical reasoning, MUST be based EXCLUSIVELY on the information within the provided "Clinical Guidelines Document Content". This content may be a consolidation of multiple documents, each clearly marked with '--- START OF DOCUMENT: [filename] ---' and '--- END OF DOCUMENT: [filename] ---'. Do NOT use any external knowledge.
2.  This includes determining the patient's cancer stage. You must find the relevant staging definitions within the provided guideline documents based on the patient's T and N stage data to inform your recommendation. Do NOT assume any T-stage to Cancer-Stage mappings.
3.  If the guideline content is insufficient to make a recommendation (e.g., staging information is missing from the document), you must state this clearly in the 'recommendation' field, set 'references' to "N/A", and explain the reason in 'noRecommendationReason'.
4.  EXTRACT specific verbatim quotes or detailed section/page references from the guideline content that directly support EACH key part of your final recommendation. **When extracting a reference, you MUST cite the source document's filename.** These references are crucial.

**INPUTS:**

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

Provide your final output in the specified JSON format with fields: 'recommendation', 'references', and 'noRecommendationReason' (if applicable).
For 'references', list each quote or reference clearly, citing the source document. Example: "From 'NCCN_Breast_v2_2023.pdf', Section X.Y states: '...quote...'."`,
});

const breastCancerTreatmentFlow = ai.defineFlow(
  {
    name: 'breastCancerTreatmentFlow',
    inputSchema: BreastCancerTreatmentInputSchema,
    outputSchema: CancerTreatmentOutputSchema,
  },
  async (input) => {
    const { output } = await breastCancerTreatmentPrompt(input);

    if (!output) {
      return {
        recommendation: "Failed to generate a recommendation. The AI model may have not returned the expected output.",
        references: "N/A",
        noRecommendationReason: "Error in AI model processing."
      };
    }
    
    return output;
  }
);

export async function diagnoseBreastCancer(input: BreastCancerTreatmentInput): Promise<CancerTreatmentOutput> {
  return breastCancerTreatmentFlow(input);
}
