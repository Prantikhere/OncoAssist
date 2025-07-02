
// General options that are mostly consistent across cancer types
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

export const postSurgeryAnalysisOptions = [
  { value: 'Final pathology/biopsy report generated', label: 'Final pathology/biopsy report generated' },
  { value: 'Awaiting final pathology', label: 'Awaiting final pathology' },
  { value: 'Other', label: 'Other Analysis' },
];

export const booleanOptions = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

// --- Colon Cancer Specific Options ---
export const colonTumorTypeOptions = [
  { value: 'Adenocarcinoma', label: 'Adenocarcinoma' },
  { value: 'Mucinous Adenocarcinoma', label: 'Mucinous Adenocarcinoma' },
  { value: 'Signet Ring Cell Carcinoma', label: 'Signet Ring Cell Carcinoma' },
  { value: 'Neuroendocrine Tumor', label: 'Neuroendocrine Tumor (NET)' },
  { value: 'Squamous Cell Carcinoma', label: 'Squamous Cell Carcinoma' },
  { value: 'Sarcoma', label: 'Sarcoma' },
  { value: 'Other', label: 'Other Tumor Type' },
];
export const colonGradeOptions = [
  { value: 'Well Differentiated (G1)', label: 'Well Differentiated (G1)' },
  { value: 'Moderately Differentiated (G2)', label: 'Moderately Differentiated (G2)' },
  { value: 'Poorly Differentiated (G3)', label: 'Poorly Differentiated (G3)' },
  { value: 'Undifferentiated (G4)', label: 'Undifferentiated (G4)' },
  { value: 'GX (Grade cannot be assessed)', label: 'GX (Grade cannot be assessed)'},
  { value: 'Other', label: 'Other Grade' },
];
export const colonSurgicalProcedureOptions = [
  { value: 'Right Hemicolectomy', label: 'Right Hemicolectomy (Includes nodal harvest)' },
  { value: 'Left Hemicolectomy', label: 'Left Hemicolectomy (Includes nodal harvest)' },
  { value: 'Transverse Colectomy', label: 'Transverse Colectomy (Includes nodal harvest)' },
  { value: 'Sigmoid Colectomy', label: 'Sigmoid Colectomy (Includes nodal harvest)' },
  { value: 'Subtotal/Total Colectomy', label: 'Subtotal/Total Colectomy (Includes nodal harvest)' },
  { value: 'Local Excision/Polypectomy', label: 'Local Excision/Polypectomy' },
  { value: 'Other', label: 'Other Procedure' },
];
export const colonLymphNodeAssessmentOptions = [
  { value: 'At least 12 nodes collected and analyzed', label: 'At least 12 nodes collected and analyzed' },
  { value: 'Less than 12 nodes collected/analyzed', label: 'Less than 12 nodes collected/analyzed' },
  { value: 'No nodes assessed', label: 'No nodes assessed' },
  { value: 'Other', label: 'Other Assessment' },
];
export const colonTStageOptions = [
  { value: 'Tis', label: 'Tis (Carcinoma in situ / Intraepithelial)' },
  { value: 'T1', label: 'T1 (Tumor invades submucosa)' },
  { value: 'T2', label: 'T2 (Tumor invades muscularis propria)' },
  { value: 'T3', label: 'T3 (Tumor invades through muscularis propria into pericolorectal tissues)' },
  { value: 'T4a', label: 'T4a (Tumor penetrates to the surface of the visceral peritoneum)' },
  { value: 'T4b', label: 'T4b (Tumor directly invades or is adherent to other organs or structures)' },
  { value: 'TX', label: 'TX (Primary tumor cannot be assessed)'},
];
export const colonNStageOptions = [
  { value: 'N0', label: 'N0 (No regional lymph node metastasis)' },
  { value: 'N1a', label: 'N1a (Metastasis in 1 regional lymph node)' },
  { value: 'N1b', label: 'N1b (Metastasis in 2-3 regional lymph nodes)' },
  { value: 'N1c', label: 'N1c (Tumor deposit(s) in the subserosa, mesentery, or nonperitonealized pericolic or perirectal tissues without regional nodal metastasis)'},
  { value: 'N2a', label: 'N2a (Metastasis in 4-6 regional lymph nodes)' },
  { value: 'N2b', label: 'N2b (Metastasis in 7 or more regional lymph nodes)' },
  { value: 'NX', label: 'NX (Regional lymph nodes cannot be assessed)'},
];

// --- Metastatic Colon Cancer Specific Options ---
export const tumorSidednessOptions = [
  { value: 'Left', label: 'Left-Sided (Distal to splenic flexure)' },
  { value: 'Right', label: 'Right-Sided (Proximal to splenic flexure)' },
];

export const molecularTestStatusOptions = [
  { value: 'Wild Type', label: 'Wild Type (No mutation detected)' },
  { value: 'Mutated', label: 'Mutated' },
  { value: 'Unknown', label: 'Unknown / Not Tested' },
];

export const brafStatusOptions = [
  { value: 'V600E Mutated', label: 'BRAF V600E Mutated' },
  { value: 'Non-V600E Mutated', label: 'BRAF Non-V600E Mutated' },
  { value: 'Wild Type', label: 'Wild Type (No mutation detected)' },
  { value: 'Unknown', label: 'Unknown / Not Tested' },
];

export const her2StatusOptions = [
  { value: 'Positive', label: 'Positive (Amplified/Overexpressed)' },
  { value: 'Negative', label: 'Negative' },
  { value: 'Unknown', label: 'Unknown / Not Tested' },
];

export const msiStatusOptions = [
  { value: 'MSI-High', label: 'MSI-High (Mismatch Repair Deficient)' },
  { value: 'MSI-Low or Stable', label: 'MSI-Low / MSS (Mismatch Repair Proficient)' },
  { value: 'Unknown', label: 'Unknown / Not Tested' },
];

export const ntrkFusionStatusOptions = [
  { value: 'Positive', label: 'NTRK Fusion-Positive' },
  { value: 'Negative', label: 'NTRK Fusion-Negative' },
  { value: 'Unknown', label: 'Unknown / Not Tested' },
];

export const treatmentIntentOptions = [
  { value: 'Curative', label: 'Curative Intent (Oligometastatic Disease)' },
  { value: 'Palliative', label: 'Palliative Intent (Widespread Disease)' },
];


// --- Rectal Cancer Specific Options (largely similar to Colon, but can be distinct) ---
export const rectalTumorTypeOptions = [...colonTumorTypeOptions]; // Often similar
export const rectalGradeOptions = [...colonGradeOptions];
export const rectalSurgicalProcedureOptions = [
  { value: 'Low Anterior Resection (LAR)', label: 'Low Anterior Resection (LAR) (Includes TME/nodal harvest)' },
  { value: 'Abdominoperineal Resection (APR)', label: 'Abdominoperineal Resection (APR) (Includes TME/nodal harvest)' },
  { value: 'Transanal Endoscopic Microsurgery (TEMS)', label: 'Transanal Endoscopic Microsurgery (TEMS)' },
  { value: 'Transanal Local Excision (TAE)', label: 'Transanal Local Excision (TAE)' },
  { value: 'Pelvic Exenteration', label: 'Pelvic Exenteration' },
  { value: 'Other', label: 'Other Procedure' },
];
export const rectalLymphNodeAssessmentOptions = [...colonLymphNodeAssessmentOptions];
export const rectalTStageOptions = [...colonTStageOptions]; // AJCC staging for rectal is very similar to colon
export const rectalNStageOptions = [...colonNStageOptions];

// --- Breast Cancer Specific Options ---
export const breastTumorTypeOptions = [
  { value: 'Invasive Ductal Carcinoma (IDC)', label: 'Invasive Ductal Carcinoma (IDC)' },
  { value: 'Invasive Lobular Carcinoma (ILC)', label: 'Invasive Lobular Carcinoma (ILC)' },
  { value: 'Ductal Carcinoma In Situ (DCIS)', label: 'Ductal Carcinoma In Situ (DCIS)' },
  { value: 'Lobular Carcinoma In Situ (LCIS)', label: 'Lobular Carcinoma In Situ (LCIS)' },
  { value: 'Inflammatory Breast Cancer', label: 'Inflammatory Breast Cancer' },
  { value: 'Paget Disease of the Nipple', label: 'Paget Disease of the Nipple' },
  { value: 'Mucinous Carcinoma (Colloid)', label: 'Mucinous Carcinoma (Colloid)' },
  { value: 'Tubular Carcinoma', label: 'Tubular Carcinoma' },
  { value: 'Medullary Carcinoma', label: 'Medullary Carcinoma' },
  { value: 'Papillary Carcinoma', label: 'Papillary Carcinoma' },
  { value: 'Metaplastic Carcinoma', label: 'Metaplastic Carcinoma' },
  { value: 'Neuroendocrine Tumor', label: 'Neuroendocrine Tumor (NET)' },
  { value: 'Sarcoma', label: 'Sarcoma' },
  { value: 'Other', label: 'Other Tumor Type' },
];
export const breastGradeOptions = [
  { value: 'Nottingham Grade 1 (Low Grade)', label: 'Nottingham Grade 1 / Well Differentiated (Score 3-5)' },
  { value: 'Nottingham Grade 2 (Intermediate Grade)', label: 'Nottingham Grade 2 / Moderately Differentiated (Score 6-7)' },
  { value: 'Nottingham Grade 3 (High Grade)', label: 'Nottingham Grade 3 / Poorly Differentiated (Score 8-9)' },
  { value: 'GX (Grade cannot be assessed)', label: 'GX (Grade cannot be assessed)'},
  { value: 'Other', label: 'Other Grade' },
];
export const breastSurgicalProcedureOptions = [
  { value: 'Lumpectomy / Wide Local Excision', label: 'Lumpectomy / Wide Local Excision' },
  { value: 'Mastectomy (Simple/Total)', label: 'Mastectomy (Simple/Total)' },
  { value: 'Mastectomy (Modified Radical)', label: 'Mastectomy (Modified Radical)' },
  { value: 'Mastectomy (Radical)', label: 'Mastectomy (Radical)' },
  { value: 'Nipple-Sparing Mastectomy', label: 'Nipple-Sparing Mastectomy' },
  { value: 'Skin-Sparing Mastectomy', label: 'Skin-Sparing Mastectomy' },
  { value: 'Sentinel Lymph Node Biopsy (SLNB) Only', label: 'Sentinel Lymph Node Biopsy (SLNB) Only' },
  { value: 'Axillary Lymph Node Dissection (ALND)', label: 'Axillary Lymph Node Dissection (ALND)' },
  { value: 'Lumpectomy with SLNB', label: 'Lumpectomy with SLNB' },
  { value: 'Lumpectomy with ALND', label: 'Lumpectomy with ALND' },
  { value: 'Mastectomy with SLNB', label: 'Mastectomy with SLNB' },
  { value: 'Mastectomy with ALND', label: 'Mastectomy with ALND' },
  { value: 'Excisional Biopsy', label: 'Excisional Biopsy (Diagnostic)' },
  { value: 'Other', label: 'Other Procedure' },
];
export const breastLymphNodeAssessmentOptions = [
  { value: 'Sentinel Lymph Node Biopsy (SLNB) performed', label: 'Sentinel Lymph Node Biopsy (SLNB) performed' },
  { value: 'Axillary Lymph Node Dissection (ALND) performed', label: 'Axillary Lymph Node Dissection (ALND) performed' },
  { value: 'SLNB followed by ALND', label: 'SLNB followed by ALND' },
  { value: 'No axillary surgery performed', label: 'No axillary surgery performed' },
  { value: 'Clinically node negative, no surgical assessment', label: 'Clinically node negative, no surgical assessment' },
  { value: 'Other', label: 'Other Assessment' },
];
export const breastTStageOptions = [
  { value: 'Tis', label: 'Tis (DCIS, LCIS, Paget disease of the nipple with no tumor)' },
  { value: 'T1mi', label: 'T1mi (Tumor ≤ 1 mm)' },
  { value: 'T1a', label: 'T1a (Tumor > 1 mm to ≤ 5 mm)' },
  { value: 'T1b', label: 'T1b (Tumor > 5 mm to ≤ 10 mm)' },
  { value: 'T1c', label: 'T1c (Tumor > 10 mm to ≤ 20 mm)' },
  { value: 'T1', label: 'T1 (Tumor ≤ 20 mm, unspecified T1a-c)' },
  { value: 'T2', label: 'T2 (Tumor > 20 mm to ≤ 50 mm)' },
  { value: 'T3', label: 'T3 (Tumor > 50 mm)' },
  { value: 'T4a', label: 'T4a (Extension to chest wall)' },
  { value: 'T4b', label: 'T4b (Edema (including peau d’orange) or ulceration of the skin of the breast, or satellite skin nodules confined to the same breast)' },
  { value: 'T4c', label: 'T4c (Both T4a and T4b)'},
  { value: 'T4d', label: 'T4d (Inflammatory breast cancer)'},
  { value: 'TX', label: 'TX (Primary tumor cannot be assessed)'},
];
export const breastNStageOptions = [
  // Clinical N (cN)
  { value: 'cN0', label: 'cN0 (No regional lymph node metastasis detected by imaging or clinical examination)' },
  { value: 'cN1', label: 'cN1 (Metastases to movable ipsilateral level I, II axillary lymph nodes)' },
  { value: 'cN1mi', label: 'cN1mi (Micrometastases in axillary lymph nodes; >0.2mm and/or >200 cells, but none >2.0mm)'},
  { value: 'cN2a', label: 'cN2a (Metastases in ipsilateral level I, II axillary lymph nodes that are clinically fixed or matted)' },
  { value: 'cN2b', label: 'cN2b (Metastases only in ipsilateral internal mammary nodes and in the absence of axillary lymph node metastases)' },
  { value: 'cN3a', label: 'cN3a (Metastases in ipsilateral infraclavicular (level III axillary) lymph node(s))' },
  { value: 'cN3b', label: 'cN3b (Metastases in ipsilateral internal mammary and axillary lymph nodes)' },
  { value: 'cN3c', label: 'cN3c (Metastases in ipsilateral supraclavicular lymph node(s))' },
  // Pathological N (pN)
  { value: 'pN0', label: 'pN0 (No regional lymph node metastasis histologically)' },
  { value: 'pN0(i+)', label: 'pN0(i+) (Isolated Tumor Cells (ITC) only in regional lymph node(s))'},
  { value: 'pN1mi', label: 'pN1mi (Micrometastases; >0.2mm and/or >200 cells, but none >2.0mm)'},
  { value: 'pN1a', label: 'pN1a (Metastases in 1–3 axillary lymph nodes, at least one metastasis >2.0 mm)' },
  { value: 'pN1b', label: 'pN1b (Metastases in internal mammary nodes with micrometastases or macrometastases detected by SLND but not clinically apparent)' },
  { value: 'pN1c', label: 'pN1c (Metastases in 1–3 axillary lymph nodes and in internal mammary lymph nodes with micrometastases or macrometastases detected by SLND but not clinically apparent)' },
  { value: 'pN2a', label: 'pN2a (Metastases in 4–9 axillary lymph nodes, at least one tumor deposit >2.0 mm)' },
  { value: 'pN2b', label: 'pN2b (Metastases in clinically detected internal mammary lymph nodes in the absence of axillary lymph node metastasis)' },
  { value: 'pN3a', label: 'pN3a (Metastases in 10 or more axillary lymph nodes; or in infraclavicular (level III axillary) lymph nodes)' },
  { value: 'pN3b', label: 'pN3b (Metastases in clinically detected internal mammary lymph nodes with positive axillary (level I, II) lymph nodes; or in more than 3 axillary lymph nodes and in internal mammary lymph nodes with micrometastases or macrometastases detected by SLND)' },
  { value: 'pN3c', label: 'pN3c (Metastases in ipsilateral supraclavicular lymph nodes)' },
  { value: 'NX', label: 'NX (Regional lymph nodes cannot be assessed, e.g. previously removed)'},
];


// --- 'Other' Cancer Type Options (more generic) ---
export const otherCancerTumorTypeOptions = [
  { value: 'Adenocarcinoma', label: 'Adenocarcinoma (Specify primary site if known)' },
  { value: 'Squamous Cell Carcinoma', label: 'Squamous Cell Carcinoma (Specify primary site if known)' },
  { value: 'Neuroendocrine Tumor', label: 'Neuroendocrine Tumor (NET)' },
  { value: 'Sarcoma', label: 'Sarcoma (Specify type if known)' },
  { value: 'Melanoma', label: 'Melanoma' },
  { value: 'Lymphoma', label: 'Lymphoma (Specify type if known)' },
  { value: 'Carcinoma of Unknown Primary (CUP)', label: 'Carcinoma of Unknown Primary (CUP)' },
  { value: 'Other Specified', label: 'Other Specified Type (Provide details)' },
  { value: 'Unspecified Malignant Neoplasm', label: 'Unspecified Malignant Neoplasm' },
];
export const otherCancerGradeOptions = [
  { value: 'Well Differentiated (G1)', label: 'Well Differentiated (G1)' },
  { value: 'Moderately Differentiated (G2)', label: 'Moderately Differentiated (G2)' },
  { value: 'Poorly Differentiated (G3)', label: 'Poorly Differentiated (G3)' },
  { value: 'Undifferentiated (G4)', label: 'Undifferentiated (G4)' },
  { value: 'GX (Grade cannot be assessed)', label: 'GX (Grade cannot be assessed)'},
  { value: 'Not Applicable', label: 'Not Applicable (e.g., for some hematologic malignancies)' },
  { value: 'Other', label: 'Other Grade' },
];
export const otherCancerSurgicalProcedureOptions = [
  { value: 'Excisional Biopsy', label: 'Excisional Biopsy' },
  { value: 'Incisional Biopsy', label: 'Incisional Biopsy' },
  { value: 'Resection of Primary Tumor', label: 'Resection of Primary Tumor (Includes nodal harvest if applicable)' },
  { value: 'Debulking Surgery', label: 'Debulking Surgery' },
  { value: 'Palliative Surgery', label: 'Palliative Surgery' },
  { value: 'No Surgery Performed', label: 'No Surgery Performed' },
  { value: 'Other', label: 'Other Procedure' },
];
export const otherCancerLymphNodeAssessmentOptions = [
  { value: 'Regional lymph node dissection performed', label: 'Regional lymph node dissection performed' },
  { value: 'Sentinel lymph node biopsy performed', label: 'Sentinel lymph node biopsy performed' },
  { value: 'Nodes assessed by imaging only', label: 'Nodes assessed by imaging only' },
  { value: 'No nodes assessed', label: 'No nodes assessed' },
  { value: 'Other', label: 'Other Assessment' },
];
export const otherCancerTStageOptions = [ // These are very generic as T staging is highly cancer-specific
  { value: 'Tis', label: 'Tis (Carcinoma in situ / Non-invasive)' },
  { value: 'T1', label: 'T1 (Early stage, small tumor)' },
  { value: 'T2', label: 'T2 (Tumor of intermediate size/invasion)' },
  { value: 'T3', label: 'T3 (Larger tumor/deeper invasion)' },
  { value: 'T4', label: 'T4 (Very large tumor/invasion of adjacent structures)' },
  { value: 'TX', label: 'TX (Primary tumor cannot be assessed)'},
  { value: 'Not Applicable', label: 'Not Applicable (e.g., hematologic)' },
];
export const otherCancerNStageOptions = [ // Generic N staging
  { value: 'N0', label: 'N0 (No regional lymph node metastasis)' },
  { value: 'N1', label: 'N1 (Metastasis to regional lymph node(s))' },
  { value: 'N2', label: 'N2 (More extensive regional lymph node involvement)' },
  { value: 'N3', label: 'N3 (Most extensive regional lymph node involvement)' },
  { value: 'NX', label: 'NX (Regional lymph nodes cannot be assessed)'},
  { value: 'Not Applicable', label: 'Not Applicable (e.g., hematologic)' },
];
