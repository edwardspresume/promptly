import type { RequestHandler } from './$types';

import { SECRET_OPENAI_API_KEY } from '$env/static/private';

import OpenAI from 'openai';
import sanitizeHtml from 'sanitize-html';

type PromptData = {
	promptTitle: string;
	promptDescription: string;
};

/**
 * Improves the quality of a given prompt using the OpenAI API.
 * @param {PromptData} promptData - The original title and description of the prompt.
 * @returns {Promise<string>} Refined description of the prompt.
 * @throws {Error} Throws an error if the API call fails or if environment variables are missing.
 */
async function fetchRefinedPrompt(promptData: PromptData) {
	const openai = new OpenAI({
		apiKey: SECRET_OPENAI_API_KEY
	});

	const { promptTitle, promptDescription } = promptData;

	const systemPrompt =
		'Given the title and description of a prompt, please output a refined version of the description that is clearer, more effective, and more detailed, while preserving its original meaning and intent. Please ensure that the output consists solely of the refined description, without any additional text, prefixes, or clarifications.';

	const userPrompt = `Prompt title: "${promptTitle}". Prompt description: "${promptDescription}"`;

	const params: OpenAI.Chat.ChatCompletionCreateParams = {
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userPrompt }
		],
		model: 'gpt-3.5-turbo'
	};

	try {
		const completion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
		const refinedPrompt = completion.choices[0]?.message.content;

		return refinedPrompt;
	} catch (error) {
		console.error('Failed to fetch refined prompt:', error);
		throw new Error('Failed to generate refined prompt. Please try again.');
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		if (!SECRET_OPENAI_API_KEY) {
			return new Response(null, {
				status: 500,
				statusText: 'OPENAI_API_KEY is missing in the environment variables.'
			});
		}

		if (request.headers.get('content-type') !== 'application/json') {
			return new Response(null, {
				status: 400,
				statusText: 'Unsupported content type. Expected application/json'
			});
		}

		const { promptTitle, promptDescription } = (await request.json()) as PromptData;

		const sanitizedPromptTitle = sanitizeHtml(promptTitle);
		const sanitizedPromptDescription = sanitizeHtml(promptDescription);

		const refinedPrompt = await fetchRefinedPrompt({
			promptTitle: sanitizedPromptTitle,
			promptDescription: sanitizedPromptDescription
		});

		return new Response(refinedPrompt, {
			status: 200,
			statusText: 'Refined prompt successfully generated!'
		});
	} catch (error) {
		console.error('Error in refining prompt:', error);

		return new Response(null, {
			status: 500,
			statusText: 'Internal Server Error. Failed to refine prompt.'
		});
	}
};
