"use client";

import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AuditEntry } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AuditTrailTableProps {
  entries: AuditEntry[];
}

export function AuditTrailTable({ entries }: AuditTrailTableProps) {
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!entries || entries.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Audit Trail</CardTitle>
          <CardDescription>No case assessments recorded yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Once you generate treatment recommendations, they will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  const renderDetail = (label: string, value: any) => {
    if (value === undefined || value === null || value === '') return null;
    return (
      <div className="grid grid-cols-3 gap-2 text-sm">
        <span className="font-semibold text-muted-foreground">{label}</span>
        <span className="col-span-2">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</span>
      </div>
    );
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Audit Trail</CardTitle>
          <CardDescription>Record of case assessments and generated recommendations. Click a row for details.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/95 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Cancer Type</TableHead>
                  <TableHead>T Stage</TableHead>
                  <TableHead>N Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recommendation Snippet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} onClick={() => setSelectedEntry(entry)} className="cursor-pointer">
                    <TableCell>{isMounted ? new Date(entry.timestamp).toLocaleString() : '...'}</TableCell>
                    <TableCell>
                      <Badge variant={entry.cancerType === 'Colon Cancer' ? 'default' : 'secondary'}>
                        {entry.cancerType}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.tStage}</TableCell>
                    <TableCell>{entry.nStage}</TableCell>
                    <TableCell>
                      {entry.isAccepted ? (
                         <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.recommendation.substring(0, 100)}...
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {entries.length === 0 && <TableCaption>No entries in the audit trail.</TableCaption>}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!selectedEntry} onOpenChange={(isOpen) => !isOpen && setSelectedEntry(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
            <DialogHeader>
                <DialogTitle>Audit Entry Details</DialogTitle>
                <DialogDescription>
                Complete details for the case assessment generated on {selectedEntry && isMounted ? new Date(selectedEntry.timestamp).toLocaleString() : '...'}.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-full pr-6">
                {selectedEntry && (
                <div className="space-y-6 pt-4">
                    <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Case Summary</h3>
                    {renderDetail("Cancer Type", <Badge variant="default">{selectedEntry.cancerType}</Badge>)}
                    {renderDetail("T Stage", selectedEntry.tStage)}
                    {renderDetail("N Stage", selectedEntry.nStage)}
                    {renderDetail("Disease Extent", selectedEntry.diseaseExtent)}
                    {selectedEntry.isAccepted && (
                        renderDetail("Status", <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>)
                    )}
                    </div>
                    
                    {selectedEntry.isAccepted && selectedEntry.doctorsNote && (
                        <>
                            <Separator />
                            <div>
                                <h4 className="font-semibold text-md text-foreground/90 mb-2">Doctor's Note</h4>
                                <p className="whitespace-pre-wrap text-sm text-foreground/80 bg-muted/50 p-3 rounded-md border">{selectedEntry.doctorsNote}</p>
                            </div>
                        </>
                    )}
                    
                    <Separator />

                    <div className="space-y-2">
                    <h4 className="font-semibold text-lg text-foreground/90">AI Generated Recommendation</h4>
                    <p className="whitespace-pre-wrap text-foreground/90 mb-4">{selectedEntry.recommendation}</p>
                    {selectedEntry.references && selectedEntry.references !== "N/A" && (
                        <div>
                            <h5 className="font-semibold text-md text-foreground/90 mb-2">Supporting References</h5>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border">{selectedEntry.references}</p>
                        </div>
                    )}
                    {selectedEntry.noRecommendationReason && (
                        <div className="mt-2 text-sm text-destructive">
                            <strong>Reason for no/partial recommendation:</strong> {selectedEntry.noRecommendationReason}
                        </div>
                    )}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-foreground/90">Full Case Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            {renderDetail("Diagnostic Confirmation", selectedEntry.diagnosticConfirmation)}
                            {renderDetail("Staging Evaluation", selectedEntry.stagingEvaluation)}
                            {renderDetail("Surgical Procedure", selectedEntry.surgicalProcedure)}
                            {renderDetail("Lymph Node Assessment", selectedEntry.lymphNodeAssessment)}
                            {renderDetail("Post-Surgery Analysis", selectedEntry.postSurgeryAnalysis)}
                            {renderDetail("Tumor Type", selectedEntry.tumorType)}
                            {renderDetail("Grade", selectedEntry.grade)}
                            {renderDetail("Vascular/Lymphatic Invasion", selectedEntry.vascularLymphaticInvasion)}

                            {/* Metastatic Colon Cancer fields */}
                            {selectedEntry.cancerType === 'Colon Cancer' && selectedEntry.diseaseExtent === 'Metastatic' && (
                            <>
                                {renderDetail("Tumor Sidedness", selectedEntry.tumorSidedness)}
                                {renderDetail("RAS Status", selectedEntry.krasNrasHrasStatus)}
                                {renderDetail("BRAF Status", selectedEntry.brafStatus)}
                                {renderDetail("HER2 Status", selectedEntry.her2Status)}
                                {renderDetail("MSI Status", selectedEntry.msiStatus)}
                                {renderDetail("NTRK Fusion Status", selectedEntry.ntrkFusionStatus)}
                                {renderDetail("Treatment Intent", selectedEntry.treatmentIntent)}
                                {renderDetail("Surgery Feasible", selectedEntry.isSurgeryFeasible)}
                                {renderDetail("Fit for Intensive Therapy", selectedEntry.isFitForIntensiveTherapy)}
                            </>
                            )}
                        </div>
                    </div>
                    
                    {selectedEntry.usedGuidelineFiles && selectedEntry.usedGuidelineFiles.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            <h4 className="font-semibold text-lg text-foreground/90 mb-2">Guideline Documents Used</h4>
                            <div className="flex flex-wrap gap-2">
                            {selectedEntry.usedGuidelineFiles.map(file => <Badge key={file} variant="secondary">{file}</Badge>)}
                            </div>
                        </div>
                    </>
                    )}
                </div>
                )}
            </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
