
// src/ai/flows/generate-treatment-recommendation.ts
'use server';

/**
 * @fileOverview Generates a colon cancer treatment recommendation based on provided case details and uploaded guideline document.
 *
 * - generateTreatmentRecommendation - A function that generates a treatment recommendation.
 * - GenerateTreatmentRecommendationInput - The input type for the generateTreatmentRecommendation function.
 * - GenerateTreatmentRecommendationOutput - The return type for the generateTreatmentRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTreatmentRecommendationInputSchema = z.object({
  cancerType: z.enum(['Colon Cancer', 'Rectal Cancer', 'Breast Cancer', 'Other']).describe('Type of cancer.'),
  diagnosticConfirmation: z.enum(['Biopsy-Proven', 'Cytology-Proven', 'Imaging Suggestive', 'Other']).describe('Method of diagnostic confirmation.'),
  stagingEvaluation: z.enum(['Completed', 'In Progress', 'Not Yet Started', 'Other']).describe('Status of staging evaluation.'),
  diseaseExtent: z.enum(['Localized', 'Regional', 'Metastatic', 'Other']).describe('Extent of the disease.'),
  surgicalProcedure: z.enum(['Includes nodal harvest', 'Excisional Biopsy', 'Lumpectomy', 'Mastectomy', 'Sentinel Lymph Node Biopsy (SLNB)', 'Axillary Lymph Node Dissection (ALND)', 'Other']).describe('Surgical procedure performed.'),
  lymphNodeAssessment: z.enum(['At least 12 nodes collected and analyzed', 'Specific criteria met for Breast (e.g. SLNB, ALND findings)', 'Less than 12 nodes collected/analyzed', 'No nodes assessed', 'Other']).describe('Assessment of lymph nodes.'),
  postSurgeryAnalysis: z.enum(['Final pathology/biopsy report generated', 'Awaiting final pathology', 'Other']).describe('Analysis performed after surgery.'),
  tumorType: z.string().describe('Type of tumor.'),
  grade: z.string().describe('Grade of the tumor.'),
  tStage: z.enum(['Tis', 'T1', 'T2', 'T3', 'T4a', 'T4b', 'T4c', 'T4d', 'T4', 'TX']).describe('T Stage of the tumor.'),
  nStage: z.enum(['N0', 'N0(i+)', 'N1a', 'N1b', 'N1c', 'N1mi', 'N1', 'N2a', 'N2b', 'N2', 'N3a', 'N3b', 'N3c', 'N3', 'NX']).describe('N Stage of the tumor.'),
  vascularLymphaticInvasion: z.boolean().optional().describe('Whether vascular or lymphatic invasion is present.'),
  guidelineDocumentContent: z.string().describe('The content of the relevant uploaded cancer treatment guideline document. This should be the primary source for the recommendation.'),
});
export type GenerateTreatmentRecommendationInput = z.infer<typeof GenerateTreatmentRecommendationInputSchema>;

const GenerateTreatmentRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('Recommended treatment based SOLELY on the provided guideline document content and case details, or a message if guidelines are unavailable/insufficient for the specified cancer type.'),
});
export type GenerateTreatmentRecommendationOutput = z.infer<typeof GenerateTreatmentRecommendationOutputSchema>;

export async function generateTreatmentRecommendation(
  input: GenerateTreatmentRecommendationInput
): Promise<GenerateTreatmentRecommendationOutput> {
  return generateTreatmentRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTreatmentRecommendationPrompt',
  input: {schema: GenerateTreatmentRecommendationInputSchema},
  output: {schema: GenerateTreatmentRecommendationOutputSchema},
  prompt: `You are an expert oncologist. Your task is to provide a treatment recommendation for a patient.
Your recommendation MUST be based *solely* on the following Clinical Guidelines Document Content, in conjunction with the patient's case details.
Do not use any external knowledge or other guidelines.

The Clinical Guidelines Document Content provided is specific to a particular cancer type.
IF the Clinical Guidelines Document Content explicitly states 'No guideline document currently available for {{{cancerType}}}' OR if the Clinical Guidelines Document Content is a generic placeholder (e.g., starts with 'Placeholder: No PDF uploaded...') AND it does not appear to contain specific, relevant guideline information for the patient's '{{{cancerType}}}',
THEN you MUST state clearly in the 'recommendation' field: "No specific guideline document is currently available for {{{cancerType}}} to generate a treatment recommendation. Please upload the relevant NCCN (or equivalent) guidelines for {{{cancerType}}}."
ELSE, if relevant guideline content is provided (even if simulated but specific to the cancer type), proceed to generate a recommendation based on it. If the provided content, though seemingly for the correct cancer type, is still insufficient to make a specific recommendation, state that clearly.

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

Provide a concise treatment recommendation derived ONLY from the provided guidelines document content, tailored to the patient's specific case. If the guidelines are insufficient or not applicable as per the content and instructions above, state so clearly in the recommendation field.`,
});

const generateTreatmentRecommendationFlow = ai.defineFlow(
  {
    name: 'generateTreatmentRecommendationFlow',
    inputSchema: GenerateTreatmentRecommendationInputSchema,
    outputSchema: GenerateTreatmentRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
