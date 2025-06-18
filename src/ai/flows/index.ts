
/**
 * @fileOverview Barrel file for exporting all AI flow functions.
 */

export { diagnoseColonCancer } from './colonCancerTreatmentFlow';
export { diagnoseBreastCancer } from './breastCancerTreatmentFlow';
export { diagnoseRectalCancer } from './rectalCancerTreatmentFlow';
export { diagnoseOtherCancer } from './otherCancerTreatmentFlow';

export type { 
    ColonCancerTreatmentInput,
    BreastCancerTreatmentInput,
    RectalCancerTreatmentInput,
    OtherCancerTreatmentInput,
    AllTreatmentInput,
    CancerTreatmentOutput 
} from './treatmentFlowTypes';
