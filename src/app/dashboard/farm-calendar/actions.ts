"use server";

import { generateFarmCalendar, GenerateFarmCalendarInput, GenerateFarmCalendarOutput } from "@/ai/flows/generate-farm-calendar";

export async function generateFarmCalendarAction(input: GenerateFarmCalendarInput): Promise<{ data: GenerateFarmCalendarOutput | null, error: string | null }> {
    try {
        const result = await generateFarmCalendar(input);
        return { data: result, error: null };
    } catch (e: any) {
        console.error(e);
        return { data: null, error: e.message || "An unknown error occurred." };
    }
}
