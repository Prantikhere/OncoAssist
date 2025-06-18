
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
  cancerType: z.enum(['Colon Cancer', 'Rectal Cancer', 'Other']).describe('Type of cancer.'),
  diagnosticConfirmation: z.enum(['Biopsy-Proven', 'Other']).describe('Method of diagnostic confirmation.'),
  stagingEvaluation: z.enum(['Completed', 'Other']).describe('Status of staging evaluation.'),
  diseaseExtent: z.enum(['Localized', 'Metastatic', 'Other']).describe('Extent of the disease.'),
  surgicalProcedure: z.enum(['Includes nodal harvest', 'Other']).describe('Surgical procedure performed.'),
  lymphNodeAssessment: z.enum(['At least 12 nodes collected and analyzed', 'Less than 12 nodes collected/analyzed', 'Other']).describe('Assessment of lymph nodes.'),
  postSurgeryAnalysis: z.enum(['Final pathology/biopsy report generated', 'Other']).describe('Analysis performed after surgery.'),
  tumorType: z.string().describe('Type of tumor.'),
  grade: z.string().describe('Grade of the tumor.'),
  tStage: z.enum(['Tis', 'T1', 'T2', 'T3', 'T4a', 'T4b', 'T4']).describe('T Stage of the tumor.'),
  nStage: z.enum(['N0', 'N1a', 'N1b', 'N1c', 'N1', 'N2a', 'N2b', 'N2', 'N3']).describe('N Stage of the tumor.'),
  vascularLymphaticInvasion: z.boolean().optional().describe('Whether vascular or lymphatic invasion is present.'),
  guidelineDocumentContent: z.string().describe('The content of the relevant uploaded cancer treatment guideline document. This should be the primary source for the recommendation.'),
});
export type GenerateTreatmentRecommendationInput = z.infer<typeof GenerateTreatmentRecommendationInputSchema>;

const GenerateTreatmentRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('Recommended treatment based SOLELY on the provided guideline document content and case details.'),
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

If the Clinical Guidelines Document Content is a placeholder, indicates no document is available, or does not contain relevant information for the patient's case, state clearly that a recommendation cannot be provided without the actual, relevant guidelines document or that the provided document is insufficient.

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

Provide a concise treatment recommendation derived ONLY from the provided guidelines document content, tailored to the patient's specific case. If the guidelines are insufficient or not applicable as per the content above, state so clearly in the recommendation field.`,
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
