import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

import { PromptValidationSchema } from '$utils/validation/promptValidationSchema';

/**
 * Function to improve the prompt using OpenAI API
 * @param {string} promptText - the original prompt text
 * @returns {Promise<string>} - the refined prompt text
 * @throws Will throw an error if the API call fails or environment variable is missing
 */
async function fetchRefinedPrompt(promptText: string) {
    const OPENAI_API_KEY = SECRET_OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        throw new Error(
            'OPENAI_API_KEY is missing in the environment variables.'
        );
    }

    const systemPrompt =
        'Please only output the refined prompt and nothing else. Please do not prefix the refined prompt output with any text.';

    const content = `Please enhance the clarity and effectiveness of this prompt: ${promptText}`;

    const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: content,
                },
            ],
            max_tokens: 4000,
            temperature: 0.6,
        }),
    };

    const response = await fetch(OPENAI_API_URL, options);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API Error: ${errorText}`);
    }

    interface OpenAIResponse {
        choices: {
            message: {
                content: string;
            };
        }[];
    }

    const data = (await response.json()) as OpenAIResponse;
    const refinedPrompt = data?.choices?.[0]?.message.content;
    return refinedPrompt;
}

export const POST: RequestHandler = async ({ request }) => {
    const promptText = await request.text();

    const promptTextSchema = PromptValidationSchema.pick({ text: true });
    const parseResult = promptTextSchema.safeParse({ text: promptText });

    if (!parseResult.success) {
        return new Response(
            `Invalid prompt text: ${parseResult.error.message}`,
            { status: 400 }
        );
    }

    const refinedPrompt = await fetchRefinedPrompt(promptText);

    return new Response(refinedPrompt);
};
