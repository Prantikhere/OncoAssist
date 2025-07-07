
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

interface AcceptedRecommendationsTableProps {
  entries: AuditEntry[];
}

export function AcceptedRecommendationsTable({ entries }: AcceptedRecommendationsTableProps) {
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
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full pr-4">
                    <div className="flex items-center gap-4 text-left">
                        <Badge variant="default" className="w-32 justify-center">{entry.cancerType}</Badge>
                        <div className="font-mono text-sm text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{entry.tStage}</span>
                        <span className="text-sm font-medium">{entry.nStage}</span>
                    </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-4">
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
