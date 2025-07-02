"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuditPage() {
  // In a real application, auditEntries would come from a global state, context, or a backend.
  // For this demonstration, audit entries are managed locally in AssessmentPage.
  // This page displays a static message explaining this implementation detail.
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">Audit Trail</CardTitle>
        <CardDescription>Record of case assessments and generated recommendations.</CardDescription>
      </Header>
      <CardContent>
        <p className="text-muted-foreground">
          Audit trail data is managed locally within each Case Assessment session on the Case Assessment page.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          To implement a persistent and globally accessible audit trail, integration with a backend database or a global client-side state management solution (like Zustand or React Context API shared across routes) would be necessary.
        </p>
      </CardContent>
    </Card>
  );
}
