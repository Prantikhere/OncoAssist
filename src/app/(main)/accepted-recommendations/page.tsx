
"use client";

import { useGuidelineContext } from "@/context/GuidelineContext";
import { AcceptedRecommendationsTable } from "@/components/features/accepted-recommendations/AcceptedRecommendationsTable";
import React from 'react';

export default function AcceptedRecommendationsPage() {
  const { auditEntries } = useGuidelineContext();
  const acceptedEntries = auditEntries.filter(entry => entry.isAccepted);

  return (
    <AcceptedRecommendationsTable entries={acceptedEntries} />
  );
}
