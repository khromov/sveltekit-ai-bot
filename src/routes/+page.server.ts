import { env } from '$env/dynamic/private';
import Anthropic from '@anthropic-ai/sdk';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { TextBlock } from '@anthropic-ai/sdk/resources/messages.mjs';
import { getSystemPromptWithDocs, getSystemPromptWithoutDocs } from '$lib/systemPrompt';
import { building } from '$app/environment';

const anthropic = new Anthropic({
	apiKey: building ? '' : env.ANTHROPIC_API_KEY,
});

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const data = await request.formData();
			const userMessage = data.get('message') as string;
			const chatHistory = JSON.parse(data.get('chat_history') as string || '[]');
			const includeDocs = data.get('include_docs') !== null;

			chatHistory.push({ role: 'user', content: userMessage });

			const systemPrompt = includeDocs ? getSystemPromptWithDocs() : getSystemPromptWithoutDocs();

			if(includeDocs) {
				console.log('Using system prompt with docs');
			} else {
				console.log('Using system prompt without docs');
			}

			const response = await anthropic.beta.promptCaching.messages.create({
				model: 'claude-3-5-sonnet-20240620', // 'claude-3-haiku-20240307',
				max_tokens: 4096,
				system: [
					{
						type: 'text',
						text: systemPrompt,
						cache_control: includeDocs ? {
							type: 'ephemeral'
						} : undefined
					}
				],
				messages: chatHistory,
			});

			const blocks = response.content as TextBlock[];

			const assistantMessage = { role: 'assistant', content: blocks[0].text || '' };
			chatHistory.push(assistantMessage);

			return {
				chatHistory: JSON.stringify(chatHistory),
			};
		} catch (error) {
			console.error('Error in chat action:', error);
			return fail(503, { 
				error: `An error occurred while processing your request: ${error?.message}`,
				chatHistory: null,
			});
		}
	},
};