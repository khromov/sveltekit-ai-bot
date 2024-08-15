import { browser } from '$app/environment';
import type { PageLoad } from './$types';

export type Message = {
	role: 'user' | 'assistant';
	content: string;
};

export const load: PageLoad = async () => {
	let messages: Message[] = [];
	let includeDocs: boolean = true;
	
	if (browser) {
		const storedMessages = localStorage.getItem('chat_messages');
		const storedIncludeDocs = localStorage.getItem('includeDocs');
		if (storedMessages) {
			messages = JSON.parse(storedMessages);
			includeDocs = storedIncludeDocs === 'true';
		}
	}

	return {
		messages,
		includeDocs: includeDocs
	};
};
