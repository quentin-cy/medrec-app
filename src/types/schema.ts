import { z } from 'zod';

export const SexEnum = z.enum(['male', 'female', 'unknown']);
export type Sex = z.infer<typeof SexEnum>;

export const AnimalSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().default(''),
  dateOfBirth: z.string().default(''),
  sex: SexEnum.default('unknown'),
  weight: z
    .number()
    .nonnegative('Weight must be positive')
    .nullable()
    .default(null),
  microchipId: z.string().nullable().default(null),
  ownerName: z.string().default(''),
  ownerPhone: z.string().default(''),
});

export type Animal = z.infer<typeof AnimalSchema>;

export const MedRecFileSchema = z.object({
  animal: AnimalSchema,
});

export type MedRecFile = z.infer<typeof MedRecFileSchema>;
