"use server";

import { diagnosePlantProblem, DiagnosePlantProblemInput, DiagnosePlantProblemOutput } from "@/ai/flows/diagnose-plant-problem";

export async function diagnosePlantProblemAction(input: DiagnosePlantProblemInput): Promise<{ data: DiagnosePlantProblemOutput | null, error: string | null }> {
    try {
        const result = await diagnosePlantProblem(input);
        return { data: result, error: null };
    } catch (e: any) {
        console.error(e);
        return { data: null, error: e.message || "An unknown error occurred." };
    }
}
