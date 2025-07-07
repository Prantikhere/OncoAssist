"use client";

import { useGuidelineContext } from "@/context/GuidelineContext";
import { AuditTrailTable } from "@/components/features/audit-trail/AuditTrailTable";
import { Suspense } from "react";

function AuditPageContent() {
  const { auditEntries } = useGuidelineContext();
  
  // This page now consumes the audit entries from the shared context
  // and renders them using the AuditTrailTable component.
  // This makes the audit trail persistent across the user's session.
  return (
    <AuditTrailTable entries={auditEntries} />
  );
}

export default function AuditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuditPageContent />
    </Suspense>
  );
}