
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cancerTypeOptions } from "@/config/formOptions";
import React, { useState } from "react";
import { UploadCloud, Loader2, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { useGuidelineContext } from "@/context/GuidelineContext";
import type { ProcessedDocument } from "@/types";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function DocumentUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cancerType, setCancerType] = useState<string>(cancerTypeOptions[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { processedDocuments, addProcessedDocument, deleteProcessedDocument } = useGuidelineContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleCancerTypeChange = (value: string) => {
    setCancerType(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate creating full, realistic guideline content for the selected cancer type
    let simulatedContent: string;

    switch (cancerType) {
      case 'Colon Cancer':
        simulatedContent = `
        Simulated NCCN Guideline for Colon Cancer (File: ${selectedFile.name}):
        - Section: Adjuvant Therapy for Stage III Disease
          - For resected Stage III colon cancer (any T, N1-2), adjuvant chemotherapy is the standard of care.
          - Standard regimens include FOLFOX for 6 months or CAPOX for 3-6 months.
        - Section: Management of Metastatic Disease (Stage IV)
          - Guideline: For MSI-High tumors, first-line immunotherapy (e.g., Pembrolizumab) is preferred.
          - Palliative, Fit, Left-Sided, RAS WT: Preferred first-line is chemotherapy (FOLFIRI or FOLFOX) + an anti-EGFR antibody.
        `;
        break;
      case 'Rectal Cancer':
        simulatedContent = `Simulated Guideline for Rectal Cancer (File: ${selectedFile.name}): Total Neoadjuvant Therapy (TNT) is a primary option for locally advanced disease.`;
        break;
      case 'Breast Cancer':
        simulatedContent = `Simulated Guideline for Breast Cancer (File: ${selectedFile.name}): For ER-positive, HER2-negative breast cancer, endocrine therapy is the cornerstone of treatment.`;
        break;
      default:
        simulatedContent = `Placeholder content for ${cancerType} from file ${selectedFile.name}.`;
        break;
    }

    const newDocumentInfo: ProcessedDocument = {
      id: new Date().toISOString() + selectedFile.name, // Create a unique ID
      fileName: selectedFile.name,
      processedAt: new Date().toISOString(),
      content: simulatedContent,
    };

    addProcessedDocument(cancerType, newDocumentInfo);
    setIsLoading(false);

    toast({
      title: "Document Processed",
      description: `Guideline for ${cancerType} ("${selectedFile.name}") has been added.`,
      variant: "default",
      action: <CheckCircle className="text-green-500" />,
    });

    setSelectedFile(null);
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const handleDelete = (cancerType: string, docId: string, docName: string) => {
    deleteProcessedDocument(cancerType, docId);
    toast({
        title: "Document Deleted",
        description: `"${docName}" for ${cancerType} has been removed.`,
        variant: "destructive"
    });
  }

  // Flatten documents for table rendering and sort by most recent
  const allDocuments = Object.entries(processedDocuments)
    .flatMap(([type, docs]) => docs.map(doc => ({ ...doc, cancerType: type })))
    .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime());

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">Manage Guideline Documents</CardTitle>
        <CardDescription>
          Upload and simulate processing of NCCN (or equivalent) guideline documents (PDFs).
          You can add multiple documents for each cancer type.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cancer-type-upload">Cancer Type</Label>
            <Select value={cancerType} onValueChange={handleCancerTypeChange}>
              <SelectTrigger id="cancer-type-upload">
                <SelectValue placeholder="Select cancer type" />
              </SelectTrigger>
              <SelectContent>
                {cancerTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} disabled={option.value === 'Other'}>
                    {option.label} {option.value === 'Other' && '(Upload disabled)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             {cancerType === 'Other' && (
                <p className="text-sm text-destructive-foreground bg-destructive/10 p-2 rounded-md flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 shrink-0"/> Guideline upload for 'Other' cancer types is not applicable in this system.
                </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf-upload">Upload PDF Document</Label>
            <Input 
              id="pdf-upload" 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange} 
              disabled={isLoading || cancerType === 'Other'}
            />
            {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || !selectedFile || cancerType === 'Other'} 
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Process & Store Document
              </>
            )}
          </Button>
        </form>
        
        <Separator className="my-8" />

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground/90">Document Audit Trail</h4>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cancer Type</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Date Processed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allDocuments.length > 0 ? (
                    allDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <Badge variant="secondary">{doc.cancerType}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{doc.fileName}</TableCell>
                        <TableCell>{new Date(doc.processedAt).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(doc.cancerType, doc.id, doc.fileName)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete document</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No guideline documents have been processed yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
         <p className="mt-6 text-xs text-muted-foreground italic">
          Note: PDF content parsing and storage are simulated. This interface demonstrates the upload flow, multi-document management, and providing content to the AI.
        </p>
      </CardContent>
    </Card>
  );
}
