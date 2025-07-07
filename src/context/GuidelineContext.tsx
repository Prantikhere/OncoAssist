
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { AuditEntry, ProcessedDocument } from '@/types';

const PROCESSED_DOCS_KEY = 'oncoassist_processed_documents';
const AUDIT_ENTRIES_KEY = 'oncoassist_audit_entries';

// Define the shape of the context state
interface GuidelineContextType {
  processedDocuments: Record<string, ProcessedDocument[]>;
  addProcessedDocument: (cancerType: string, docInfo: ProcessedDocument) => void;
  deleteProcessedDocument: (cancerType: string, documentId: string) => void;
  auditEntries: AuditEntry[];
  addAuditEntry: (entry: AuditEntry) => void;
  updateAuditEntry: (id: string, updates: Partial<AuditEntry>) => void;
}

// Create the context with a default value
const GuidelineContext = createContext<GuidelineContextType | undefined>(undefined);

// Helper to safely parse JSON from localStorage
const loadFromLocalStorage = (key: string, isDateObject = false) => {
    if (typeof window === 'undefined') {
        return isDateObject ? [] : {};
    }
    try {
        const item = window.localStorage.getItem(key);
        if (!item) return isDateObject ? [] : {};
        
        const parsed = JSON.parse(item);
        if (isDateObject && Array.isArray(parsed)) {
            // Re-hydrate date objects from string representation
            return parsed.map((entry: any) => ({ ...entry, timestamp: new Date(entry.timestamp) }));
        }
        return parsed;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
        return isDateObject ? [] : {};
    }
};

// Create the provider component
export const GuidelineProvider = ({ children }: { children: ReactNode }) => {
  const [processedDocuments, setProcessedDocuments] = useState<Record<string, ProcessedDocument[]>>(() => loadFromLocalStorage(PROCESSED_DOCS_KEY));
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>(() => loadFromLocalStorage(AUDIT_ENTRIES_KEY, true));

  // Effect to save processedDocuments to localStorage
  useEffect(() => {
    try {
        window.localStorage.setItem(PROCESSED_DOCS_KEY, JSON.stringify(processedDocuments));
    } catch (error) {
        console.error("Error writing processedDocuments to localStorage", error);
    }
  }, [processedDocuments]);

  // Effect to save auditEntries to localStorage
  useEffect(() => {
    try {
        window.localStorage.setItem(AUDIT_ENTRIES_KEY, JSON.stringify(auditEntries));
    } catch (error) {
        console.error("Error writing auditEntries to localStorage", error);
    }
  }, [auditEntries]);


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

        if (updatedDocs.length === 0) {
            delete newDocs[cancerType];
        }

        return newDocs;
    });
  };

  const addAuditEntry = (entry: AuditEntry) => {
    setAuditEntries(prevEntries => [entry, ...prevEntries]);
  };

  const updateAuditEntry = (id: string, updates: Partial<AuditEntry>) => {
    setAuditEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  const value = { 
    processedDocuments, 
    addProcessedDocument,
    deleteProcessedDocument,
    auditEntries,
    addAuditEntry,
    updateAuditEntry,
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
