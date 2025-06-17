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
  cancerType: z.enum(['Colon Cancer', 'Other']),
  diagnosticConfirmation: z.enum(['Biopsy-Proven', 'Other']),
  stagingEvaluation: z.enum(['Completed', 'Other']),
  diseaseExtent: z.enum(['Localized', 'Other']),
  surgicalProcedure: z.enum(['Includes nodal harvest', 'Other']),
  lymphNodeAssessment: z.enum(['At least 12 nodes collected and analyzed', 'Other']),
  postSurgeryAnalysis: z.enum(['Final pathology/biopsy report generated', 'Other']),
  tumorType: z.string().min(1, "Tumor type is required."),
  grade: z.string().min(1, "Grade is required."),
  tStage: z.enum(['T1', 'T2', 'T3', 'T4']),
  nStage: z.enum(['N0', 'N1', 'N2', 'N3']),
  vascularLymphaticInvasion: z.boolean().optional(),
});

// This type will be inferred from formSchema by react-hook-form
// but explicitly defining it for clarity with AI flow.
type FormValues = GenerateTreatmentRecommendationInput;

interface CaseAssessmentFormProps {
  addAuditEntry: (entry: AuditEntry) => void;
}

export function CaseAssessmentForm({ addAuditEntry }: CaseAssessmentFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<GenerateTreatmentRecommendationOutput | null>(null);
  const [currentFormData, setCurrentFormData] = useState<FormValues | null>(null);

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
  const showVascularInvasionField = tStage === 'T3' && nStage === 'N0';

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendation(null);
    setCurrentFormData(values);

    try {
      const result = await generateTreatmentRecommendation(values);
      setRecommendation(result);
      toast({
        title: "Recommendation Generated",
        description: "Treatment recommendation has been successfully generated.",
      });
      addAuditEntry({
        ...values,
        id: new Date().toISOString(), // Simple ID for demo
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

  const renderSelectField = (name: keyof FormValues, label: string, options: { value: string; label: string }[]) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value as string}>
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
          <CardDescription>Enter patient case details to receive an NCCN guideline-based treatment recommendation.</CardDescription>
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
                {renderSelectField("tumorType", "Tumor Type", formOptions.tumorTypeOptions)}
                {renderSelectField("grade", "Grade", formOptions.gradeOptions)}
                {renderSelectField("tStage", "T Stage", formOptions.tStageOptions)}
                {renderSelectField("nStage", "N Stage", formOptions.nStageOptions)}
                
                {showVascularInvasionField && (
                  <FormField
                    control={form.control}
                    name="vascularLymphaticInvasion"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-1 md:col-span-2 bg-background">
                        <div className="space-y-0.5">
                          <FormLabel>Vascular/Lymphatic Invasion</FormLabel>
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

      {recommendation && <RecommendationDisplay formData={currentFormData} recommendation={recommendation} />}
    </div>
  );
}
