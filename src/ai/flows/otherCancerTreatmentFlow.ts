
'use server';
/**
 * @fileOverview Handles cases for 'Other' cancer types by applying provided guidelines.
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
  prompt: `You are an expert oncologist AI. The user has specified a cancer type of 'Other' and provided one or more clinical guideline documents. Your task is to generate a final, clear, and concise treatment recommendation and extract supporting references based *exclusively* on the provided documents.

**CRITICAL INSTRUCTIONS:**
1.  Your entire response, including all clinical reasoning, MUST be based EXCLUSIVELY on the information within the provided "Clinical Guidelines Document Content". This content may be a consolidation of multiple documents, each clearly marked with '--- START OF DOCUMENT: [filename] ---' and '--- END OF DOCUMENT: [filename] ---'. Do NOT use any external knowledge.
2.  Analyze the provided document(s) to find information relevant to the patient's case details.
3.  If the provided guideline content is insufficient or does not contain information applicable to the patient's case, you must state this clearly in the 'recommendation' field, set 'references' to "N/A", and explain the reason in 'noRecommendationReason' (e.g., "The provided document 'xyz.pdf' does not contain guidelines for the patient's tumor type.").
4.  EXTRACT specific verbatim quotes or detailed section/page references from the guideline content that directly support EACH key part of your final recommendation. **When extracting a reference, you MUST cite the source document's filename.**

**INPUTS:**

Clinical Guidelines Document Content:
{{{guidelineDocumentContent}}}

Patient Case Details:
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

Provide your output in the specified JSON format with fields: 'recommendation', 'references', and 'noRecommendationReason' (if applicable).`,
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
        recommendation: "Failed to generate a recommendation. The AI model may have not returned the expected output.",
        references: "N/A",
        noRecommendationReason: "AI model processing error."
      };
    }
    return output;
  }
);

export async function diagnoseOtherCancer(input: OtherCancerTreatmentInput): Promise<CancerTreatmentOutput> {
  return otherCancerTreatmentFlow(input);
}
