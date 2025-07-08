"use server";

import { generateScheduleFromSoil, GenerateScheduleFromSoilInput, GenerateScheduleFromSoilOutput } from "@/ai/flows/generate-schedule-from-soil";

export async function generateScheduleFromSoilAction(input: GenerateScheduleFromSoilInput): Promise<{ data: GenerateScheduleFromSoilOutput | null, error: string | null }> {
    try {
        const result = await generateScheduleFromSoil(input);
        return { data: result, error: null };
    } catch (e: any) {
        console.error(e);
        return { data: null, error: e.message || "An unknown error occurred." };
    }
}
