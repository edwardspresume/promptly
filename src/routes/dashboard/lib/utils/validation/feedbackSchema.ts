import { z } from 'zod';

const MIN_FEEDBACK_LENGTH = 10;

export const FeedbackSchema = z.object({
    message: z
        .string()
        .min(
            MIN_FEEDBACK_LENGTH,
            `Feedback must be at least ${MIN_FEEDBACK_LENGTH} characters`
        )
        .transform((str) => str.trim()),
});
