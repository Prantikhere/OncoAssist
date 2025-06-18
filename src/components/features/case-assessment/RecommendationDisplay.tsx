
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import type { AllTreatmentInput, CancerTreatmentOutput } from "@/ai/flows"; // Assuming index.ts in flows
import jsPDF from 'jspdf';
import { Separator } from "@/components/ui/separator";

interface RecommendationDisplayProps {
  formData: AllTreatmentInput | null; // formData now reflects AllTreatmentInput
  recommendationOutput: CancerTreatmentOutput | null;
}

export function RecommendationDisplay({ formData, recommendationOutput }: RecommendationDisplayProps) {
  if (!recommendationOutput || !formData) {
    return null;
  }

  const { recommendation, references, noRecommendationReason } = recommendationOutput;

  const handleDownloadReport = () => {
    if (!formData || !recommendationOutput) return;

    const doc = new jsPDF();
    let yPosition = 15;
    const pageHeight = doc.internal.pageSize.height;
    const bottomMargin = 20;
    const lineHeight = 7;
    const leftMargin = 10;
    const contentWidth = doc.internal.pageSize.width - (leftMargin * 2);

    const addText = (text: string, isBold = false, isTitle = false) => {
      if (yPosition > pageHeight - bottomMargin) {
        doc.addPage();
        yPosition = 15;
      }
      doc.setFontSize(isTitle ? 16 : (isBold ? 12 : 10));
      doc.setFont(undefined, isBold || isTitle ? 'bold' : 'normal');
      const splitLines = doc.splitTextToSize(text, contentWidth);
      doc.text(splitLines, leftMargin, yPosition);
      yPosition += (splitLines.length * lineHeight);
      if (isTitle || isBold) yPosition += lineHeight * 0.5; // Extra space after titles/bold sections
    };
    
    addText(`OncoAssist Treatment Recommendation Report`, false, true);
    addText(`Generated: ${new Date().toLocaleString()}`, false);
    yPosition += lineHeight;

    addText(`CASE DETAILS:`, true);
    addText(`Cancer Type: ${formData.cancerType}`);
    addText(`Diagnostic Confirmation: ${formData.diagnosticConfirmation}`);
    addText(`Staging Evaluation: ${formData.stagingEvaluation}`);
    addText(`Disease Extent: ${formData.diseaseExtent}`);
    addText(`Surgical Procedure: ${formData.surgicalProcedure}`);
    addText(`Lymph Node Assessment: ${formData.lymphNodeAssessment}`);
    addText(`Post-Surgery Analysis: ${formData.postSurgeryAnalysis}`);
    yPosition += lineHeight * 0.5;

    addText(`REPORT FINDINGS:`, true);
    addText(`Tumor Type: ${formData.tumorType}`);
    addText(`Grade: ${formData.grade}`);
    addText(`T Stage: ${formData.tStage}`);
    addText(`N Stage: ${formData.nStage}`);
    if (formData.cancerType === 'Colon Cancer' || formData.cancerType === 'Rectal Cancer') {
      if (formData.tStage === 'T3' && formData.nStage === 'N0') { // Condition already in form
         addText(`Vascular/Lymphatic Invasion: ${formData.vascularLymphaticInvasion ? 'Yes' : 'No'}`);
      }
    } else if (formData.vascularLymphaticInvasion !== undefined) { // For other cancer types if field was shown
        addText(`Vascular/Lymphatic Invasion: ${formData.vascularLymphaticInvasion ? 'Yes' : 'No'}`);
    }
    yPosition += lineHeight;

    addText(`RECOMMENDATION:`, true);
    if (noRecommendationReason) {
      addText(`Note: ${noRecommendationReason}`);
      yPosition += lineHeight * 0.5;
    }
    addText(recommendationOutput.recommendation || "No recommendation provided.");
    yPosition += lineHeight;

    if (references && references !== "N/A" && references !== "No specific references extracted.") {
      addText(`SUPPORTING REFERENCES FROM GUIDELINE DOCUMENT:`, true);
      addText(references);
    } else if (references) {
       addText(`Supporting References: ${references}`, false);
    }
    
    doc.save(`OncoAssist_Report_${formData.cancerType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">NCCN Guideline Based Recommendation</CardTitle>
        <CardDescription>The following is based on the provided case details and (simulated) guideline document content.</CardDescription>
      </CardHeader>
      <CardContent>
        {noRecommendationReason && (
          <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
            <p className="font-semibold">Important Note:</p>
            <p>{noRecommendationReason}</p>
          </div>
        )}
        <h4 className="font-semibold text-lg text-foreground/90 mb-2">Recommendation:</h4>
        <p className="whitespace-pre-wrap text-foreground/90 mb-4">{recommendation}</p>
        
        {references && references !== "N/A" && references !== "No specific references extracted." && (
          <>
            <Separator className="my-4" />
            <h4 className="font-semibold text-lg text-foreground/90 mb-2">Supporting References from Guideline Document:</h4>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{references}</p>
          </>
        )}
         {(references === "N/A" || references === "No specific references extracted.") && (
          <>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">Supporting References: {references}</p>
          </>
        )}

        <Button onClick={handleDownloadReport} className="mt-6 w-full sm:w-auto" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Report (PDF)
        </Button>
      </CardContent>
    </Card>
  );
}
