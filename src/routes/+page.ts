import { browser } from '$app/environment';
import type { PageLoad } from './$types';

export type Message = {
	role: 'user' | 'assistant';
	content: string;
};

export const load: PageLoad = async () => {
	let messages: Message[] = [];
	
	if (browser) {
		const storedMessages = localStorage.getItem('chat_messages');
		if (storedMessages) {
			messages = JSON.parse(storedMessages);
		}
	}

	return {
		messages,
	};
};
