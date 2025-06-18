
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { generateTreatmentRecommendation, type GenerateTreatmentRecommendationInput, type GenerateTreatmentRecommendationOutput } from "@/ai/flows/generate-treatment-recommendation";
import * as formOptions from "@/config/formOptions";
import React, { useState } from "react";
import { RecommendationDisplay } from "./RecommendationDisplay";
import type { AuditEntry } from "@/types";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  cancerType: z.enum(['Colon Cancer', 'Rectal Cancer', 'Breast Cancer', 'Other']),
  diagnosticConfirmation: z.enum(['Biopsy-Proven', 'Cytology-Proven', 'Imaging Suggestive', 'Other']),
  stagingEvaluation: z.enum(['Completed', 'In Progress', 'Not Yet Started', 'Other']),
  diseaseExtent: z.enum(['Localized', 'Regional', 'Metastatic', 'Other']),
  surgicalProcedure: z.enum(['Includes nodal harvest', 'Excisional Biopsy', 'Lumpectomy', 'Mastectomy', 'Sentinel Lymph Node Biopsy (SLNB)', 'Axillary Lymph Node Dissection (ALND)', 'Other']),
  lymphNodeAssessment: z.enum(['At least 12 nodes collected and analyzed', 'Specific criteria met for Breast (e.g. SLNB, ALND findings)', 'Less than 12 nodes collected/analyzed', 'No nodes assessed', 'Other']),
  postSurgeryAnalysis: z.enum(['Final pathology/biopsy report generated', 'Awaiting final pathology', 'Other']),
  tumorType: z.string().min(1, "Tumor type is required."),
  grade: z.string().min(1, "Grade is required."),
  tStage: z.enum(['Tis', 'T1', 'T2', 'T3', 'T4a', 'T4b', 'T4c', 'T4d', 'T4', 'TX']),
  nStage: z.enum(['N0', 'N0(i+)', 'N1a', 'N1b', 'N1c', 'N1mi', 'N1', 'N2a', 'N2b', 'N2', 'N3a', 'N3b', 'N3c', 'N3', 'NX']),
  vascularLymphaticInvasion: z.boolean().optional(),
});

type FormValues = Omit<GenerateTreatmentRecommendationInput, 'guidelineDocumentContent'>;

interface CaseAssessmentFormProps {
  addAuditEntry: (entry: AuditEntry) => void;
}

export function CaseAssessmentForm({ addAuditEntry }: CaseAssessmentFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<GenerateTreatmentRecommendationOutput | null>(null);
  const [currentFormInputForDisplay, setCurrentFormInputForDisplay] = useState<GenerateTreatmentRecommendationInput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cancerType: 'Colon Cancer',
      diagnosticConfirmation: 'Biopsy-Proven',
      stagingEvaluation: 'Completed',
      diseaseExtent: 'Localized',
      surgicalProcedure: 'Includes nodal harvest',
      lymphNodeAssessment: 'At least 12 nodes collected and analyzed',
      postSurgeryAnalysis: 'Final pathology/biopsy report generated',
      tumorType: formOptions.tumorTypeOptions[0].value, 
      grade: formOptions.gradeOptions[0].value, 
      tStage: 'T1',
      nStage: 'N0',
      vascularLymphaticInvasion: false,
    },
  });

  const tStage = form.watch("tStage");
  const nStage = form.watch("nStage");
  // This logic for LVI visibility is specific to colon/rectal cancer contexts, may need adjustment for other cancer types.
  // For now, it remains as per original implementation.
  const showVascularInvasionField = tStage === 'T3' && nStage === 'N0';

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendation(null);

    let guidelineContentForAI = "Placeholder: No PDF uploaded or content not extracted. PDF processing is currently simulated. The AI will be informed that it should base its recommendation on this placeholder or state that it cannot proceed without actual guidelines.";

    if (values.cancerType === 'Breast Cancer') {
      guidelineContentForAI = `No guideline document currently available for ${values.cancerType}. The AI should state that a recommendation cannot be provided.`;
    } else if (values.cancerType === 'Colon Cancer' || values.cancerType === 'Rectal Cancer') {
      guidelineContentForAI = `Simulated NCCN (or equivalent) guideline content for ${values.cancerType} is being used. Base recommendation strictly on this content. If this simulated content is insufficient, state so.`;
    }
    // For 'Other' cancer type, the generic placeholder defined above will be used.
    
    const submissionData: GenerateTreatmentRecommendationInput = {
      ...values,
      guidelineDocumentContent: guidelineContentForAI,
    };
    setCurrentFormInputForDisplay(submissionData);

    try {
      const result = await generateTreatmentRecommendation(submissionData);
      setRecommendation(result);
      // Avoid toast for "no recommendation" messages, check if recommendation is a known negative response
      if (!result.recommendation.toLowerCase().includes("no specific guideline document is currently available")) {
        toast({
          title: "Recommendation Generated",
          description: "Treatment recommendation has been successfully generated.",
        });
      }
      addAuditEntry({
        ...submissionData,
        id: new Date().toISOString(), 
        timestamp: new Date(),
        recommendation: result.recommendation,
      });
    } catch (error) {
      console.error("Error generating recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to generate treatment recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const renderSelectField = (fieldName: keyof FormValues, label: string, options: { value: string; label: string }[]) => (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value as string | undefined} // Ensure defaultValue can be undefined if field.value is
            value={field.value as string | undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Case Assessment</CardTitle>
          <CardDescription>Enter patient case details. Recommendation will be based on (simulated) uploaded NCCN guideline documents specific to the cancer type.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSelectField("cancerType", "Cancer Type", formOptions.cancerTypeOptions)}
                {renderSelectField("diagnosticConfirmation", "Diagnostic Confirmation", formOptions.diagnosticConfirmationOptions)}
                {renderSelectField("stagingEvaluation", "Staging Evaluation", formOptions.stagingEvaluationOptions)}
                {renderSelectField("diseaseExtent", "Disease Extent", formOptions.diseaseExtentOptions)}
                {renderSelectField("surgicalProcedure", "Surgical Procedure", formOptions.surgicalProcedureOptions)}
                {renderSelectField("lymphNodeAssessment", "Lymph Node Assessment", formOptions.lymphNodeAssessmentOptions)}
                {renderSelectField("postSurgeryAnalysis", "Post-Surgery Analysis", formOptions.postSurgeryAnalysisOptions)}
              </div>

              <Separator className="my-8" />

              <h3 className="text-xl font-semibold font-headline text-foreground/90">Report Findings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/20">
                {renderSelectField("tumorType", "Tumor Type (select most appropriate)", formOptions.tumorTypeOptions)}
                {renderSelectField("grade", "Grade (select most appropriate)", formOptions.gradeOptions)}
                {renderSelectField("tStage", "T Stage", formOptions.tStageOptions)}
                {renderSelectField("nStage", "N Stage", formOptions.nStageOptions)}
                
                {showVascularInvasionField && (
                  <FormField
                    control={form.control}
                    name="vascularLymphaticInvasion"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-1 md:col-span-2 bg-background">
                        <div className="space-y-0.5">
                          <FormLabel>Vascular/Lymphatic Invasion (if T3N0 Colon/Rectal)</FormLabel>
                          <FormMessage />
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Create Treatment Recommendation"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {recommendation && <RecommendationDisplay formData={currentFormInputForDisplay} recommendation={recommendation} />}
    </div>
  );
}
