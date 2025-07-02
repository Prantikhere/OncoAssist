
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
import { useGuidelineContext } from "@/context/GuidelineContext";

// The shape of the processed document information, aligned with the context
interface ProcessedDocumentInfo {
  fileName: string;
  processedAt: string;
  content: string; // Storing full simulated content
}

export function DocumentUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cancerType, setCancerType] = useState<string>(cancerTypeOptions[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { processedDocuments, addProcessedDocument } = useGuidelineContext();

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
    const existingDocument = processedDocuments[cancerType];

    switch (cancerType) {
      case 'Colon Cancer':
        simulatedContent = `
        Simulated NCCN Guideline for Colon Cancer:
        - Section: Adjuvant Therapy for Stage III Disease
          - For resected Stage III colon cancer (any T, N1-2), adjuvant chemotherapy is the standard of care.
          - Standard regimens include FOLFOX for 6 months or CAPOX for 3-6 months.
          - For low-risk Stage III (T1-3, N1), 3 months of CAPOX is an option. 
          - For high-risk Stage III (T4 or N2), 6 months of either FOLFOX or CAPOX is recommended.
        - Section: Management of Neuroendocrine Tumors (NETs)
          - For localized, well-differentiated (G1/G2) NETs that have been completely resected, the standard of care is surveillance. Adjuvant therapy is not typically recommended.
        - Section: Management of Metastatic Disease (Stage IV)
          - Guideline: Comprehensive molecular testing is mandatory (RAS, BRAF, HER2, MSI, NTRK).
          - Guideline: For MSI-High tumors, first-line immunotherapy (e.g., Pembrolizumab) is preferred, regardless of sidedness.
          - Guideline: For NTRK Fusion-Positive tumors, a TRK inhibitor (e.g., Larotrectinib) is recommended.
          - Guideline: For HER2-Positive, RAS Wild-Type tumors, regimens targeting HER2 (e.g., Trastuzumab + Pertuzumab + chemotherapy) are options, particularly in later lines.
          - Guideline: For BRAF V600E Mutated tumors, a BRAF inhibitor combination (e.g., Encorafenib + Cetuximab) is a standard of care, often with chemotherapy.
          - Palliative, Fit, Left-Sided, RAS WT: Preferred first-line is chemotherapy (FOLFIRI or FOLFOX) + an anti-EGFR antibody (Cetuximab or Panitumumab).
          - Palliative, Fit, Right-Sided, RAS WT: Preferred first-line is chemotherapy (FOLFIRI or FOLFOX) + Bevacizumab. Anti-EGFR therapy is less effective.
          - Palliative, Fit, RAS Mutated (any side): Preferred first-line is chemotherapy (FOLFIRI or FOLFOX) + Bevacizumab. Anti-EGFR is contraindicated.
          - Palliative, Not Fit: Less intensive options like 5-FU/Capecitabine +/- Bevacizumab, or best supportive care.
          - Curative Intent (Oligometastatic), Surgery Feasible: Upfront surgery is recommended, followed by adjuvant chemotherapy (e.g., FOLFOX or CAPOX).
          - Curative Intent (Oligometastatic), Surgery Not Feasible: Neoadjuvant/conversion chemotherapy (e.g., FOLFOX) to shrink tumors, then reassess for surgery.
        `;
        break;
      case 'Rectal Cancer':
        simulatedContent = `No guideline document currently available for Rectal Cancer. State that a recommendation cannot be provided due to lack of specific guidelines for Rectal Cancer.`;
        break;
      case 'Breast Cancer':
        simulatedContent = `No guideline document currently available for Breast Cancer. State that a recommendation cannot be provided due to lack of specific guidelines for Breast Cancer.`;
        break;
      default:
        simulatedContent = `Placeholder content for ${cancerType}.`;
        break;
    }

    const newDocumentInfo: ProcessedDocumentInfo = {
      fileName: selectedFile.name,
      processedAt: new Date().toISOString(),
      content: simulatedContent,
    };

    addProcessedDocument(cancerType, newDocumentInfo);
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
        description: `New guideline document for ${cancerType} ("${selectedFile.name}") processed and stored.`,
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
          Uploading a new document for a specific cancer type will replace any existing document for that type.
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
                {processedDocuments[cancerType] ? "Update Document" : "Process & Store Document"}
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-8">
            <h4 className="text-lg font-semibold text-foreground/90 mb-2">Stored Guideline Status</h4>
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
          Note: PDF content parsing and storage are simulated. This interface demonstrates the upload flow, replacement logic, and providing content to the AI.
        </p>
      </CardContent>
    </Card>
  );
}
