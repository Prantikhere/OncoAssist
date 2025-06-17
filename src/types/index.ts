import type { GenerateTreatmentRecommendationInput, GenerateTreatmentRecommendationOutput } from "@/ai/flows/generate-treatment-recommendation";

export interface AuditEntry extends GenerateTreatmentRecommendationInput {
  id: string;
  timestamp: Date;
  recommendation: string; 
  // In a real app, you'd have userId, userName, etc.
}
