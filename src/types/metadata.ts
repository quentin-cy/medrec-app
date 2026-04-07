import { z } from 'zod';

export const MetadataSchema = z.object({
  version: z.number().int().nonnegative(),
  exportedAt: z.string(),
});

export type Metadata = z.infer<typeof MetadataSchema>;


