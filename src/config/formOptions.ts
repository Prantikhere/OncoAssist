
export const cancerTypeOptions = [
  { value: 'Colon Cancer', label: 'Colon Cancer' },
  { value: 'Rectal Cancer', label: 'Rectal Cancer' },
  { value: 'Breast Cancer', label: 'Breast Cancer' },
  { value: 'Other', label: 'Other Cancer Type' },
];

export const diagnosticConfirmationOptions = [
  { value: 'Biopsy-Proven', label: 'Biopsy-Proven' },
  { value: 'Cytology-Proven', label: 'Cytology-Proven' },
  { value: 'Imaging Suggestive', label: 'Imaging Suggestive (pending confirmation)' },
  { value: 'Other', label: 'Other Confirmation Method' },
];

export const stagingEvaluationOptions = [
  { value: 'Completed', label: 'Completed (Imaging and laboratory tests performed)' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Not Yet Started', label: 'Not Yet Started' },
  { value: 'Other', label: 'Other Status' },
];

export const diseaseExtentOptions = [
  { value: 'Localized', label: 'Localized (No evidence of distant spread)' },
  { value: 'Regional', label: 'Regional (Spread to nearby lymph nodes/structures)' },
  { value: 'Metastatic', label: 'Metastatic (Evidence of distant spread)' },
  { value: 'Other', label: 'Other Extent' },
];

export const surgicalProcedureOptions = [
  { value: 'Includes nodal harvest', label: 'Includes nodal harvest (e.g., colectomy, mastectomy with ALND)' },
  { value: 'Excisional Biopsy', label: 'Excisional Biopsy' },
  { value: 'Lumpectomy', label: 'Lumpectomy / Wide Local Excision' },
  { value: 'Mastectomy', label: 'Mastectomy (Simple, Modified Radical, Radical)' },
  { value: 'Sentinel Lymph Node Biopsy (SLNB)', label: 'Sentinel Lymph Node Biopsy (SLNB)' },
  { value: 'Axillary Lymph Node Dissection (ALND)', label: 'Axillary Lymph Node Dissection (ALND)' },
  { value: 'Other', label: 'Other Procedure' },
];

export const lymphNodeAssessmentOptions = [
  { value: 'At least 12 nodes collected and analyzed', label: 'At least 12 nodes collected and analyzed (Colorectal)' },
  { value: 'Specific criteria met for Breast (e.g. SLNB, ALND findings)', label: 'Specific criteria met for Breast (e.g. SLNB, ALND findings)' },
  { value: 'Less than 12 nodes collected/analyzed', label: 'Less than 12 nodes collected/analyzed (Colorectal)' },
  { value: 'No nodes assessed', label: 'No nodes assessed' },
  { value: 'Other', label: 'Other Assessment' },
];

export const postSurgeryAnalysisOptions = [
  { value: 'Final pathology/biopsy report generated', label: 'Final pathology/biopsy report generated' },
  { value: 'Awaiting final pathology', label: 'Awaiting final pathology' },
  { value: 'Other', label: 'Other Analysis' },
];

export const tumorTypeOptions = [
  // Colorectal
  { value: 'Adenocarcinoma', label: 'Adenocarcinoma (Colorectal)' },
  { value: 'Mucinous Adenocarcinoma', label: 'Mucinous Adenocarcinoma (Colorectal)' },
  { value: 'Signet Ring Cell Carcinoma', label: 'Signet Ring Cell Carcinoma (Colorectal)' },
  // Breast
  { value: 'Invasive Ductal Carcinoma (IDC)', label: 'Invasive Ductal Carcinoma (IDC) (Breast)' },
  { value: 'Invasive Lobular Carcinoma (ILC)', label: 'Invasive Lobular Carcinoma (ILC) (Breast)' },
  { value: 'Ductal Carcinoma In Situ (DCIS)', label: 'Ductal Carcinoma In Situ (DCIS) (Breast)' },
  { value: 'Lobular Carcinoma In Situ (LCIS)', label: 'Lobular Carcinoma In Situ (LCIS) (Breast)' },
  { value: 'Inflammatory Breast Cancer', label: 'Inflammatory Breast Cancer (Breast)' },
  // General
  { value: 'Neuroendocrine Tumor', label: 'Neuroendocrine Tumor (NET)' },
  { value: 'Squamous Cell Carcinoma', label: 'Squamous Cell Carcinoma' },
  { value: 'Sarcoma', label: 'Sarcoma' },
  { value: 'Other', label: 'Other Tumor Type' },
];

export const gradeOptions = [
  // General/Colorectal
  { value: 'Well Differentiated (G1)', label: 'Well Differentiated (G1)' },
  { value: 'Moderately Differentiated (G2)', label: 'Moderately Differentiated (G2)' },
  { value: 'Poorly Differentiated (G3)', label: 'Poorly Differentiated (G3)' },
  { value: 'Undifferentiated (G4)', label: 'Undifferentiated (G4)' },
  // Breast (Nottingham)
  { value: 'Nottingham Grade 1 (Low Grade)', label: 'Nottingham Grade 1 (Low Grade) (Breast)' },
  { value: 'Nottingham Grade 2 (Intermediate Grade)', label: 'Nottingham Grade 2 (Intermediate Grade) (Breast)' },
  { value: 'Nottingham Grade 3 (High Grade)', label: 'Nottingham Grade 3 (High Grade) (Breast)' },
  // General
  { value: 'GX (Grade cannot be assessed)', label: 'GX (Grade cannot be assessed)'},
  { value: 'Other', label: 'Other Grade' },
];

export const tStageOptions = [
  { value: 'Tis', label: 'Tis (Carcinoma in situ / Non-invasive)' },
  { value: 'T1', label: 'T1 (e.g., T1a, T1b, T1c, T1mi)' },
  { value: 'T2', label: 'T2' },
  { value: 'T3', label: 'T3' },
  { value: 'T4a', label: 'T4a' },
  { value: 'T4b', label: 'T4b' },
  { value: 'T4c', label: 'T4c (Breast specific)'},
  { value: 'T4d', label: 'T4d (Inflammatory Breast Cancer - Breast specific)'},
  { value: 'T4', label: 'T4 (Legacy/Unspecified)'},
  { value: 'TX', label: 'TX (Primary tumor cannot be assessed)'},
];

export const nStageOptions = [
  { value: 'N0', label: 'N0 (No regional lymph node metastasis)' },
  { value: 'N0(i+)', label: 'N0(i+) (Isolated Tumor Cells - Breast specific)'},
  { value: 'N1a', label: 'N1a' },
  { value: 'N1b', label: 'N1b' },
  { value: 'N1c', label: 'N1c (Colorectal specific: Tumor deposits)'},
  { value: 'N1mi', label: 'N1mi (Micrometastasis - Breast specific)'},
  { value: 'N1', label: 'N1 (e.g., 1-3 nodes)'},
  { value: 'N2a', label: 'N2a' },
  { value: 'N2b', label: 'N2b' },
  { value: 'N2', label: 'N2 (e.g., 4-9 nodes)'},
  { value: 'N3a', label: 'N3a' },
  { value: 'N3b', label: 'N3b' },
  { value: 'N3c', label: 'N3c (Breast specific)'},
  { value: 'N3', label: 'N3 (e.g., 10+ nodes or specific locations)'},
  { value: 'NX', label: 'NX (Regional lymph nodes cannot be assessed)'},
];

export const booleanOptions = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];
