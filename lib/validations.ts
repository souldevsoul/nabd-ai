import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Дұрыс электрондық поштаны енгізіңіз"),
  password: z.string().min(8, "Құпия сөз кемінде 8 таңбадан тұруы керек"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Аты кемінде 2 таңбадан тұруы керек"),
    email: z.string().email("Дұрыс электрондық поштаны енгізіңіз"),
    password: z.string().min(8, "Құпия сөз кемінде 8 таңбадан тұруы керек"),
    confirmPassword: z.string(),
    role: z.enum(["PHOTOGRAPHER", "BUYER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Құпия сөздер сәйкес келмейді",
    path: ["confirmPassword"],
  });

// Profile schemas
export const photographerProfileSchema = z.object({
  displayName: z.string().min(2, "Көрсетілетін аты кемінде 2 таңбадан тұруы керек"),
  handle: z
    .string()
    .min(3, "Тегін кемінде 3 таңбадан тұруы керек")
    .max(30, "Тегін көбінде 30 таңбадан тұруы керек")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Тегінде тек әріптер, сандар және астын сызық болуы мүмкін"
    ),
  bio: z.string().max(500, "Өмірбаян көбінде 500 таңбадан тұруы керек").optional(),
  location: z.string().max(100).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  socialInstagram: z.string().optional(),
  socialX: z.string().optional(),
});

// Photo schemas
export const photoUploadSchema = z.object({
  title: z.string().min(3, "Тақырып кемінде 3 таңбадан тұруы керек").max(100),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).max(10, "Максимум 10 тег рұқсат етіледі").optional(),
  shootDate: z.string().datetime().optional(),
});

export const photoUpdateSchema = photoUploadSchema.partial();

// License schemas
export const licenseOptionSchema = z.object({
  type: z.enum(["PERSONAL", "EDITORIAL", "COMMERCIAL", "EXTENDED"]),
  name: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  priceCents: z.number().min(0),
  currency: z.string().default("USD"),
  usageTerms: z.string().max(2000).optional(),
});

export const licenseRequestSchema = z.object({
  photoId: z.string().cuid(),
  licenseOptionId: z.string().cuid().optional(),
  message: z.string().max(1000).optional(),
  intendedUse: z.string().max(500).optional(),
});

// Admin schemas
export const adminReviewSchema = z.object({
  photoId: z.string().cuid(),
  decision: z.enum(["VERIFIED", "REJECTED", "NEEDS_INFO"]),
  notes: z.string().max(1000).optional(),
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PhotographerProfileInput = z.infer<typeof photographerProfileSchema>;
export type PhotoUploadInput = z.infer<typeof photoUploadSchema>;
export type PhotoUpdateInput = z.infer<typeof photoUpdateSchema>;
export type LicenseOptionInput = z.infer<typeof licenseOptionSchema>;
export type LicenseRequestInput = z.infer<typeof licenseRequestSchema>;
export type AdminReviewInput = z.infer<typeof adminReviewSchema>;
