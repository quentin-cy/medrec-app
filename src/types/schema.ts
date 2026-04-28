import { z } from 'zod';
import { MetadataSchema } from './metadata.ts';
import {
  ContextSchema,
  DEFAULT_PEST_CONTROL_TYPES,
  DEFAULT_VACCINATION_TYPES,
  DEFAULT_VETS,
} from './medicalContext.ts';

export const SexEnum = z.enum(['male', 'female', 'unknown']);
export type Sex = z.infer<typeof SexEnum>;

export const EventTypeEnum = z.enum([
  'vaccination',
  'pest_control',
  'weighing',
  'appointment',
]);
export type EventType = z.infer<typeof EventTypeEnum>;

const BaseEventFields = {
  id: z.uuid(),
  date: z.iso.date().min(1, 'Date is required'),
};

export const VaccinationEventSchema = z.object({
  ...BaseEventFields,
  eventType: z.literal('vaccination'),
  types: z
    .array(z.number().int().nonnegative('Invalid vaccination type'))
    .min(1, 'At least one vaccination type is required'),
  reference: z.string().min(1, 'Reference is required'),
  vet: z.number().int().nonnegative('Invalid vet'),
});

export type VaccinationEvent = z.infer<typeof VaccinationEventSchema>;

export const PestControlEventSchema = z.object({
  ...BaseEventFields,
  eventType: z.literal('pest_control'),
  type: z.number().int().nonnegative('Invalid pest control type'),
  reference: z.string().min(1, 'Reference is required'),
  comment: z.string().default(''),
});

export type PestControlEvent = z.infer<typeof PestControlEventSchema>;

export const WeighingEventSchema = z.object({
  ...BaseEventFields,
  eventType: z.literal('weighing'),
  weight_kg: z.number().positive('Weight must be positive'),
});

export type WeighingEvent = z.infer<typeof WeighingEventSchema>;

export const AppointmentEventSchema = z.object({
  ...BaseEventFields,
  eventType: z.literal('appointment'),
  vet: z.number().int().nonnegative('Invalid vet'),
  comment: z.string().default(''),
  price: z.number().nonnegative('Price must be non-negative').default(0),
});

export type AppointmentEvent = z.infer<typeof AppointmentEventSchema>;

export const EventSchema = z.discriminatedUnion('eventType', [
  VaccinationEventSchema,
  PestControlEventSchema,
  WeighingEventSchema,
  AppointmentEventSchema,
]);

export type Event = z.infer<typeof EventSchema>;

export const AnimalRecordSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().default(''),
  dateOfBirth: z.string().default(''),
  sex: SexEnum.default('unknown'),
  events: z.array(EventSchema).default([]),
  microchipId: z.string().nullable().default(null),
});

export type AnimalRecord = z.infer<typeof AnimalRecordSchema>;

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
