import sanitizeHtml from 'sanitize-html';

import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

import { PromptsValidationSchema } from '$dashboardValidationSchemas/promptsValidationSchema';

/**
 * Function to improve the prompt using OpenAI API
 * @param {string} promptText - the original prompt text
 * @returns {Promise<string>} - the refined prompt text
 * @throws Will throw an error if the API call fails or environment variable is missing
 */
async function fetchRefinedPrompt(promptText: string) {
	const OPENAI_API_KEY = SECRET_OPENAI_API_KEY;

	if (!OPENAI_API_KEY) {
		throw new Error('OPENAI_API_KEY is missing in the environment variables.');
	}

	// const systemPrompt =
	//     'Please output only the rephrased prompt without any prefixes or additional text.';
	// const content = `Please enhance the clarity and effectiveness of the following prompt: ${promptText}`;

	const systemPrompt =
		'Please output only the rephrased prompt without any prefixes or additional text.';

	const content = `Please rephrase the following prompt to make it more clear, effective, and detailed, while preserving its original meaning and intent: ${promptText}`;

	const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: systemPrompt
				},
				{
					role: 'user',
					content: content
				}
			],
			max_tokens: 4000,
			temperature: 0.6
		})
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
	if (request.headers.get('content-type') !== 'text/plain') {
		return new Response(`Unsupported content type. Expected text/plain`, {
			status: 415
		});
	}

	const promptText = await request.text();

	const promptTextSchema = PromptsValidationSchema.pick({ text: true });
	const parseResult = promptTextSchema.safeParse({ text: promptText });

	if (!parseResult.success) {
		const errorMessage = parseResult.error.flatten().fieldErrors.text?.join(', ');

		return new Response(errorMessage, {
			status: 400
		});
	}

	try {
		const sanitizedPromptText = sanitizeHtml(promptText);

		const refinedPrompt = await fetchRefinedPrompt(sanitizedPromptText);

		return new Response(refinedPrompt, {
			status: 200,
			statusText: 'Refined prompt successfully generated!'
		});
	} catch (error) {
		console.error(error);
		return new Response('An error occurred while refining the prompt.', {
			status: 500
		});
	}
};
