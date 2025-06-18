
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import type { GenerateTreatmentRecommendationInput, GenerateTreatmentRecommendationOutput } from "@/ai/flows/generate-treatment-recommendation";
import jsPDF from 'jspdf';

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

    const doc = new jsPDF();
    const lines = reportContent.split('\n');
    let yPosition = 15; // Initial Y position for text
    const pageHeight = doc.internal.pageSize.height;
    const bottomMargin = 15;
    const lineHeight = 7; // Approximate line height, adjust as needed
    const leftMargin = 10;

    doc.setFontSize(12);

    lines.forEach(line => {
      if (yPosition > pageHeight - bottomMargin) {
        doc.addPage();
        yPosition = 15; // Reset Y position for new page
      }
      // jsPDF's text function can handle arrays for auto-wrapping, but here we split manually
      // For more complex wrapping, `splitTextToSize` would be used.
      const splitLine = doc.splitTextToSize(line, doc.internal.pageSize.width - (leftMargin * 2));
      doc.text(splitLine, leftMargin, yPosition);
      yPosition += (splitLine.length * lineHeight); 
    });

    doc.save(`OncoAssist_Report_${new Date().toISOString().split('T')[0]}.pdf`);
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
          Download Report (PDF)
        </Button>
      </CardContent>
    </Card>
  );
}
