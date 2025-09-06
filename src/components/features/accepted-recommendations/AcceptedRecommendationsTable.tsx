"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AuditEntry } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from 'react';

interface AcceptedRecommendationsTableProps {
  entries: AuditEntry[];
}

const DetailRow = ({ label, value }: { label: string; value: any }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="grid grid-cols-3 gap-2 text-sm py-1">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className="col-span-2">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</span>
    </div>
  );
};


export function AcceptedRecommendationsTable({ entries }: AcceptedRecommendationsTableProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!entries || entries.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Accepted Cases</CardTitle>
          <CardDescription>No recommendations have been accepted yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Once you accept a recommendation from the 'Case Assessment' page, it will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">Accepted Cases</CardTitle>
        <CardDescription>Record of all finalized case assessments and recommendations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full space-y-2">
          {entries.map((entry) => (
            <AccordionItem key={entry.id} value={entry.id} className="border rounded-lg px-4 bg-background">
              <AccordionTrigger className="hover:no-underline text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full pr-4 gap-2">
                    <div className="flex items-center gap-4 text-left">
                        <Badge variant="default" className="w-32 justify-center shrink-0">{entry.cancerType}</Badge>
                        <div className="font-mono text-sm text-muted-foreground">{isMounted ? new Date(entry.timestamp).toLocaleString() : '...'}</div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Badge variant="outline" className="text-xs">T: {entry.tStage}</Badge>
                        <Badge variant="outline" className="text-xs">N: {entry.nStage}</Badge>
                    </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-md text-foreground/90 mb-2">Doctor's Note</h4>
                        <p className="whitespace-pre-wrap text-sm text-foreground/80 bg-muted/50 p-3 rounded-md border">{entry.doctorsNote}</p>
                    </div>
                    
                    <Separator />

                    <div>
                        <h4 className="font-semibold text-md text-foreground/90 mb-2">AI Generated Recommendation</h4>
                         <p className="whitespace-pre-wrap text-foreground/90 mb-4">{entry.recommendation}</p>
                    </div>

                    {entry.references && entry.references !== "N/A" && (
                        <div>
                             <h4 className="font-semibold text-md text-foreground/90 mb-2">Supporting References</h4>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{entry.references}</p>
                        </div>
                    )}
                    
                    <Separator />

                    <div className="space-y-4">
                        <h4 className="font-semibold text-md text-foreground/90 mb-2">Full Case Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 p-2 rounded-md border bg-muted/20">
                            <DetailRow label="Diagnostic Confirmation" value={entry.diagnosticConfirmation} />
                            <DetailRow label="Staging Evaluation" value={entry.stagingEvaluation} />
                            <DetailRow label="Disease Extent" value={entry.diseaseExtent} />
                            <DetailRow label="Surgical Procedure" value={entry.surgicalProcedure} />
                            <DetailRow label="Lymph Node Assessment" value={entry.lymphNodeAssessment} />
                            <DetailRow label="Post-Surgery Analysis" value={entry.postSurgeryAnalysis} />
                            <DetailRow label="Tumor Type" value={entry.tumorType} />
                            <DetailRow label="Grade" value={entry.grade} />
                            <DetailRow label="T Stage" value={entry.tStage} />
                            <DetailRow label="N Stage" value={entry.nStage} />
                            <DetailRow label="Vascular/Lymphatic Invasion" value={entry.vascularLymphaticInvasion} />

                            {/* Metastatic Colon Cancer fields */}
                            {entry.cancerType === 'Colon Cancer' && entry.diseaseExtent === 'Metastatic' && (
                            <>
                                <DetailRow label="Tumor Sidedness" value={entry.tumorSidedness} />
                                <DetailRow label="RAS Status" value={entry.krasNrasHrasStatus} />
                                <DetailRow label="BRAF Status" value={entry.brafStatus} />
                                <DetailRow label="HER2 Status" value={entry.her2Status} />
                                <DetailRow label="MSI Status" value={entry.msiStatus} />
                                <DetailRow label="NTRK Fusion Status" value={entry.ntrkFusionStatus} />
                                <DetailRow label="Treatment Intent" value={entry.treatmentIntent} />
                                <DetailRow label="Surgery Feasible" value={entry.isSurgeryFeasible} />
                                <DetailRow label="Fit for Intensive Therapy" value={entry.isFitForIntensiveTherapy} />
                            </>
                            )}
                        </div>
                    </div>

                    {entry.usedGuidelineFiles && entry.usedGuidelineFiles.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-md text-foreground/90 mb-2">Guideline Documents Used</h4>
                            <div className="flex flex-wrap gap-2">
                            {entry.usedGuidelineFiles.map(file => <Badge key={file} variant="secondary">{file}</Badge>)}
                            </div>
                        </div>
                    )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
