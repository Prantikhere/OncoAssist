"use client";

import { CaseAssessmentForm } from '@/components/features/case-assessment/CaseAssessmentForm';
import React, { Suspense } from 'react';

// Wrap the main content in Suspense to handle the searchParams issue
function AssessmentPageContent() {
  return <CaseAssessmentForm />;
}

// This page component is now simplified as state is managed by GuidelineContext.
export default function AssessmentPage() {
  // All state management (audit trail, documents) is now handled by the GuidelineContext
  // which is provided in the MainLayout. This simplifies the page component significantly
  // and makes state accessible across different pages like the Audit Trail page.
  
  // Wrap in Suspense to prevent the searchParams error
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssessmentPageContent />
    </Suspense>
  );
}