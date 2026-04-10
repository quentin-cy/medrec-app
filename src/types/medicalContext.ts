import { z } from 'zod';

const TypeOptionSchema = z.object({
  value: z.number().int().nonnegative(),
  label: z.string().min(1, 'Label is required'),
});

export type TypeOption = z.infer<typeof TypeOptionSchema>;

export const DEFAULT_PEST_CONTROL_TYPES: TypeOption[] = [
  { value: 0, label: 'Dewormer' },
];

export const DEFAULT_VACCINATION_TYPES: TypeOption[] = [
  { value: 0, label: 'Rabies' },
];

export const DEFAULT_VETS: VetOption[] = [
  { value: 0, name: 'Dr. Smith', practice: '' },
];

const VetOptionSchema = z.object({
  value: z.number().int().nonnegative(),
  name: z.string().min(1, 'Name is required'),
  practice: z.string().default(''),
});

export type VetOption = z.infer<typeof VetOptionSchema>;

export const ContextSchema = z.object({
  pest_control_types: z
    .array(TypeOptionSchema)
    .default(DEFAULT_PEST_CONTROL_TYPES),
  vaccination_types: z
    .array(TypeOptionSchema)
    .default(DEFAULT_VACCINATION_TYPES),
  vets: z.array(VetOptionSchema).default(DEFAULT_VETS),
});

export type MedicalContext = z.infer<typeof ContextSchema>;