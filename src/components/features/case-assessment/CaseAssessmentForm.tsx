
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
import * as formOptions from "@/config/formOptions";
import React, { useState } from "react";
import { RecommendationDisplay } from "./RecommendationDisplay";
import type { AuditEntry } from "@/types";
import { Loader2 } from "lucide-react";

import { 
  type AllTreatmentInput, 
  type CancerTreatmentOutput,
  // Import specific flow functions
  diagnoseColonCancer,
  diagnoseBreastCancer,
  diagnoseRectalCancer,
  diagnoseOtherCancer
} from "@/ai/flows"; // Assuming an index.ts in flows for easier imports

const formSchema = z.object({
  cancerType: z.enum(['Colon Cancer', 'Rectal Cancer', 'Breast Cancer', 'Other'], { required_error: "Cancer type is required." }),
  diagnosticConfirmation: z.enum(['Biopsy-Proven', 'Cytology-Proven', 'Imaging Suggestive', 'Other'], { required_error: "Diagnostic confirmation is required." }),
  stagingEvaluation: z.enum(['Completed', 'In Progress', 'Not Yet Started', 'Other'], { required_error: "Staging evaluation is required." }),
  diseaseExtent: z.enum(['Localized', 'Regional', 'Metastatic', 'Other'], { required_error: "Disease extent is required." }),
  surgicalProcedure: z.enum(['Includes nodal harvest', 'Excisional Biopsy', 'Lumpectomy', 'Mastectomy', 'Sentinel Lymph Node Biopsy (SLNB)', 'Axillary LymphNode Dissection (ALND)', 'Other'], { required_error: "Surgical procedure is required." }),
  lymphNodeAssessment: z.enum(['At least 12 nodes collected and analyzed', 'Specific criteria met for Breast (e.g. SLNB, ALND findings)', 'Less than 12 nodes collected/analyzed', 'No nodes assessed', 'Other'], { required_error: "Lymph node assessment is required." }),
  postSurgeryAnalysis: z.enum(['Final pathology/biopsy report generated', 'Awaiting final pathology', 'Other'], { required_error: "Post-surgery analysis is required." }),
  tumorType: z.string().min(1, "Tumor type is required."),
  grade: z.string().min(1, "Grade is required."),
  tStage: z.enum(['Tis', 'T1', 'T2', 'T3', 'T4a', 'T4b', 'T4c', 'T4d', 'T4', 'TX'], { required_error: "T Stage is required." }),
  nStage: z.enum(['N0', 'N0(i+)', 'N1a', 'N1b', 'N1c', 'N1mi', 'N1', 'N2a', 'N2b', 'N2', 'N3a', 'N3b', 'N3c', 'N3', 'NX'], { required_error: "N Stage is required." }),
  vascularLymphaticInvasion: z.boolean().optional(),
});

// This type is for the form values before adding guidelineDocumentContent
type CaseFormValues = z.infer<typeof formSchema>;

interface CaseAssessmentFormProps {
  addAuditEntry: (entry: AuditEntry) => void;
}

export function CaseAssessmentForm({ addAuditEntry }: CaseAssessmentFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationOutput, setRecommendationOutput] = useState<CancerTreatmentOutput | null>(null);
  const [currentFormInputForDisplay, setCurrentFormInputForDisplay] = useState<AllTreatmentInput | null>(null);

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Set all dropdowns to undefined to show placeholder by default
      cancerType: undefined,
      diagnosticConfirmation: undefined,
      stagingEvaluation: undefined,
      diseaseExtent: undefined,
      surgicalProcedure: undefined,
      lymphNodeAssessment: undefined,
      postSurgeryAnalysis: undefined,
      tumorType: undefined, // Will show placeholder
      grade: undefined,     // Will show placeholder
      tStage: undefined,
      nStage: undefined,
      vascularLymphaticInvasion: false,
    },
  });

  const tStage = form.watch("tStage");
  const nStage = form.watch("nStage");
  const showVascularInvasionField = tStage === 'T3' && nStage === 'N0';

  async function onSubmit(values: CaseFormValues) {
    setIsLoading(true);
    setRecommendationOutput(null);
    setCurrentFormInputForDisplay(null);

    let guidelineDocumentContent: string;
    let submissionData: AllTreatmentInput;

    switch (values.cancerType) {
      case 'Colon Cancer':
        guidelineDocumentContent = `Simulated NCCN (or equivalent) guideline content for Colon Cancer is being used. Base recommendation strictly on this content. If this simulated content is insufficient, state so. Focus on identifying direct quotes or section references if possible.`;
        submissionData = { ...values, cancerType: 'Colon Cancer', guidelineDocumentContent };
        break;
      case 'Rectal Cancer':
        guidelineDocumentContent = `Simulated NCCN (or equivalent) guideline content for Rectal Cancer is being used. Base recommendation strictly on this content. If this simulated content is insufficient, state so. Focus on identifying direct quotes or section references if possible.`;
        submissionData = { ...values, cancerType: 'Rectal Cancer', guidelineDocumentContent };
        break;
      case 'Breast Cancer':
        guidelineDocumentContent = `No guideline document currently available for Breast Cancer. State that a recommendation cannot be provided due to lack of specific guidelines for Breast Cancer.`;
        submissionData = { ...values, cancerType: 'Breast Cancer', guidelineDocumentContent };
        break;
      case 'Other':
      default:
        guidelineDocumentContent = `Placeholder: No specific PDF uploaded or content not extracted for 'Other' cancer types. The AI should state that it cannot provide a recommendation without a relevant guideline document for the specified 'Other' cancer type.`;
        submissionData = { ...values, cancerType: 'Other', guidelineDocumentContent };
        break;
    }
    
    setCurrentFormInputForDisplay(submissionData);

    try {
      let result: CancerTreatmentOutput;
      switch (submissionData.cancerType) {
        case 'Colon Cancer':
          result = await diagnoseColonCancer(submissionData as Extract<AllTreatmentInput, { cancerType: 'Colon Cancer' }>);
          break;
        case 'Rectal Cancer':
           result = await diagnoseRectalCancer(submissionData as Extract<AllTreatmentInput, { cancerType: 'Rectal Cancer' }>);
          break;
        case 'Breast Cancer':
          result = await diagnoseBreastCancer(submissionData as Extract<AllTreatmentInput, { cancerType: 'Breast Cancer' }>);
          break;
        case 'Other':
          result = await diagnoseOtherCancer(submissionData as Extract<AllTreatmentInput, { cancerType: 'Other' }>);
          break;
        default:
          // Should not happen due to form validation, but as a fallback:
          const exhaustiveCheck: never = submissionData.cancerType;
          throw new Error(`Unsupported cancer type: ${exhaustiveCheck}`);
      }
      
      setRecommendationOutput(result);

      if (result.noRecommendationReason) {
        toast({
          title: "Guideline Information",
          description: result.noRecommendationReason,
          variant: "default", // Or 'destructive' if it's an error-like message
        });
      } else if (result.recommendation) {
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
        references: result.references,
        noRecommendationReason: result.noRecommendationReason,
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

  const renderSelectField = (fieldName: keyof CaseFormValues, label: string, options: { value: string; label: string }[], placeholder: string) => (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value as string | undefined} // field.value could be undefined
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
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
  
  // Special render function for tumorType and grade as they are string inputs but used like selects
  const renderStringSelectField = (fieldName: "tumorType" | "grade", label: string, options: { value: string; label: string }[], placeholder: string) => (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
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
                {renderSelectField("cancerType", "Cancer Type", formOptions.cancerTypeOptions, "Select cancer type")}
                {renderSelectField("diagnosticConfirmation", "Diagnostic Confirmation", formOptions.diagnosticConfirmationOptions, "Select confirmation")}
                {renderSelectField("stagingEvaluation", "Staging Evaluation", formOptions.stagingEvaluationOptions, "Select staging status")}
                {renderSelectField("diseaseExtent", "Disease Extent", formOptions.diseaseExtentOptions, "Select disease extent")}
                {renderSelectField("surgicalProcedure", "Surgical Procedure", formOptions.surgicalProcedureOptions, "Select surgical procedure")}
                {renderSelectField("lymphNodeAssessment", "Lymph Node Assessment", formOptions.lymphNodeAssessmentOptions, "Select lymph node assessment")}
                {renderSelectField("postSurgeryAnalysis", "Post-Surgery Analysis", formOptions.postSurgeryAnalysisOptions, "Select post-surgery analysis")}
              </div>

              <Separator className="my-8" />

              <h3 className="text-xl font-semibold font-headline text-foreground/90">Report Findings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/20">
                {renderStringSelectField("tumorType", "Tumor Type", formOptions.tumorTypeOptions, "Select tumor type")}
                {renderStringSelectField("grade", "Grade", formOptions.gradeOptions, "Select grade")}
                {renderSelectField("tStage", "T Stage", formOptions.tStageOptions, "Select T Stage")}
                {renderSelectField("nStage", "N Stage", formOptions.nStageOptions, "Select N Stage")}
                
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

      {recommendationOutput && <RecommendationDisplay formData={currentFormInputForDisplay} recommendationOutput={recommendationOutput} />}
    </div>
  );
}
