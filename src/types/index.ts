
import type { AllTreatmentInput, CancerTreatmentOutput } from "@/ai/flows"; // Assuming index.ts in flows

// AuditEntry now combines the input used and the structured output from the AI flow
export interface AuditEntry extends Omit<AllTreatmentInput, 'guidelineDocumentContent'> { // Omit to avoid storing potentially large doc content
  id: string;
  timestamp: Date;
  // cancerType is already in AllTreatmentInput
  
  // Fields from CancerTreatmentOutput
  recommendation: string; 
  references?: string;
  noRecommendationReason?: string;
  
  // It might be useful to store which guideline version or a hash of content was used, if available
  // For now, we assume guidelineDocumentContent was used but not stored in audit for brevity
}
