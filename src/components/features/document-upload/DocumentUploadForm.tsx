"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cancerTypeOptions } from "@/config/formOptions";
import React, { useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

export function DocumentUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cancerType, setCancerType] = useState<string>(cancerTypeOptions[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
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
    // Simulate PDF processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);

    toast({
      title: "Processing Complete (Simulated)",
      description: `Document "${selectedFile.name}" for ${cancerType} has been processed. (This is a placeholder action)`,
    });
    setSelectedFile(null);
    // Reset file input if possible, or clear the state
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">Document Upload</CardTitle>
        <CardDescription>Upload and parse cancer treatment reference documents (PDFs).</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cancer-type">Cancer Type</Label>
            <Select value={cancerType} onValueChange={setCancerType}>
              <SelectTrigger id="cancer-type">
                <SelectValue placeholder="Select cancer type" />
              </SelectTrigger>
              <SelectContent>
                {cancerTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf-upload">Upload PDF Document</Label>
            <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} />
            {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
          </div>

          <Button type="submit" disabled={isLoading || !selectedFile} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Process Document
              </>
            )}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Note: PDF parsing and database storage are simulated. This interface demonstrates the upload flow.
        </p>
      </CardContent>
    </Card>
  );
}
