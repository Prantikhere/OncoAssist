
'use server';
/**
 * @fileOverview Generates a Rectal Cancer treatment recommendation with a direct, single-prompt approach.
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

// A single, comprehensive prompt to generate the final recommendation and references directly.
const rectalCancerTreatmentPrompt = ai.definePrompt({
  name: 'rectalCancerTreatmentPrompt',
  input: { schema: RectalCancerTreatmentInputSchema },
  output: { schema: CancerTreatmentOutputSchema },
  prompt: `You are an expert oncologist AI specializing in Rectal Cancer. Your task is to generate a final, clear, and concise treatment recommendation and extract supporting references.

**CRITICAL INSTRUCTIONS:**
1.  Your entire response MUST be based EXCLUSIVELY on the information within the provided "Clinical Guidelines Document Content". Do NOT use any external knowledge.
2.  If the guideline content explicitly states it's unavailable, is a generic placeholder, or does not contain specific information for Rectal Cancer, you MUST state this clearly in the 'recommendation' field and set 'references' to "N/A". Your 'noRecommendationReason' field should explain that the specific guidelines for Rectal Cancer were not provided.
3.  If the guideline content appears relevant, generate a concise, preliminary recommendation based SOLELY on the provided content and the patient's case details.
4.  EXTRACT specific verbatim quotes or detailed section/page references from the guideline content that directly support EACH key part of your final recommendation. These references are crucial.
5.  When analyzing the patient's case, interpret the 'T Stage' to determine the overall cancer stage for finding information within the guidelines. Use this mapping: 'T1' and its sub-variants map to Stage I Cancer; 'T2' maps to Stage II Cancer; 'T3' maps to Stage III Cancer; and 'T4' and its sub-variants (T4a, T4b) map to Stage IV Cancer.

**INPUTS:**

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

Provide your final output in the specified JSON format with fields: 'recommendation', 'references', and 'noRecommendationReason' (if applicable).
For 'references', list each quote or reference clearly. Example: "Guideline Section X.Y states: '...quote...'. Page Z, Paragraph A recommends '...quote...'."`,
});

const rectalCancerTreatmentFlow = ai.defineFlow(
  {
    name: 'rectalCancerTreatmentFlow',
    inputSchema: RectalCancerTreatmentInputSchema,
    outputSchema: CancerTreatmentOutputSchema,
  },
  async (input) => {
    // Handle placeholder guideline content upfront for early exit
    if (input.guidelineDocumentContent.startsWith("Placeholder: No PDF uploaded") || 
        input.guidelineDocumentContent.includes("No guideline document currently available for Rectal Cancer")) {
        return {
            recommendation: "No specific guideline document is currently available for Rectal Cancer to generate a treatment recommendation. Please upload the relevant NCCN (or equivalent) guidelines for Rectal Cancer.",
            references: "N/A",
            noRecommendationReason: "Guideline document for Rectal Cancer is unavailable or a placeholder was provided."
        };
    }
    
    const { output } = await rectalCancerTreatmentPrompt(input);

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

export async function diagnoseRectalCancer(input: RectalCancerTreatmentInput): Promise<CancerTreatmentOutput> {
  return rectalCancerTreatmentFlow(input);
}
