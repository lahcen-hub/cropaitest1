
import { z } from "zod";

export const CROP_TYPES = ["tomato", "potato", "citrus", "wheat", "corn", "olives", "rice", "barley", "soybeans", "grapes", "lettuce", "carrots", "cucumber"] as const;
export const ROLES = ["farmer", "technician", "supplier"] as const;
export const LANGUAGES = ["en", "fr", "ar"] as const;
export const LANGUAGE_MAP: { [key in (typeof LANGUAGES)[number]]: string } = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export const CROP_BOX_WEIGHTS: { [key: string]: number } = {
    tomato: 31,
    cucumber: 27,
    potato: 25,
};

export const CROP_EMOJI_MAP: { [key: string]: string } = {
    tomato: "🍅",
    potato: "🥔",
    citrus: "🍊",
    wheat: "🌾",
    corn: "🌽",
    olives: "🫒",
    rice: "🍚",
    barley: "🌾",
    soybeans: "🌱",
    grapes: "🍇",
    lettuce: "🥬",
    carrots: "🥕",
    cucumber: "🥒",
};


export const farmProfileSchema = z.object({
  role: z.enum(ROLES, {
    required_error: "Veuillez sélectionner votre rôle.",
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
                message: "Le nom de l'entreprise est requis pour les fournisseurs."
            });
        }
    } else { // farmer or technician
        if (data.crops.length < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['crops'],
                message: "Veuillez sélectionner au moins une culture."
            });
        }
        if (data.surfaceArea <= 0) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['surfaceArea'],
                message: "Veuillez entrer une superficie valide supérieure à 0."
            });
        }
    }
});


export type FarmProfile = z.infer<typeof farmProfileSchema>;

export const SaleItemSchema = z.object({
    cropName: z.string().describe("Le nom de la culture vendue, traduit en anglais si nécessaire."),
    quantity: z.number().describe("La quantité de la culture vendue."),
    unit: z.string().describe("L'unité de la quantité (par ex., kg, caisse, tonne)."),
});

export const SalesDataSchema = z.object({
    items: z.array(SaleItemSchema),
    transactionDate: z.string().optional().describe("La date de la transaction au format AAAA-MM-JJ si présente."),
});

export type SaleItem = z.infer<typeof SaleItemSchema>;
export type SalesData = z.infer<typeof SalesDataSchema>;

export type SaleRecord = Omit<SalesData, 'photoDataUri'> & {
    id: string;
    timestamp: string;
};

export const InvoiceItemSchema = z.object({
    name: z.string().describe("Le nom de l'article acheté."),
    quantity: z.number().describe("La quantité de l'article acheté."),
    unit: z.string().describe("L'unité de l'article (par ex., kg, L, sac)."),
    price: z.number().describe("Le prix par unité ou le prix total de l'article."),
});

export const InvoiceDataSchema = z.object({
    items: z.array(InvoiceItemSchema),
    supplierName: z.string().optional().describe("Le nom du fournisseur ou du vendeur."),
    transactionDate: z.string().optional().describe("La date de la facture au format AAAA-MM-JJ."),
    totalAmount: z.number().optional().describe("Le montant total de la facture."),
});

export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type InvoiceData = z.infer<typeof InvoiceDataSchema>;

export type InvoiceRecord = InvoiceData & {
    id: string;
    timestamp: string;
};


export const PRODUCT_CATEGORIES = ["fertilizer", "pesticide", "seed", "tool", "other"] as const;

export const ProductSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, { message: "Le nom du produit doit comporter au moins 3 caractères." }),
    category: z.enum(PRODUCT_CATEGORIES, { required_error: "Veuillez sélectionner une catégorie."}),
    description: z.string().optional(),
    price: z.coerce.number().positive({ message: "Le prix doit être un nombre positif." }),
    unit: z.string().min(1, { message: "L'unité est requise (par ex., kg, L, caisse)." }),
    photoDataUri: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const EMPLOYEE_ROLES = ["driver", "field_worker"] as const;

export const EmployeeSchema = z.object({
    id: z.string(),
    name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères." }),
    role: z.enum(EMPLOYEE_ROLES, { required_error: "Veuillez sélectionner un rôle." }),
    contact: z.string().min(10, { message: "Le contact doit être un numéro de téléphone valide." }),
    status: z.enum(["active", "inactive"]),
});

export type Employee = z.infer<typeof EmployeeSchema>;
