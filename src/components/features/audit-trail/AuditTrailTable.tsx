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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AuditEntry } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface AuditTrailTableProps {
  entries: AuditEntry[];
}

export function AuditTrailTable({ entries }: AuditTrailTableProps) {
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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">Audit Trail</CardTitle>
        <CardDescription>Record of case assessments and generated recommendations.</CardDescription>
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
                <TableHead>Recommendation Snippet</TableHead>
                {/* Add more relevant columns if needed */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={entry.cancerType === 'Colon Cancer' ? 'default' : 'secondary'}>
                      {entry.cancerType}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.tStage}</TableCell>
                  <TableCell>{entry.nStage}</TableCell>
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
  );
}
