import { config } from 'dotenv';
config();

import '@/ai/flows/generate-farm-calendar.ts';
import '@/ai/flows/diagnose-plant-problem.ts';
import '@/ai/flows/extract-sales-data.ts';
