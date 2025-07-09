
'use server';
/**
 * @fileOverview Generates a Colon Cancer treatment recommendation with a direct, single-prompt approach.
 * This flow handles both non-metastatic and metastatic cases by branching logic within the prompt.
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

const colonCancerTreatmentPrompt = ai.definePrompt({
  name: 'colonCancerTreatmentPrompt',
  input: { schema: ColonCancerTreatmentInputSchema },
  output: { schema: CancerTreatmentOutputSchema },
  prompt: `You are an expert oncologist AI specializing in Colon Cancer. Your task is to generate a final, clear, and concise treatment recommendation and extract supporting references based *exclusively* on the provided clinical guidelines.

**CRITICAL INSTRUCTIONS:**
1.  Your entire response, including all clinical reasoning, MUST be based EXCLUSIVELY on the information within the provided "Clinical Guidelines Document Content". This content may be a consolidation of multiple documents, each clearly marked with '--- START OF DOCUMENT: [filename] ---' and '--- END OF DOCUMENT: [filename] ---'. Do NOT use any external knowledge.
2.  This includes determining the patient's cancer stage. You must find the relevant staging definitions within the provided guideline documents based on the patient's T and N stage data to inform your recommendation. Do NOT assume any T-stage to Cancer-Stage mappings.
3.  If the guideline content is insufficient to make a recommendation (e.g., staging information is missing from the document), you must state this clearly in the 'recommendation' field, set 'references' to "N/A", and explain the reason in 'noRecommendationReason'.
4.  EXTRACT specific verbatim quotes or detailed section/page references from the guideline content that directly support EACH key part of your final recommendation. **When extracting a reference, you MUST cite the source document's filename.**

**Clinical Guidelines Document Content:**
{{{guidelineDocumentContent}}}

---
**PATIENT CASE ANALYSIS**

{{#if tumorSidedness}}
--- **METASTATIC DISEASE ALGORITHM** ---
Follow this algorithm for the metastatic case provided.

**1. Sidedness & Molecular Profile:**
*   Tumor Sidedness: {{{tumorSidedness}}}
*   RAS (KRAS/NRAS/HRAS): {{{krasNrasHrasStatus}}}
*   BRAF: {{{brafStatus}}}
*   HER2: {{{her2Status}}}
*   MSI: {{{msiStatus}}}
*   NTRK Fusion: {{{ntrkFusionStatus}}}

**2. Treatment Intent:**
*   Intent: {{{treatmentIntent}}}
    *   Curative Intent - Surgery Feasible: {{isSurgeryFeasible}}
    *   Palliative Intent - Fit for Intensive Therapy: {{isFitForIntensiveTherapy}}

**3. Recommendation Generation:**
Synthesize the above data points and provide a specific treatment recommendation by strictly following the logic in the "Management of Metastatic Disease (Stage IV)" section of the provided guidelines.
*   Prioritize recommendations based on high-impact biomarkers first (e.g., MSI-High, NTRK Fusion).
*   For other cases, combine sidedness, RAS/BRAF status, and patient fitness to select the appropriate chemotherapy and/or targeted therapy regimen.
*   For curative intent cases, state the goal (e.g., upfront surgery or conversion therapy) and the recommended chemo regimen.

{{else}}
--- **NON-METASTATIC DISEASE (ADJUVANT) ALGORITHM** ---
Follow this algorithm for the non-metastatic (localized/regional) case provided.

**1. Patient Staging and Risk Factors:**
*   Tumor Type: {{{tumorType}}}
*   Grade: {{{grade}}}
*   T Stage: {{{tStage}}}
*   N Stage: {{{nStage}}}
*   Disease Extent: {{{diseaseExtent}}}
{{#if vascularLymphaticInvasion}}
*   Vascular/Lymphatic Invasion: Yes
{{/if}}

**2. Recommendation Generation:**
*   **For Stage III Adenocarcinoma (any T, N1/N2):** If adjuvant chemotherapy (like FOLFOX or CAPOX/XELOX) is recommended by the guidelines, you MUST specify the typical duration or number of cycles mentioned in the document. For example, "Adjuvant chemotherapy with FOLFOX (for 6 months) or CAPOX (for 3-6 months) is recommended."
*   **For Neuroendocrine Tumor (NET):** If the tumorType is 'Neuroendocrine Tumor', grade is 'Well Differentiated (G1)', and the disease is localized/resected, the standard recommendation is surveillance if the guidelines support it. Your recommendation should clearly state this.
*   For other stages/types, provide a recommendation based strictly on the provided guidelines for adjuvant therapy.

{{/if}}

Provide your final output in the specified JSON format with fields: 'recommendation', 'references', and 'noRecommendationReason' (if applicable). For 'references', list each quote or reference clearly, citing the source document. Example: "From 'NCCN_Colon_v1_2023.pdf', Section X.Y states: '...quote...'. From 'Institutional_Protocol_v2.pdf', Page Z recommends '...quote...'."`,
});

const colonCancerTreatmentFlow = ai.defineFlow(
  {
    name: 'colonCancerTreatmentFlow',
    inputSchema: ColonCancerTreatmentInputSchema,
    outputSchema: CancerTreatmentOutputSchema,
  },
  async (input) => {
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
