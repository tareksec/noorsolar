import { z } from "zod";

// Phone regex allowing Bangladeshi formats (+8801..., 01..., etc.) and international numbers
const phoneRegex = /^(\+?[0-9]{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\s-]{7,15}$/;

export const quoteRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  phone: z
    .string()
    .trim()
    .min(8, "Phone number is required")
    .max(20, "Phone number cannot exceed 20 characters")
    .refine((val) => phoneRegex.test(val), {
      message: "Please enter a valid phone or mobile number",
    }),
  company: z
    .string()
    .trim()
    .max(120, "Company name cannot exceed 120 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal("")),
  buyerType: z
    .string()
    .trim()
    .max(80, "Buyer type cannot exceed 80 characters")
    .optional()
    .or(z.literal("")),
  category: z
    .string()
    .trim()
    .max(100, "Category cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
  productId: z.string().optional().or(z.literal("")),
  quantity: z
    .string()
    .trim()
    .max(100, "Quantity description cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .trim()
    .max(150, "Delivery location cannot exceed 150 characters")
    .optional()
    .or(z.literal("")),
  requiredDate: z
    .string()
    .trim()
    .max(100, "Required timeframe cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(1000, "Message cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  // Honeypot field for bot spam deterrence
  website_hp: z.string().optional(),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
