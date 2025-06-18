
export const cancerTypeOptions = [
  { value: 'Colon Cancer', label: 'Colon Cancer' },
  { value: 'Rectal Cancer', label: 'Rectal Cancer' },
  { value: 'Other', label: 'Other Cancer Type' },
];

export const diagnosticConfirmationOptions = [
  { value: 'Biopsy-Proven', label: 'Biopsy-Proven' },
  { value: 'Other', label: 'Other Confirmation Method' },
];

export const stagingEvaluationOptions = [
  { value: 'Completed', label: 'Completed (Imaging and laboratory tests performed)' },
  { value: 'Other', label: 'Other Status' },
];

export const diseaseExtentOptions = [
  { value: 'Localized', label: 'Localized (No evidence of distant spread)' },
  { value: 'Metastatic', label: 'Metastatic (Evidence of distant spread)' },
  { value: 'Other', label: 'Other Extent' },
];

export const surgicalProcedureOptions = [
  { value: 'Includes nodal harvest', label: 'Includes nodal harvest' },
  { value: 'Other', label: 'Other Procedure' },
];

export const lymphNodeAssessmentOptions = [
  { value: 'At least 12 nodes collected and analyzed', label: 'At least 12 nodes collected and analyzed' },
  { value: 'Less than 12 nodes collected/analyzed', label: 'Less than 12 nodes collected/analyzed' },
  { value: 'Other', label: 'Other Assessment' },
];

export const postSurgeryAnalysisOptions = [
  { value: 'Final pathology/biopsy report generated', label: 'Final pathology/biopsy report generated' },
  { value: 'Other', label: 'Other Analysis' },
];

export const tumorTypeOptions = [
  { value: 'Adenocarcinoma', label: 'Adenocarcinoma' },
  { value: 'Mucinous Adenocarcinoma', label: 'Mucinous Adenocarcinoma' },
  { value: 'Signet Ring Cell Carcinoma', label: 'Signet Ring Cell Carcinoma' },
  { value: 'Neuroendocrine Tumor', label: 'Neuroendocrine Tumor (NET)' },
  { value: 'Other', label: 'Other Tumor Type' },
];

export const gradeOptions = [
  { value: 'Well Differentiated (G1)', label: 'Well Differentiated (G1)' },
  { value: 'Moderately Differentiated (G2)', label: 'Moderately Differentiated (G2)' },
  { value: 'Poorly Differentiated (G3)', label: 'Poorly Differentiated (G3)' },
  { value: 'Undifferentiated (G4)', label: 'Undifferentiated (G4)' },
  { value: 'GX (Grade cannot be assessed)', label: 'GX (Grade cannot be assessed)'},
  { value: 'Other', label: 'Other Grade' },
];

export const tStageOptions = [
  { value: 'Tis', label: 'Tis (Carcinoma in situ)' },
  { value: 'T1', label: 'T1' },
  { value: 'T2', label: 'T2' },
  { value: 'T3', label: 'T3' },
  { value: 'T4a', label: 'T4a (Tumor penetrates to the surface of the visceral peritoneum)' },
  { value: 'T4b', label: 'T4b (Tumor directly invades or is adherent to other organs or structures)' },
  { value: 'T4', label: 'T4 (Legacy/Unspecified)'},
];

export const nStageOptions = [
  { value: 'N0', label: 'N0 (No regional lymph node metastasis)' },
  { value: 'N1a', label: 'N1a (Metastasis in 1 regional lymph node)' },
  { value: 'N1b', label: 'N1b (Metastasis in 2-3 regional lymph nodes)' },
  { value: 'N1c', label: 'N1c (Tumor deposit(s) in the subserosa, mesentery, or nonperitonealized pericolic or perirectal tissues without regional nodal metastasis)'},
  { value: 'N1', label: 'N1 (Legacy/Unspecified for 1-3 nodes)'},
  { value: 'N2a', label: 'N2a (Metastasis in 4-6 regional lymph nodes)' },
  { value: 'N2b', label: 'N2b (Metastasis in 7 or more regional lymph nodes)' },
  { value: 'N2', label: 'N2 (Legacy/Unspecified for 4+ nodes)'},
  { value: 'N3', label: 'N3 (Not commonly used for colon/rectal, usually indicates mets to distant nodes, but included for completeness if schema uses it)' },
];

export const booleanOptions = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];
