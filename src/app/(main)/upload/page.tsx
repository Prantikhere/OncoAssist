"use client";

import { DocumentUploadForm } from '@/components/features/document-upload/DocumentUploadForm';
import { Suspense } from 'react';

function UploadPageContent() {
  return <DocumentUploadForm />;
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadPageContent />
    </Suspense>
  );
}