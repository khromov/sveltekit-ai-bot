import { ANTHROPIC_API_KEY } from '$env/static/private';
import Anthropic from '@anthropic-ai/sdk';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { TextBlock } from '@anthropic-ai/sdk/resources/messages.mjs';
import { getSystemPrompt } from '$lib/systemPrompt';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY,
});

const systemPrompt = getSystemPrompt();

export const actions: Actions = {
	default: async ({ request }) => {
        //return fail(503, {  error: 'debug', chatHistory: null, });
		try {
			const data = await request.formData();
			const userMessage = data.get('message') as string;
			const chatHistory = JSON.parse(data.get('chat_history') as string || '[]');

			chatHistory.push({ role: 'user', content: userMessage });

			const response = await anthropic.messages.create({
				model: 'claude-3-5-sonnet-20240620',
				max_tokens: 4096,
				system: systemPrompt,
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
				chatHistory: null, // Can you create a Flappy Bird clone in SvelteKit with a high scores function?
			});
		}
	},
};