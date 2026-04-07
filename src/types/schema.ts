import { z } from 'zod';

export const SexEnum = z.enum(['male', 'female', 'unknown']);
export type Sex = z.infer<typeof SexEnum>;

export const WeighingSchema = z.object({
  id: z.uuid(),
  date: z.iso.date().min(1, 'Date is required'),
  weight_kg: z.number().positive('Weight must be positive'),
});

export type Weighing = z.infer<typeof WeighingSchema>;

export const PestControlSchema = z.object({
  id: z.uuid(),
  date: z.iso.date().min(1, 'Date is required'),
  type: z.number().int().nonnegative('Invalid pest control type'),
  reference: z.string().min(1, 'Reference is required'),
  comment: z.string().default(''),
});

export type PestControl = z.infer<typeof PestControlSchema>;

export const VaccinationSchema = z.object({
  id: z.uuid(),
  date: z.iso.date().min(1, 'Date is required'),
  type: z.number().int().nonnegative('Invalid vaccination type'),
  reference: z.string().min(1, 'Reference is required'),
  vet: z.number().int().nonnegative('Invalid vet'),
});

export type Vaccination = z.infer<typeof VaccinationSchema>;

export const AnimalRecordSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().default(''),
  dateOfBirth: z.string().default(''),
  sex: SexEnum.default('unknown'),
  weight_history: z.array(WeighingSchema).default([]),
  pest_control_history: z.array(PestControlSchema).default([]),
  vaccination_history: z.array(VaccinationSchema).default([]),
  microchipId: z.string().nullable().default(null),
});

export type AnimalRecord = z.infer<typeof AnimalRecordSchema>;

export const MetadataSchema = z.object({
  version: z.number().int().nonnegative(),
  exportedAt: z.string(),
});

export type Metadata = z.infer<typeof MetadataSchema>;

export const TypeOptionSchema = z.object({
  value: z.number().int().nonnegative(),
  label: z.string().min(1, 'Label is required'),
});

export type TypeOption = z.infer<typeof TypeOptionSchema>;

const DEFAULT_PEST_CONTROL_TYPES: TypeOption[] = [
  { value: 0, label: 'Dewormer' },
  { value: 1, label: 'Flea Protection' },
];

const DEFAULT_VACCINATION_TYPES: TypeOption[] = [
  { value: 0, label: 'Rabies' },
  { value: 1, label: 'DHPP' },
  { value: 2, label: 'Bordetella' },
];

const DEFAULT_VETS: TypeOption[] = [{ value: 0, label: 'Dr. Smith' }];

export const ContextSchema = z.object({
  pest_control_types: z
    .array(TypeOptionSchema)
    .default(DEFAULT_PEST_CONTROL_TYPES),
  vaccination_types: z
    .array(TypeOptionSchema)
    .default(DEFAULT_VACCINATION_TYPES),
  vets: z.array(TypeOptionSchema).default(DEFAULT_VETS),
});

export type Context = z.infer<typeof ContextSchema>;

export const MedRecFileSchema = z.object({
  metadata: MetadataSchema.default({ version: 0, exportedAt: '' }),
  context: ContextSchema.default({
    pest_control_types: DEFAULT_PEST_CONTROL_TYPES,
    vaccination_types: DEFAULT_VACCINATION_TYPES,
    vets: DEFAULT_VETS,
  }),
  animal: AnimalRecordSchema,
});

export type MedRecFile = z.infer<typeof MedRecFileSchema>;
