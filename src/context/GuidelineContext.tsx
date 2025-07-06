
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { AuditEntry, ProcessedDocument } from '@/types';

// Define the shape of the context state
interface GuidelineContextType {
  processedDocuments: Record<string, ProcessedDocument[]>; // Now an array of documents
  addProcessedDocument: (cancerType: string, docInfo: ProcessedDocument) => void;
  deleteProcessedDocument: (cancerType: string, documentId: string) => void;
  auditEntries: AuditEntry[];
  addAuditEntry: (entry: AuditEntry) => void;
}

// Create the context with a default value
const GuidelineContext = createContext<GuidelineContextType | undefined>(undefined);

// Create the provider component
export const GuidelineProvider = ({ children }: { children: ReactNode }) => {
  const [processedDocuments, setProcessedDocuments] = useState<Record<string, ProcessedDocument[]>>({});
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);

  const addProcessedDocument = (cancerType: string, docInfo: ProcessedDocument) => {
    setProcessedDocuments(prev => {
      const existingDocs = prev[cancerType] || [];
      return {
        ...prev,
        [cancerType]: [...existingDocs, docInfo],
      };
    });
  };

  const deleteProcessedDocument = (cancerType: string, documentId: string) => {
    setProcessedDocuments(prev => {
        const docsForType = prev[cancerType] || [];
        const updatedDocs = docsForType.filter(doc => doc.id !== documentId);
        
        const newDocs = { ...prev, [cancerType]: updatedDocs };

        // If no documents remain for a cancer type, remove the key
        if (updatedDocs.length === 0) {
            delete newDocs[cancerType];
        }

        return newDocs;
    });
  };

  const addAuditEntry = (entry: AuditEntry) => {
    setAuditEntries(prevEntries => [entry, ...prevEntries]);
  };

  const value = { 
    processedDocuments, 
    addProcessedDocument,
    deleteProcessedDocument,
    auditEntries,
    addAuditEntry
  };

  return (
    <GuidelineContext.Provider value={value}>
      {children}
    </GuidelineContext.Provider>
  );
};

// Create a custom hook for easy context consumption
export const useGuidelineContext = () => {
  const context = useContext(GuidelineContext);
  if (context === undefined) {
    throw new Error('useGuidelineContext must be used within a GuidelineProvider');
  }
  return context;
};
