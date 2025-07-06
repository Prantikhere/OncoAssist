
import type { AllTreatmentInput, CancerTreatmentOutput } from "@/ai/flows"; // Assuming index.ts in flows

// The processed document, now with a unique ID for deletion
export interface ProcessedDocument {
  id: string; 
  fileName: string;
  processedAt: string;
  content: string;
}

// AuditEntry now combines the input used and the structured output from the AI flow
export interface AuditEntry extends Omit<AllTreatmentInput, 'guidelineDocumentContent'> { // Omit to avoid storing potentially large doc content
  id: string;
  timestamp: Date;
  // cancerType is already in AllTreatmentInput
  
  // Fields from CancerTreatmentOutput
  recommendation: string; 
  references?: string;
  noRecommendationReason?: string;
  
  // Record which guideline files were used for this entry
  usedGuidelineFiles?: string[];
}
