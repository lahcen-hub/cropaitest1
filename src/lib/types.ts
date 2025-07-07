import { z } from "zod";

export const CROP_TYPES = ["tomato", "potato", "citrus", "wheat", "corn", "olives", "rice", "barley", "soybeans", "grapes", "lettuce", "carrots"] as const;
export const ROLES = ["farmer", "technician"] as const;
export const LANGUAGES = ["en", "fr", "ar"] as const;
export const LANGUAGE_MAP: { [key in (typeof LANGUAGES)[number]]: string } = {
  en: "English",
  fr: "French",
  ar: "Arabic",
};


export const farmProfileSchema = z.object({
  role: z.enum(ROLES, {
    required_error: "Please select your role.",
  }),
  crops: z.array(z.string()).min(1, {
    message: "Please select at least one crop.",
  }),
  surfaceArea: z.coerce.number().min(0.01, {
    message: "Please enter a valid area in hectares.",
  }),
  preferredLanguage: z.enum(LANGUAGES),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  locationName: z.string().optional(),
});

export type FarmProfile = z.infer<typeof farmProfileSchema>;
