
"use client";

import { CaseAssessmentForm } from '@/components/features/case-assessment/CaseAssessmentForm';
import React from 'react';

// This page component is now simplified as state is managed by GuidelineContext.
export default function AssessmentPage() {
  // All state management (audit trail, documents) is now handled by the GuidelineContext
  // which is provided in the MainLayout. This simplifies the page component significantly
  // and makes state accessible across different pages like the Audit Trail page.
  
  // The isMounted logic is no longer needed as we are not interacting with localStorage here.

  return (
    <CaseAssessmentForm />
  );
}
