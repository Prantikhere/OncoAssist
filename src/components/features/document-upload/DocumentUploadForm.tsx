
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cancerTypeOptions } from "@/config/formOptions";
import React, { useState } from "react";
import { UploadCloud, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ProcessedDocumentInfo {
  fileName: string;
  processedAt: string;
  contentPreview: string; // Simulated content
}

export function DocumentUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cancerType, setCancerType] = useState<string>(cancerTypeOptions[0].value); // Default to first option
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // Simulate a client-side store for processed document info
  const [processedDocuments, setProcessedDocuments] = useState<Record<string, ProcessedDocumentInfo>>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleCancerTypeChange = (value: string) => {
    setCancerType(value);
    // Optionally clear file input if cancer type changes after a file was selected
    // setSelectedFile(null);
    // const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    // if (fileInput) fileInput.value = '';
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

    // Simulate PDF processing and content extraction
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    const simulatedContent = `Simulated content from "${selectedFile.name}" for ${cancerType}. Processed at ${new Date().toLocaleTimeString()}. This is a brief preview.`;
    const newDocumentInfo: ProcessedDocumentInfo = {
      fileName: selectedFile.name,
      processedAt: new Date().toISOString(),
      contentPreview: simulatedContent.substring(0, 100) + "...",
    };

    const existingDocument = processedDocuments[cancerType];

    setProcessedDocuments(prev => ({
      ...prev,
      [cancerType]: newDocumentInfo,
    }));

    setIsLoading(false);

    if (existingDocument) {
      toast({
        title: "Document Updated",
        description: `Guideline document for ${cancerType} (${selectedFile.name}) has been updated, replacing "${existingDocument.fileName}".`,
        variant: "default",
        action: <CheckCircle className="text-green-500" />,
      });
    } else {
      toast({
        title: "Document Processed",
        description: `New guideline document for ${cancerType} ("${selectedFile.name}") processed and stored (simulated).`,
        variant: "default",
        action: <CheckCircle className="text-green-500" />,
      });
    }

    setSelectedFile(null);
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">Manage Guideline Documents</CardTitle>
        <CardDescription>
          Upload and simulate processing of NCCN (or equivalent) guideline documents (PDFs).
          Uploading a new document for a specific cancer type will replace any existing (simulated) document for that type.
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
                    <AlertCircle className="h-4 w-4 mr-2 shrink-0"/> Guideline upload for 'Other' cancer types is not applicable in this system. Recommendations for 'Other' are generic.
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
                {processedDocuments[cancerType] ? "Update Document" : "Process & Store Document"}
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-8">
            <h4 className="text-lg font-semibold text-foreground/90 mb-2">Stored Guideline Status (Simulated)</h4>
            {Object.keys(processedDocuments).length === 0 ? (
                <p className="text-sm text-muted-foreground">No guideline documents have been processed yet.</p>
            ) : (
                <ul className="space-y-2 text-sm list-disc list-inside">
                    {Object.entries(processedDocuments).map(([type, info]) => (
                        <li key={type}>
                            <span className="font-medium">{type}:</span> Processed "{info.fileName}" on {new Date(info.processedAt).toLocaleDateString()}.
                        </li>
                    ))}
                </ul>
            )}
        </div>
         <p className="mt-6 text-xs text-muted-foreground italic">
          Note: PDF content parsing, actual storage, and retrieval for AI processing are simulated. This interface demonstrates the upload flow, replacement logic for specific cancer types, and simulates providing content to the AI. For a production system, robust backend processing and storage for PDF content would be required.
        </p>
      </CardContent>
    </Card>
  );
}
