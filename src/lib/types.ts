
import { z } from "zod";

export const CROP_TYPES = ["tomato", "potato", "citrus", "wheat", "corn", "olives", "rice", "barley", "soybeans", "grapes", "lettuce", "carrots"] as const;
export const ROLES = ["farmer", "technician", "supplier"] as const;
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
  companyName: z.string().optional(),
  crops: z.array(z.string()).default([]),
  surfaceArea: z.coerce.number().default(0),
  preferredLanguage: z.enum(LANGUAGES),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  locationName: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.role === 'supplier') {
        if (!data.companyName || data.companyName.trim().length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['companyName'],
                message: "Company name is required for suppliers."
            });
        }
    } else { // farmer or technician
        if (data.crops.length < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['crops'],
                message: "Please select at least one crop."
            });
        }
        if (data.surfaceArea <= 0) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['surfaceArea'],
                message: "Please enter a valid area greater than 0."
            });
        }
    }
});


export type FarmProfile = z.infer<typeof farmProfileSchema>;

// Sales Intelligence Types
export const SaleItemSchema = z.object({
    cropName: z.string().describe("The name of the crop sold, translated to English if necessary."),
    quantity: z.number().describe("The quantity of the crop sold."),
    unit: z.string().describe("The unit of the quantity (e.g., kg, box, ton)."),
    unitPrice: z.number().describe("The price per unit."),
    totalPrice: z.number().describe("The total price for this line item (quantity * unitPrice)."),
});

export const SalesDataSchema = z.object({
    items: z.array(SaleItemSchema),
    totalAmount: z.number().describe("The final total amount from the receipt."),
    currency: z.string().describe("The currency of the transaction (e.g., USD, EUR, TND)."),
    vendorName: z.string().optional().describe("The name of the vendor or market if present."),
    transactionDate: z.string().optional().describe("The date of the transaction in YYYY-MM-DD format if present."),
});

export type SaleItem = z.infer<typeof SaleItemSchema>;
export type SalesData = z.infer<typeof SalesDataSchema>;

export type SaleRecord = SalesData & {
    id: string;
    timestamp: string; // ISO string of when it was added
    photoDataUri: string;
};

// Product Catalog Types
export const PRODUCT_CATEGORIES = ["fertilizer", "pesticide", "seed", "tool", "other"] as const;

export const ProductSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
    category: z.enum(PRODUCT_CATEGORIES, { required_error: "Please select a category."}),
    description: z.string().optional(),
    price: z.coerce.number().positive({ message: "Price must be a positive number." }),
    unit: z.string().min(1, { message: "Unit is required (e.g., kg, L, box)." }),
    photoDataUri: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
