"use server";

import { diagnosePlantProblem, DiagnosePlantProblemInput, DiagnosePlantProblemOutput } from "@/ai/flows/diagnose-plant-problem";
import { type LANGUAGES } from "@/lib/types";

type GuestDiagnoseInput = {
    photoDataUri: string;
    preferredLanguage: (typeof LANGUAGES)[number];
}

export async function diagnosePlantProblemGuestAction(input: GuestDiagnoseInput): Promise<{ data: DiagnosePlantProblemOutput | null, error: string | null }> {
    try {
        const flowInput: DiagnosePlantProblemInput = {
            ...input,
            crops: [], // Pass empty array for guests
        };
        const result = await diagnosePlantProblem(flowInput);
        return { data: result, error: null };
    } catch (e: any) {
        console.error(e);
        return { data: null, error: e.message || "An unknown error occurred." };
    }
}
