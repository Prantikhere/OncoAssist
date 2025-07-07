
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
import { useGuidelineContext } from "@/context/GuidelineContext";


import { 
  type AllTreatmentInput, 
  type CancerTreatmentOutput,
  diagnoseColonCancer,
  diagnoseBreastCancer,
  diagnoseRectalCancer,
  diagnoseOtherCancer
} from "@/ai/flows";

const baseFormSchema = z.object({
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

  // Metastatic fields (optional at base level)
  tumorSidedness: z.enum(['Left', 'Right', 'Unknown']).optional(),
  krasNrasHrasStatus: z.enum(['Wild Type', 'Mutated', 'Unknown']).optional(),
  brafStatus: z.enum(['V600E Mutated', 'Non-V600E Mutated', 'Wild Type', 'Unknown']).optional(),
  her2Status: z.enum(['Positive', 'Negative', 'Unknown']).optional(),
  msiStatus: z.enum(['MSI-High', 'MSI-Low or Stable', 'Unknown']).optional(),
  ntrkFusionStatus: z.enum(['Positive', 'Negative', 'Unknown']).optional(),
  treatmentIntent: z.enum(['Curative', 'Palliative']).optional(),
  isSurgeryFeasible: z.boolean().optional(),
  isFitForIntensiveTherapy: z.boolean().optional(),
});

// Refine schema for conditional validation
const formSchema = baseFormSchema.superRefine((data, ctx) => {
  if (data.cancerType === 'Colon Cancer' && data.diseaseExtent === 'Metastatic') {
    if (!data.tumorSidedness) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["tumorSidedness"] });
    }
    if (!data.krasNrasHrasStatus) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["krasNrasHrasStatus"] });
    }
    if (!data.brafStatus) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["brafStatus"] });
    }
    if (!data.her2Status) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["her2Status"] });
    }
     if (!data.msiStatus) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["msiStatus"] });
    }
    if (!data.ntrkFusionStatus) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["ntrkFusionStatus"] });
    }
    if (!data.treatmentIntent) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["treatmentIntent"] });
    }
    if (data.treatmentIntent === 'Curative' && data.isSurgeryFeasible === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required for curative intent", path: ["isSurgeryFeasible"] });
    }
    if (data.treatmentIntent === 'Palliative' && data.isFitForIntensiveTherapy === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required for palliative intent", path: ["isFitForIntensiveTherapy"] });
    }
  }
});


type CaseFormValues = z.infer<typeof formSchema>;

export function CaseAssessmentForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationOutput, setRecommendationOutput] = useState<CancerTreatmentOutput | null>(null);
  const [currentFormInputForDisplay, setCurrentFormInputForDisplay] = useState<AllTreatmentInput | null>(null);
  const [lastSubmittedValues, setLastSubmittedValues] = useState<CaseFormValues | null>(null);
  const [isRecommendationFinalized, setIsRecommendationFinalized] = useState(false);
  
  const [dialogState, setDialogState] = useState<{ open: boolean; cancerType: string }>({
    open: false,
    cancerType: '',
  });

  const { processedDocuments, addAuditEntry } = useGuidelineContext();

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
  const watchedDiseaseExtent = form.watch("diseaseExtent");
  const watchedTStage = form.watch("tStage");
  const watchedNStage = form.watch("nStage");
  const watchedTreatmentIntent = form.watch("treatmentIntent");

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

  const showMetastaticFields = watchedCancerType === 'Colon Cancer' && watchedDiseaseExtent === 'Metastatic';

  const handleAccept = () => {
    setIsRecommendationFinalized(true);
    toast({
      title: "Recommendation Accepted",
      description: "The current recommendation has been marked as accepted.",
    });
  };

  const handleRegenerate = () => {
    if (lastSubmittedValues) {
      onSubmit(lastSubmittedValues);
    }
  };

  async function onSubmit(values: CaseFormValues) {
    setIsLoading(true);
    setRecommendationOutput(null);
    setCurrentFormInputForDisplay(null);
    setLastSubmittedValues(values);
    setIsRecommendationFinalized(false);
    
    const guidelinesForType = (values.cancerType && processedDocuments[values.cancerType]) || [];
    const useUploadedGuidelines = guidelinesForType.length > 0;

    // CRITICAL: Enforce that uploaded guidelines must be present. Remove all fallback logic.
    if (!useUploadedGuidelines) {
        toast({
            title: "Guideline Document Required",
            description: `Please upload at least one guideline document for ${values.cancerType} before generating a recommendation.`,
            variant: "destructive",
            duration: 5000,
        });
        if (values.cancerType) {
          setDialogState({ open: true, cancerType: values.cancerType });
        }
        setIsLoading(false);
        return;
    }

    const guidelineDocumentContent = guidelinesForType.map(doc => `--- START OF DOCUMENT: ${doc.fileName} ---\n\n${doc.content}\n\n--- END OF DOCUMENT: ${doc.fileName} ---`).join('\n\n');
    const usedFileNames = guidelinesForType.map(doc => doc.fileName);
    toast({
        title: `Using ${usedFileNames.length} Uploaded Guideline(s)`,
        description: `Basing recommendation on: ${usedFileNames.join(', ')}.`,
    });
    
    let submissionData: AllTreatmentInput;
    switch (values.cancerType) {
        case 'Colon Cancer':
            submissionData = { ...values, cancerType: 'Colon Cancer', guidelineDocumentContent };
            break;
        case 'Rectal Cancer':
            submissionData = { ...values, cancerType: 'Rectal Cancer', guidelineDocumentContent };
            break;
        case 'Breast Cancer':
            submissionData = { ...values, cancerType: 'Breast Cancer', guidelineDocumentContent };
            break;
        case 'Other':
        default:
            submissionData = { ...values, cancerType: 'Other', guidelineDocumentContent } as AllTreatmentInput;
            break;
    }
    
    setCurrentFormInputForDisplay(submissionData);

    try {
      let result: CancerTreatmentOutput;
      switch (submissionData.cancerType) {
        case 'Colon Cancer':
          result = await diagnoseColonCancer(submissionData);
          break;
        case 'Rectal Cancer':
           result = await diagnoseRectalCancer(submissionData);
          break;
        case 'Breast Cancer':
          result = await diagnoseBreastCancer(submissionData);
          break;
        case 'Other':
          result = await diagnoseOtherCancer(submissionData);
          break;
        default:
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

      const { guidelineDocumentContent: _, ...formValuesForAudit } = submissionData;

      addAuditEntry({
        ...formValuesForAudit,
        id: new Date().toISOString(), 
        timestamp: new Date(),
        recommendation: result.recommendation,
        references: result.references,
        noRecommendationReason: result.noRecommendationReason,
        usedGuidelineFiles: usedFileNames,
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
    if (!watchedCancerType) {
      return [];
    }
    
    const optionsMap = {
      'Colon Cancer': {
        tumorTypeOptions: formOptions.colonTumorTypeOptions,
        gradeOptions: formOptions.colonGradeOptions,
        surgicalProcedureOptions: formOptions.colonSurgicalProcedureOptions,
        lymphNodeAssessmentOptions: formOptions.colonLymphNodeAssessmentOptions,
        tStageOptions: formOptions.colonTStageOptions,
        nStageOptions: formOptions.colonNStageOptions,
      },
      'Rectal Cancer': {
        tumorTypeOptions: formOptions.rectalTumorTypeOptions,
        gradeOptions: formOptions.rectalGradeOptions,
        surgicalProcedureOptions: formOptions.rectalSurgicalProcedureOptions,
        lymphNodeAssessmentOptions: formOptions.rectalLymphNodeAssessmentOptions,
        tStageOptions: formOptions.rectalTStageOptions,
        nStageOptions: formOptions.rectalNStageOptions,
      },
      'Breast Cancer': {
        tumorTypeOptions: formOptions.breastTumorTypeOptions,
        gradeOptions: formOptions.breastGradeOptions,
        surgicalProcedureOptions: formOptions.breastSurgicalProcedureOptions,
        lymphNodeAssessmentOptions: formOptions.breastLymphNodeAssessmentOptions,
        tStageOptions: formOptions.breastTStageOptions,
        nStageOptions: formOptions.breastNStageOptions,
      },
      'Other': {
        tumorTypeOptions: formOptions.otherCancerTumorTypeOptions,
        gradeOptions: formOptions.otherCancerGradeOptions,
        surgicalProcedureOptions: formOptions.otherCancerSurgicalProcedureOptions,
        lymphNodeAssessmentOptions: formOptions.otherCancerLymphNodeAssessmentOptions,
        tStageOptions: formOptions.otherCancerTStageOptions,
        nStageOptions: formOptions.otherCancerNStageOptions,
      },
    };
    
    const cancerOptions = optionsMap[watchedCancerType as keyof typeof optionsMap];
    return cancerOptions[fieldName as keyof typeof cancerOptions] || [];
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
    optionsKey: string,
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
                <SelectValue placeholder={!watchedCancerType ? "Select Cancer Type first" : placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {getDynamicOptions(optionsKey).map((option) => (
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
            <CardDescription>Enter patient case details. Recommendation will be based on uploaded NCCN guideline documents specific to the cancer type.</CardDescription>
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
                  {renderStringSelectField("surgicalProcedure", "Surgical Procedure", "surgicalProcedureOptions", "Select surgical procedure")}
                  {renderStringSelectField("lymphNodeAssessment", "Lymph Node Assessment", "lymphNodeAssessmentOptions", "Select lymph node assessment")}
                </div>

                <Separator className="my-8" />
                <h3 className="text-xl font-semibold font-headline text-foreground/90">Report Findings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/20">
                  {renderStringSelectField("tumorType", "Tumor Type", "tumorTypeOptions", "Select tumor type")}
                  {renderStringSelectField("grade", "Grade", "gradeOptions", "Select grade")}
                  {renderStringSelectField("tStage", "T Stage", "tStageOptions", "Select T Stage")}
                  {renderStringSelectField("nStage", "N Stage", "nStageOptions", "Select N Stage")}
                  
                  {showVascularInvasionField && (
                    <FormField
                      control={form.control}
                      name="vascularLymphaticInvasion"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-1 md:col-span-2 bg-background">
                          <div className="space-y-0.5">
                            <FormLabel>Vascular/Lymphatic Invasion (T3N0)</FormLabel>
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

                {showMetastaticFields && (
                  <>
                    <Separator className="my-8" />
                    <h3 className="text-xl font-semibold font-headline text-foreground/90">Metastatic Disease Details (Colon Cancer)</h3>
                    <div className="space-y-6 p-4 border rounded-md bg-muted/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderSelectField("tumorSidedness", "Tumor Sidedness", formOptions.tumorSidednessOptions, "Select tumor sidedness")}
                        {renderSelectField("treatmentIntent", "Treatment Intent", formOptions.treatmentIntentOptions, "Select treatment intent")}
                      </div>

                      <h4 className="text-lg font-medium text-foreground/80">Comprehensive Molecular Testing</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {renderSelectField("krasNrasHrasStatus", "RAS (KRAS/NRAS/HRAS) Status", formOptions.molecularTestStatusOptions, "Select RAS status")}
                        {renderSelectField("brafStatus", "BRAF Status", formOptions.brafStatusOptions, "Select BRAF status")}
                        {renderSelectField("her2Status", "HER2 Status", formOptions.her2StatusOptions, "Select HER2 status")}
                        {renderSelectField("msiStatus", "MSI Status", formOptions.msiStatusOptions, "Select MSI status")}
                        {renderSelectField("ntrkFusionStatus", "NTRK Fusion Status", formOptions.ntrkFusionStatusOptions, "Select NTRK status")}
                      </div>
                      
                      {watchedTreatmentIntent === 'Curative' && (
                         <FormField
                          control={form.control}
                          name="isSurgeryFeasible"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                              <div className="space-y-0.5">
                                <FormLabel>Is Resection of Metastases Feasible?</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                      {watchedTreatmentIntent === 'Palliative' && (
                         <FormField
                          control={form.control}
                          name="isFitForIntensiveTherapy"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                              <div className="space-y-0.5">
                                <FormLabel>Is Patient Fit for Intensive Therapy?</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </>
                )}
                
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

        {recommendationOutput && currentFormInputForDisplay && (
          <RecommendationDisplay 
            formData={currentFormInputForDisplay} 
            recommendationOutput={recommendationOutput}
            onAccept={handleAccept}
            onRegenerate={handleRegenerate}
            isFinalized={isRecommendationFinalized}
            isRegenerating={isLoading}
          />
        )}
      </div>
      <AlertDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState({ ...dialogState, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Guideline Not Available</AlertDialogTitle>
            <AlertDialogDescription>
              A guideline document for{' '}
              <strong className="text-primary">{dialogState.cancerType}</strong> has not been uploaded. 
              Would you like to upload one now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/upload')}>
              Yes, upload guidelines
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
