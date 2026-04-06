import { z } from 'zod';

export const SexEnum = z.enum(['male', 'female', 'unknown']);
export type Sex = z.infer<typeof SexEnum>;

export const WeighingSchema = z.object({
  id: z.uuid(),
  date: z.iso.date().min(1, 'Date is required'),
  weight_kg: z.number().positive('Weight must be positive'),
});

export type Weighing = z.infer<typeof WeighingSchema>;

export const AnimalRecordSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().default(''),
  dateOfBirth: z.string().default(''),
  sex: SexEnum.default('unknown'),
  weight_history: z.array(WeighingSchema).default([]),
  microchipId: z.string().nullable().default(null),
});

export type AnimalRecord = z.infer<typeof AnimalRecordSchema>;

export const MedRecFileSchema = z.object({
  animal: AnimalRecordSchema,
});

export type MedRecFile = z.infer<typeof MedRecFileSchema>;
