"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import type { GenerateTreatmentRecommendationInput, GenerateTreatmentRecommendationOutput } from "@/ai/flows/generate-treatment-recommendation";

interface RecommendationDisplayProps {
  formData: GenerateTreatmentRecommendationInput | null;
  recommendation: GenerateTreatmentRecommendationOutput | null;
}

export function RecommendationDisplay({ formData, recommendation }: RecommendationDisplayProps) {
  if (!recommendation || !formData) {
    return null;
  }

  const handleDownloadReport = () => {
    if (!formData || !recommendation) return;

    let reportContent = `OncoAssist Treatment Recommendation Report\n`;
    reportContent += `Generated: ${new Date().toLocaleString()}\n\n`;
    reportContent += `CASE DETAILS:\n`;
    reportContent += `------------------------------------\n`;
    reportContent += `Cancer Type: ${formData.cancerType}\n`;
    reportContent += `Diagnostic Confirmation: ${formData.diagnosticConfirmation}\n`;
    reportContent += `Staging Evaluation: ${formData.stagingEvaluation}\n`;
    reportContent += `Disease Extent: ${formData.diseaseExtent}\n`;
    reportContent += `Surgical Procedure: ${formData.surgicalProcedure}\n`;
    reportContent += `Lymph Node Assessment: ${formData.lymphNodeAssessment}\n`;
    reportContent += `Post-Surgery Analysis: ${formData.postSurgeryAnalysis}\n\n`;
    reportContent += `REPORT FINDINGS:\n`;
    reportContent += `Tumor Type: ${formData.tumorType}\n`;
    reportContent += `Grade: ${formData.grade}\n`;
    reportContent += `T Stage: ${formData.tStage}\n`;
    reportContent += `N Stage: ${formData.nStage}\n`;
    if (formData.tStage === 'T3' && formData.nStage === 'N0') {
      reportContent += `Vascular/Lymphatic Invasion: ${formData.vascularLymphaticInvasion ? 'Yes' : 'No'}\n`;
    }
    reportContent += `\nRECOMMENDATION:\n`;
    reportContent += `------------------------------------\n`;
    reportContent += `${recommendation.recommendation}\n`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OncoAssist_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">NCCN Guideline Based Recommendation</CardTitle>
        <CardDescription>The following recommendation is based on the provided case details.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-foreground/90">{recommendation.recommendation}</p>
        <Button onClick={handleDownloadReport} className="mt-6 w-full sm:w-auto" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </CardContent>
    </Card>
  );
}
