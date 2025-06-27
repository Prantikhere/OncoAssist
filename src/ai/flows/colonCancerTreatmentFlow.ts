
'use server';
/**
 * @fileOverview Generates a Colon Cancer treatment recommendation with a direct, single-prompt approach.
 *
 * - diagnoseColonCancer - A function that handles the Colon Cancer diagnosis and recommendation process.
 * - ColonCancerTreatmentInput - The input type (defined in treatmentFlowTypes.ts).
 * - CancerTreatmentOutput - The return type (defined in treatmentFlowTypes.ts).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { 
  ColonCancerTreatmentInputSchema, 
  type ColonCancerTreatmentInput,
  CancerTreatmentOutputSchema,
  type CancerTreatmentOutput 
} from './treatmentFlowTypes';

// A single, comprehensive prompt to generate the final recommendation and references directly.
const colonCancerTreatmentPrompt = ai.definePrompt({
  name: 'colonCancerTreatmentPrompt',
  input: { schema: ColonCancerTreatmentInputSchema },
  output: { schema: CancerTreatmentOutputSchema },
  prompt: `You are an expert oncologist AI specializing in Colon Cancer. Your task is to generate a final, clear, and concise treatment recommendation and extract supporting references.

**CRITICAL INSTRUCTIONS:**
1.  Your entire response MUST be based EXCLUSIVELY on the information within the provided "Clinical Guidelines Document Content". Do NOT use any external knowledge.
2.  If the guideline content explicitly states it's unavailable or is a placeholder, you must state this clearly in the 'recommendation' field and set 'references' to "N/A".
3.  EXTRACT specific verbatim quotes or detailed section/page references from the guideline content that directly support EACH key part of your final recommendation. These references are crucial.

**SPECIFIC RECOMMENDATION LOGIC TO APPLY:**
- **For Stage III Adenocarcinoma (any T, N1/N2):** If adjuvant chemotherapy (like FOLFOX or CAPOX/XELOX) is recommended by the guidelines, you MUST specify the typical duration or number of cycles mentioned in the document. For example, "Adjuvant chemotherapy with FOLFOX (for 6 months) or CAPOX (for 3-6 months) is recommended." This detail is critical.
- **For Neuroendocrine Tumor (NET):** If the tumorType is 'Neuroendocrine Tumor', grade is 'Well Differentiated (G1)', and the disease is localized/resected, the standard recommendation is surveillance if the guidelines support it. Your recommendation should clearly state this, for example: "For a resected, localized, well-differentiated (G1) neuroendocrine tumor, adjuvant therapy is generally not recommended. The standard of care is surveillance."

**INPUTS:**

Clinical Guidelines Document Content:
{{{guidelineDocumentContent}}}

Patient Case Details for Colon Cancer:
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


// The Flow
const colonCancerTreatmentFlow = ai.defineFlow(
  {
    name: 'colonCancerTreatmentFlow',
    inputSchema: ColonCancerTreatmentInputSchema,
    outputSchema: CancerTreatmentOutputSchema,
  },
  async (input) => {
    // Handle placeholder guideline content upfront for early exit
    if (input.guidelineDocumentContent.startsWith("Placeholder: No PDF uploaded") || 
        input.guidelineDocumentContent.includes("No guideline document currently available for Colon Cancer")) {
        return {
            recommendation: "No specific guideline document is currently available for Colon Cancer to generate a treatment recommendation. Please upload the relevant NCCN (or equivalent) guidelines for Colon Cancer.",
            references: "N/A",
            noRecommendationReason: "Guideline document for Colon Cancer is unavailable or a placeholder was provided."
        };
    }

    // Step 1: Generate the final recommendation and references in a single call.
    const { output } = await colonCancerTreatmentPrompt(input);

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

export async function diagnoseColonCancer(input: ColonCancerTreatmentInput): Promise<CancerTreatmentOutput> {
  return colonCancerTreatmentFlow(input);
}
