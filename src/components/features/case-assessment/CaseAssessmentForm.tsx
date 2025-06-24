
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
import React, { useState, useEffect } from "react";
import { RecommendationDisplay } from "./RecommendationDisplay";
import type { AuditEntry } from "@/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


import { 
  type AllTreatmentInput, 
  type CancerTreatmentOutput,
  diagnoseColonCancer,
  diagnoseBreastCancer,
  diagnoseRectalCancer,
  diagnoseOtherCancer
} from "@/ai/flows";

const formSchema = z.object({
  cancerType: z.enum(['Colon Cancer', 'Rectal Cancer', 'Breast Cancer', 'Other'], { required_error: "Cancer type is required." }),
  diagnosticConfirmation: z.enum(['Biopsy-Proven', 'Cytology-Proven', 'Imaging Suggestive', 'Other'], { required_error: "Diagnostic confirmation is required." }),
  stagingEvaluation: z.enum(['Completed', 'In Progress', 'Not Yet Started', 'Other'], { required_error: "Staging evaluation is required." }),
  diseaseExtent: z.enum(['Localized', 'Regional', 'Metastatic', 'Other'], { required_error: "Disease extent is required." }),
  
  surgicalProcedure: z.string({ required_error: "Surgical procedure is required." }).min(1,"Surgical procedure is required."),
  lymphNodeAssessment: z.string({ required_error: "Lymph node assessment is required." }).min(1, "Lymph node assessment is required."),
  tumorType: z.string({ required_error: "Tumor type is required." }).min(1, "Tumor type is required."),
  grade: z.string({ required_error: "Grade is required." }).min(1, "Grade is required."),
  tStage: z.string({ required_error: "T Stage is required." }).min(1, "T Stage is required."),
  nStage: z.string({ required_error: "N Stage is required." }).min(1, "N Stage is required."),
  
  postSurgeryAnalysis: z.enum(['Final pathology/biopsy report generated', 'Awaiting final pathology', 'Other'], { required_error: "Post-surgery analysis is required." }),
  vascularLymphaticInvasion: z.boolean().optional(),
});

type CaseFormValues = z.infer<typeof formSchema>;

interface CaseAssessmentFormProps {
  addAuditEntry: (entry: AuditEntry) => void;
}

export function CaseAssessmentForm({ addAuditEntry }: CaseAssessmentFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationOutput, setRecommendationOutput] = useState<CancerTreatmentOutput | null>(null);
  const [currentFormInputForDisplay, setCurrentFormInputForDisplay] = useState<AllTreatmentInput | null>(null);
  const [dialogState, setDialogState] = useState<{ open: boolean; cancerType: string }>({
    open: false,
    cancerType: '',
  });

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cancerType: undefined,
      diagnosticConfirmation: undefined,
      stagingEvaluation: undefined,
      diseaseExtent: undefined,
      surgicalProcedure: undefined,
      lymphNodeAssessment: undefined,
      postSurgeryAnalysis: undefined,
      tumorType: undefined,
      grade: undefined,
      tStage: undefined,
      nStage: undefined,
      vascularLymphaticInvasion: false,
    },
  });

  const watchedCancerType = form.watch("cancerType");
  const watchedTStage = form.watch("tStage");
  const watchedNStage = form.watch("nStage");

  useEffect(() => {
    if (watchedCancerType) {
        form.resetField("tumorType", { defaultValue: undefined });
        form.resetField("grade", { defaultValue: undefined });
        form.resetField("surgicalProcedure", { defaultValue: undefined });
        form.resetField("lymphNodeAssessment", { defaultValue: undefined });
        form.resetField("tStage", { defaultValue: undefined });
        form.resetField("nStage", { defaultValue: undefined });
        form.resetField("vascularLymphaticInvasion", { defaultValue: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCancerType, form.resetField]);


  const showVascularInvasionField = 
    (watchedCancerType === 'Colon Cancer' || watchedCancerType === 'Rectal Cancer') &&
    watchedTStage === 'T3' && 
    watchedNStage === 'N0';

  async function onSubmit(values: CaseFormValues) {
    setIsLoading(true);
    setRecommendationOutput(null);
    setCurrentFormInputForDisplay(null);
    
    // Simulate which guidelines are available. Only 'Colon Cancer' has one.
    const availableGuidelines: Record<string, boolean> = {
        'Colon Cancer': true,
    };
    
    if (values.cancerType !== 'Other' && !availableGuidelines[values.cancerType]) {
        setDialogState({ open: true, cancerType: values.cancerType });
        setIsLoading(false);
        return; // Stop submission
    }

    let guidelineDocumentContent: string;
    const submissionValues = { ...values };

    let submissionData: AllTreatmentInput;
    switch (values.cancerType) {
      case 'Colon Cancer':
        guidelineDocumentContent = `Simulated NCCN (or equivalent) guideline content for Colon Cancer is being used. Base recommendation strictly on this content. If this simulated content is insufficient, state so. Focus on identifying direct quotes or section references if possible.`;
        submissionData = { ...submissionValues, cancerType: 'Colon Cancer', guidelineDocumentContent };
        break;
      case 'Rectal Cancer':
        guidelineDocumentContent = `No guideline document currently available for Rectal Cancer. State that a recommendation cannot be provided due to lack of specific guidelines for Rectal Cancer.`;
        submissionData = { ...submissionValues, cancerType: 'Rectal Cancer', guidelineDocumentContent };
        break;
      case 'Breast Cancer':
        guidelineDocumentContent = `No guideline document currently available for Breast Cancer. State that a recommendation cannot be provided due to lack of specific guidelines for Breast Cancer.`;
        submissionData = { ...submissionValues, cancerType: 'Breast Cancer', guidelineDocumentContent };
        break;
      case 'Other':
      default:
        guidelineDocumentContent = `Placeholder: No specific PDF uploaded or content not extracted for 'Other' cancer types. The AI should state that it cannot provide a recommendation without a relevant guideline document for the specified 'Other' cancer type.`;
        submissionData = { ...submissionValues, cancerType: 'Other', guidelineDocumentContent } as AllTreatmentInput; 
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
          // This should be unreachable if form validation and switch cases are exhaustive
          const exhaustiveCheck: never = submissionData; 
          throw new Error(`Unsupported cancer type: ${(exhaustiveCheck as any).cancerType}`);
      }
      
      setRecommendationOutput(result);

      if (result.noRecommendationReason) {
        toast({
          title: "Guideline Information",
          description: result.noRecommendationReason,
          variant: result.recommendation.startsWith("Cannot provide") || result.recommendation.startsWith("No specific guideline document") ? "destructive" : "default",
          duration: 5000,
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
  
  const getDynamicOptions = (fieldName: string): { value: string; label: string; disabled?: boolean }[] => {
    const cancerDependentFields = [
      "tumorTypeOptions", "gradeOptions", "surgicalProcedureOptions",
      "lymphNodeAssessmentOptions", "tStageOptions", "nStageOptions"
    ];

    if (!watchedCancerType && cancerDependentFields.includes(fieldName)) {
      return []; // Return empty options if cancer type not selected for dependent fields
    }

    switch (watchedCancerType) {
      case 'Colon Cancer':
        if (fieldName === 'tumorTypeOptions') return formOptions.colonTumorTypeOptions;
        if (fieldName === 'gradeOptions') return formOptions.colonGradeOptions;
        if (fieldName === 'surgicalProcedureOptions') return formOptions.colonSurgicalProcedureOptions;
        if (fieldName === 'lymphNodeAssessmentOptions') return formOptions.colonLymphNodeAssessmentOptions;
        if (fieldName === 'tStageOptions') return formOptions.colonTStageOptions;
        if (fieldName === 'nStageOptions') return formOptions.colonNStageOptions;
        break;
      case 'Rectal Cancer':
        if (fieldName === 'tumorTypeOptions') return formOptions.rectalTumorTypeOptions;
        if (fieldName === 'gradeOptions') return formOptions.rectalGradeOptions;
        if (fieldName === 'surgicalProcedureOptions') return formOptions.rectalSurgicalProcedureOptions;
        if (fieldName === 'lymphNodeAssessmentOptions') return formOptions.rectalLymphNodeAssessmentOptions;
        if (fieldName === 'tStageOptions') return formOptions.rectalTStageOptions;
        if (fieldName === 'nStageOptions') return formOptions.rectalNStageOptions;
        break;
      case 'Breast Cancer':
        if (fieldName === 'tumorTypeOptions') return formOptions.breastTumorTypeOptions;
        if (fieldName === 'gradeOptions') return formOptions.breastGradeOptions;
        if (fieldName === 'surgicalProcedureOptions') return formOptions.breastSurgicalProcedureOptions;
        if (fieldName === 'lymphNodeAssessmentOptions') return formOptions.breastLymphNodeAssessmentOptions;
        if (fieldName === 'tStageOptions') return formOptions.breastTStageOptions;
        if (fieldName === 'nStageOptions') return formOptions.breastNStageOptions;
        break;
      case 'Other':
        if (fieldName === 'tumorTypeOptions') return formOptions.otherCancerTumorTypeOptions;
        if (fieldName === 'gradeOptions') return formOptions.otherCancerGradeOptions;
        if (fieldName === 'surgicalProcedureOptions') return formOptions.otherCancerSurgicalProcedureOptions;
        if (fieldName === 'lymphNodeAssessmentOptions') return formOptions.otherCancerLymphNodeAssessmentOptions;
        if (fieldName === 'tStageOptions') return formOptions.otherCancerTStageOptions;
        if (fieldName === 'nStageOptions') return formOptions.otherCancerNStageOptions;
        break;
    }
    return []; // Default to empty array if no match or cancer type not set for a dependent field
  };


  const renderSelectField = (
    fieldName: keyof CaseFormValues, 
    label: string, 
    options: { value: string; label: string; disabled?: boolean }[], 
    placeholder: string
  ) => (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={(value) => field.onChange(value)} 
            value={field.value as string | undefined}
            disabled={!watchedCancerType && fieldName !== 'cancerType' && fieldName !== 'diagnosticConfirmation' && fieldName !== 'stagingEvaluation' && fieldName !== 'diseaseExtent' && fieldName !== 'postSurgeryAnalysis'}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
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
  
  const renderStringSelectField = (
    fieldName: "tumorType" | "grade" | "surgicalProcedure" | "lymphNodeAssessment" | "tStage" | "nStage", 
    label: string, 
    options: { value: string; label: string; disabled?:boolean }[], 
    placeholder: string
  ) => (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(value)}
            value={field.value}
            disabled={!watchedCancerType}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
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
    <>
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
                  {renderSelectField("postSurgeryAnalysis", "Post-Surgery Analysis", formOptions.postSurgeryAnalysisOptions, "Select post-surgery analysis")}
                </div>
                
                <Separator className="my-8" />
                <h3 className="text-xl font-semibold font-headline text-foreground/90">Cancer Specific Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/20">
                  {renderStringSelectField("surgicalProcedure", "Surgical Procedure", getDynamicOptions("surgicalProcedureOptions"), "Select surgical procedure")}
                  {renderStringSelectField("lymphNodeAssessment", "Lymph Node Assessment", getDynamicOptions("lymphNodeAssessmentOptions"), "Select lymph node assessment")}
                </div>

                <Separator className="my-8" />
                <h3 className="text-xl font-semibold font-headline text-foreground/90">Report Findings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/20">
                  {renderStringSelectField("tumorType", "Tumor Type", getDynamicOptions("tumorTypeOptions"), "Select tumor type")}
                  {renderStringSelectField("grade", "Grade", getDynamicOptions("gradeOptions"), "Select grade")}
                  {renderStringSelectField("tStage", "T Stage", getDynamicOptions("tStageOptions"), "Select T Stage")}
                  {renderStringSelectField("nStage", "N Stage", getDynamicOptions("nStageOptions"), "Select N Stage")}
                  
                  {showVascularInvasionField && (
                    <FormField
                      control={form.control}
                      name="vascularLymphaticInvasion"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-1 md:col-span-2 bg-background">
                          <div className="space-y-0.5">
                            <FormLabel>Vascular/Lymphatic Invasion (T3N0 Colon/Rectal)</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!watchedCancerType}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <Button type="submit" disabled={isLoading || !watchedCancerType} className="w-full sm:w-auto">
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

        {recommendationOutput && currentFormInputForDisplay && <RecommendationDisplay formData={currentFormInputForDisplay} recommendationOutput={recommendationOutput} />}
      </div>
      <AlertDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState({ ...dialogState, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Guideline Not Available</AlertDialogTitle>
            <AlertDialogDescription>
              The system is not equipped with proper recommendations for{' '}
              <strong className="text-primary">{dialogState.cancerType}</strong>. 
              Do you want to share proper and recommended guidelines?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, choose different type</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/upload')}>
              Yes, upload guidelines
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
