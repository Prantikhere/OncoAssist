
'use server';
/**
 * @fileOverview Generates a Colon Cancer treatment recommendation with iterative refinement and document referencing.
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

// Step 1: Draft Recommendation Prompt
const draftPrompt = ai.definePrompt({
  name: 'colonCancerDraftPrompt',
  input: { schema: ColonCancerTreatmentInputSchema },
  output: { schema: z.object({ draftRecommendation: z.string() }) },
  prompt: `You are an expert oncologist specializing in Colon Cancer.
Based on the following patient case details and the provided Clinical Guidelines Document Content, generate a DRAFT treatment recommendation.
Your DRAFT should be concise and directly address the key aspects of the case based SOLELY on the guidelines. Do not use any external knowledge or information outside of the provided document.

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

Provide only the DRAFT recommendation text.`,
});

// Step 2: Refine Recommendation and Extract References Prompt
const refineAndReferencePrompt = ai.definePrompt({
  name: 'colonCancerRefineAndReferencePrompt',
  input: { schema: z.object({ 
    draftRecommendation: z.string(), 
    originalInput: ColonCancerTreatmentInputSchema 
  }) },
  output: { schema: CancerTreatmentOutputSchema },
  prompt: `You are an expert oncologist reviewing a DRAFT treatment recommendation for Colon Cancer.
Your task is to:
1. REVIEW the DRAFT Recommendation against the provided Clinical Guidelines Document Content and the original patient case details.
2. REFINE the DRAFT into a final, clear, and concise recommendation, following the specific logic below. Your final recommendation must be derived EXCLUSIVELY from the information within the provided guideline document.
3. EXTRACT specific verbatim quotes or detailed section/page references from the Clinical Guidelines Document Content that directly support EACH key part of your final recommendation. These references are crucial.
4. If the Clinical Guidelines Document Content explicitly states 'No guideline document currently available for Colon Cancer' or is a generic placeholder, the 'recommendation' MUST state clearly: "No specific guideline document is currently available for Colon Cancer to generate a treatment recommendation. Please upload the relevant NCCN (or equivalent) guidelines for Colon Cancer." The 'references' field should be "N/A", and 'noRecommendationReason' should explain this.
5. If the guidelines are present but insufficient, state this clearly.

**Specific Recommendation Logic:**

- **For Stage III Adenocarcinoma (any T, N1/N2):**
  - If adjuvant chemotherapy (like FOLFOX or CAPOX/XELOX) is recommended, you MUST specify the typical duration or number of cycles. For example, "Adjuvant chemotherapy with FOLFOX (for 6 months) or CAPOX (for 3-6 months, depending on risk factors) is recommended." This detail is critical.

- **For Neuroendocrine Tumor (NET):**
  - If the tumorType is 'Neuroendocrine Tumor' and grade is 'Well Differentiated (G1)' and the disease is localized/resected (e.g., Stage I-III), the standard recommendation is observation. Your recommendation should clearly state this, for example: "For a resected, localized, well-differentiated (G1) neuroendocrine tumor, adjuvant therapy is generally not recommended. The standard of care is surveillance with periodic imaging and blood work."

- **General Guidance:**
  - Always consider the combination of T stage, N stage, tumor type, and grade to provide the most specific recommendation possible based on the provided guideline content.

Clinical Guidelines Document Content:
{{{originalInput.guidelineDocumentContent}}}

Original Patient Case Details for Colon Cancer:
Cancer Type: {{{originalInput.cancerType}}}
Diagnostic Confirmation: {{{originalInput.diagnosticConfirmation}}}
Staging Evaluation: {{{originalInput.stagingEvaluation}}}
Disease Extent: {{{originalInput.diseaseExtent}}}
Surgical Procedure: {{{originalInput.surgicalProcedure}}}
Lymph Node Assessment: {{{originalInput.lymphNodeAssessment}}}
Post-Surgery Analysis: {{{originalInput.postSurgeryAnalysis}}}
Tumor Type: {{{originalInput.tumorType}}}
Grade: {{{originalInput.grade}}}
T Stage: {{{originalInput.tStage}}}
N Stage: {{{originalInput.nStage}}}
{{#if originalInput.vascularLymphaticInvasion}}
Vascular/Lymphatic Invasion: Yes
{{else}}
Vascular/Lymphatic Invasion: No
{{/if}}

DRAFT Recommendation to Review:
"{{{draftRecommendation}}}"

Provide your output in the specified JSON format with fields: 'recommendation', 'references', and 'noRecommendationReason' (if applicable).
For 'references', list each quote or reference clearly. Example: "Guideline Section X.Y states: '...quote...'. Page Z, Paragraph A recommends '...quote...'."
`,
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

    // Step 1: Generate Draft
    const draftResponse = await draftPrompt(input);
    const draftRecommendation = draftResponse.output?.draftRecommendation;

    if (!draftRecommendation) {
      return {
        recommendation: "Failed to generate a draft recommendation. The AI model may have not returned the expected output.",
        references: "N/A",
        noRecommendationReason: "Error in initial draft generation step."
      };
    }

    // Step 2: Refine and Extract References
    const finalResponse = await refineAndReferencePrompt({ 
      draftRecommendation, 
      originalInput: input 
    });
    
    return finalResponse.output!; // Output schema should match CancerTreatmentOutputSchema
  }
);

export async function diagnoseColonCancer(input: ColonCancerTreatmentInput): Promise<CancerTreatmentOutput> {
  return colonCancerTreatmentFlow(input);
}
