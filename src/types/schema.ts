import { z } from 'zod';

export const SexEnum = z.enum(['male', 'female', 'unknown']);
export type Sex = z.infer<typeof SexEnum>;

export const WeighingSchema = z.object({
  id: z.uuid(),
  date: z.iso.date().min(1, 'Date is required'),
  weight_kg: z.number().positive('Weight must be positive'),
});

export type Weighing = z.infer<typeof WeighingSchema>;

const PestControlTypeEnum = {
  Dewormer: 0,
  FleaProtection: 1,
} as const;

export const PestControlSchema = z.object({
  id: z.uuid(),
  date: z.iso.date().min(1, 'Date is required'),
  type: z.enum(PestControlTypeEnum, 'Invalid pest control type'),
  reference: z.string().min(1, 'Reference is required'),
  comment: z.string().default(''),
});

export type PestControl = z.infer<typeof PestControlSchema>;

export const AnimalRecordSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().default(''),
  dateOfBirth: z.string().default(''),
  sex: SexEnum.default('unknown'),
  weight_history: z.array(WeighingSchema).default([]),
  pest_control_history: z.array(PestControlSchema).default([]),
  microchipId: z.string().nullable().default(null),
});

export type AnimalRecord = z.infer<typeof AnimalRecordSchema>;

export const MedRecFileSchema = z.object({
  animal: AnimalRecordSchema,
});

export type MedRecFile = z.infer<typeof MedRecFileSchema>;
