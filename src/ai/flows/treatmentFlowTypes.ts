
/**
 * @fileOverview Shared Zod schemas for cancer treatment recommendation flows.
 *
 * - BaseTreatmentInputSchema - Common input fields for treatment flows.
 * - CancerTreatmentOutputSchema - Standardized output schema including recommendation, references, and reason for no recommendation.
 * - Specific input schemas (ColonCancerTreatmentInputSchema, BreastCancerTreatmentInputSchema, etc.)
 * - AllTreatmentInput - Union type for form handling.
 * - CancerTreatmentOutput - TypeScript type for the output.
 */
import { z } from 'genkit';

export const BaseTreatmentInputSchema = z.object({
  diagnosticConfirmation: z.enum(['Biopsy-Proven', 'Cytology-Proven', 'Imaging Suggestive', 'Other']).describe('Method of diagnostic confirmation.'),
  stagingEvaluation: z.enum(['Completed', 'In Progress', 'Not Yet Started', 'Other']).describe('Status of staging evaluation.'),
  diseaseExtent: z.enum(['Localized', 'Regional', 'Metastatic', 'Other']).describe('Extent of the disease.'),
  surgicalProcedure: z.string().describe('Surgical procedure performed.'), // Changed from z.enum
  lymphNodeAssessment: z.enum(['At least 12 nodes collected and analyzed', 'Specific criteria met for Breast (e.g. SLNB, ALND findings)', 'Less than 12 nodes collected/analyzed', 'No nodes assessed', 'Other']).describe('Assessment of lymph nodes.'),
  postSurgeryAnalysis: z.enum(['Final pathology/biopsy report generated', 'Awaiting final pathology', 'Other']).describe('Analysis performed after surgery.'),
  tumorType: z.string().describe('Type of tumor.'),
  grade: z.string().describe('Grade of the tumor.'),
  tStage: z.enum(['Tis', 'T1', 'T2', 'T3', 'T4a', 'T4b', 'T4c', 'T4d', 'T4', 'TX']).describe('T Stage of the tumor.'),
  nStage: z.enum(['N0', 'N0(i+)', 'N1a', 'N1b', 'N1c', 'N1mi', 'N1', 'N2a', 'N2b', 'N2', 'N3a', 'N3b', 'N3c', 'N3', 'NX']).describe('N Stage of the tumor.'),
  vascularLymphaticInvasion: z.boolean().optional().describe('Whether vascular or lymphatic invasion is present.'),
  guidelineDocumentContent: z.string().describe("The content of the relevant uploaded cancer treatment guideline document. This should be the primary source for the recommendation. It may also indicate if guidelines are unavailable or placeholder."),
});

export const CancerTreatmentOutputSchema = z.object({
  recommendation: z.string().describe('Recommended treatment based SOLELY on the provided guideline document content and case details. If no specific recommendation can be made due to unavailable/insufficient guidelines, this field should state that clearly (e.g., "No recommendation can be provided...").'),
  references: z.string().optional().describe('Direct quotes or specific section references from the guideline document supporting the recommendation. If no specific references apply or can be extracted, this may be omitted or explicitly state "No specific references extracted." If guidelines were unavailable, this should be "N/A".'),
  noRecommendationReason: z.string().optional().describe('Reason why no recommendation (or only a general statement) could be made, if applicable (e.g., "Guideline document for [CancerType] is unavailable.", "Provided guideline content is insufficient for a specific recommendation."). This field clarifies situations where the `recommendation` field might be non-specific.')
});
export type CancerTreatmentOutput = z.infer<typeof CancerTreatmentOutputSchema>;

export const ColonCancerTreatmentInputSchema = BaseTreatmentInputSchema.extend({
  cancerType: z.literal('Colon Cancer').describe('Type of cancer, fixed to Colon Cancer.'),
});
export type ColonCancerTreatmentInput = z.infer<typeof ColonCancerTreatmentInputSchema>;

export const RectalCancerTreatmentInputSchema = BaseTreatmentInputSchema.extend({
  cancerType: z.literal('Rectal Cancer').describe('Type of cancer, fixed to Rectal Cancer.'),
});
export type RectalCancerTreatmentInput = z.infer<typeof RectalCancerTreatmentInputSchema>;

export const BreastCancerTreatmentInputSchema = BaseTreatmentInputSchema.extend({
  cancerType: z.literal('Breast Cancer').describe('Type of cancer, fixed to Breast Cancer.'),
});
export type BreastCancerTreatmentInput = z.infer<typeof BreastCancerTreatmentInputSchema>;

export const OtherCancerTreatmentInputSchema = BaseTreatmentInputSchema.extend({
  cancerType: z.literal('Other').describe('Type of cancer, fixed to Other.'),
});
export type OtherCancerTreatmentInput = z.infer<typeof OtherCancerTreatmentInputSchema>;

// Union type for form values after adding guidelineDocumentContent but before specific flow casting
export type AllTreatmentInput = 
  Omit<ColonCancerTreatmentInput, 'guidelineDocumentContent'> & { cancerType: 'Colon Cancer'; guidelineDocumentContent: string } |
  Omit<RectalCancerTreatmentInput, 'guidelineDocumentContent'> & { cancerType: 'Rectal Cancer'; guidelineDocumentContent: string } |
  Omit<BreastCancerTreatmentInput, 'guidelineDocumentContent'> & { cancerType: 'Breast Cancer'; guidelineDocumentContent: string } |
  Omit<OtherCancerTreatmentInput, 'guidelineDocumentContent'> & { cancerType: 'Other'; guidelineDocumentContent: string };

