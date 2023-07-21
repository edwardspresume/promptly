import type { z } from 'zod';

import type {
    PromptValidationSchema,
    TagValidationSchema,
} from '$utils/validationSchemas';

export type PromptSchema = z.infer<typeof PromptValidationSchema>;
export type TagSchema = z.infer<typeof TagValidationSchema>;
