
import { config } from 'dotenv';
config();

// Import flow files to register them with Genkit
import '@/ai/flows/colonCancerTreatmentFlow';
import '@/ai/flows/breastCancerTreatmentFlow';
import '@/ai/flows/rectalCancerTreatmentFlow';
import '@/ai/flows/otherCancerTreatmentFlow';
// The actual flow functions are exported via index.ts in the flows directory
// but importing them here ensures they are seen by the Genkit tool during development.
