// src/ai/flows/generate-treatment-recommendation.ts
'use server';

/**
 * @fileOverview Generates a colon cancer treatment recommendation based on provided case details.
 *
 * - generateTreatmentRecommendation - A function that generates a treatment recommendation.
 * - GenerateTreatmentRecommendationInput - The input type for the generateTreatmentRecommendation function.
 * - GenerateTreatmentRecommendationOutput - The return type for the generateTreatmentRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTreatmentRecommendationInputSchema = z.object({
  cancerType: z.enum(['Colon Cancer', 'Other']).describe('Type of cancer.'),
  diagnosticConfirmation: z.enum(['Biopsy-Proven', 'Other']).describe('Method of diagnostic confirmation.'),
  stagingEvaluation: z.enum(['Completed', 'Other']).describe('Status of staging evaluation.'),
  diseaseExtent: z.enum(['Localized', 'Other']).describe('Extent of the disease.'),
  surgicalProcedure: z.enum(['Includes nodal harvest', 'Other']).describe('Surgical procedure performed.'),
  lymphNodeAssessment: z.enum(['At least 12 nodes collected and analyzed', 'Other']).describe('Assessment of lymph nodes.'),
  postSurgeryAnalysis: z.enum(['Final pathology/biopsy report generated', 'Other']).describe('Analysis performed after surgery.'),
  tumorType: z.string().describe('Type of tumor.'),
  grade: z.string().describe('Grade of the tumor.'),
  tStage: z.enum(['T1', 'T2', 'T3', 'T4']).describe('T Stage of the tumor.'),
  nStage: z.enum(['N0', 'N1', 'N2', 'N3']).describe('N Stage of the tumor.'),
  vascularLymphaticInvasion: z.boolean().optional().describe('Whether vascular or lymphatic invasion is present.'),
});
export type GenerateTreatmentRecommendationInput = z.infer<typeof GenerateTreatmentRecommendationInputSchema>;

const GenerateTreatmentRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('Recommended treatment based on NCCN guidelines.'),
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
  prompt: `You are an expert oncologist specializing in colon cancer treatment.
  Based on the following case details, provide a treatment recommendation based on NCCN guidelines.

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

  Provide a concise treatment recommendation.`,
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
