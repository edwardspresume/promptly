import type { z } from 'zod';

import type PromptValidationSchema from '$utils/validation/promptValidationSchema';
import type TagValidationSchema from '$utils/validation/tagValidationSchema';

export type PromptSchema = z.infer<typeof PromptValidationSchema>;
export type TagSchema = z.infer<typeof TagValidationSchema>;
