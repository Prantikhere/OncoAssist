
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the processed document information
interface ProcessedDocument {
  fileName: string;
  processedAt: string;
  content: string; // Storing full simulated content
}

// Define the shape of the context state
interface GuidelineContextType {
  processedDocuments: Record<string, ProcessedDocument>;
  addProcessedDocument: (cancerType: string, docInfo: ProcessedDocument) => void;
}

// Create the context with a default value
const GuidelineContext = createContext<GuidelineContextType | undefined>(undefined);

// Create the provider component
export const GuidelineProvider = ({ children }: { children: ReactNode }) => {
  const [processedDocuments, setProcessedDocuments] = useState<Record<string, ProcessedDocument>>({});

  const addProcessedDocument = (cancerType: string, docInfo: ProcessedDocument) => {
    setProcessedDocuments(prev => ({
      ...prev,
      [cancerType]: docInfo,
    }));
  };

  const value = { processedDocuments, addProcessedDocument };

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
