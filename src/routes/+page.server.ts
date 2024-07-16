import { ANTHROPIC_API_KEY } from '$env/static/private';
import Anthropic from '@anthropic-ai/sdk';
import type { Actions } from './$types';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY,
});

/*
export const actions: Actions = {
	default: async ({ request }) => {
        console.log("woop");
		const data = await request.formData();
		const userMessage = data.get('message') as string;
		const chatHistory = JSON.parse(data.get('chat_history') as string || '[]') as Message[];

		chatHistory.push({ role: 'user', content: userMessage });

		const response = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20240620',
			max_tokens: 1024,
			system: 'You are a professional programmer.',
			messages: chatHistory,
		});

		const assistantMessage = { role: 'assistant', content: response.content[0]?.text || '' };
		chatHistory.push(assistantMessage);

		return {
			chatHistory: JSON.stringify(chatHistory),
		};
	},
};
*/