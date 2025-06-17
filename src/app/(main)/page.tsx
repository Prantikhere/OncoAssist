"use client"; // Required for useState and useEffect

import { CaseAssessmentForm } from '@/components/features/case-assessment/CaseAssessmentForm';
import type { AuditEntry } from '@/types';
import React, { useState, useEffect } from 'react';

// This page component needs to be a client component to manage audit trail state.
export default function AssessmentPage() {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load audit entries from localStorage if available (optional persistence)
    // This part is tricky with server components if not handled correctly.
    // For simplicity, this example might not implement full localStorage persistence
    // due to hydration complexities if not done carefully in a Next.js app router context.
    // For now, it will be in-memory.
  }, []);
  
  const addAuditEntry = (entry: AuditEntry) => {
    setAuditEntries(prevEntries => [entry, ...prevEntries]);
    // Optionally save to localStorage here
  };

  if (!isMounted) {
    // Optional: return a loading state or null to prevent hydration mismatches
    // if you were to read from localStorage synchronously in initial state.
    // For in-memory state, this is less critical but good practice.
    return null; 
  }

  return (
    <CaseAssessmentForm addAuditEntry={addAuditEntry} />
  );
}
