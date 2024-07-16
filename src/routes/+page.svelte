<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	import type { Message } from './+page';

	export let data: PageData;
	export let form: { chatHistory: string; error?: string } | null = null;

	let messages: Message[] = data.messages;
	let userInput = '';
	let sending = false;

	$: {
		if (form?.chatHistory) {
			messages = JSON.parse(form.chatHistory);
			updateLocalStorage();
		}
		if (form?.error) {
			toast.error(form.error);
		}
	}

	function updateLocalStorage() {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('chat_messages', JSON.stringify(messages));
		}
	}
</script>

<h1>Chat with Claude</h1>

<div class="chat-container">
	{#each messages as message}
		<div class="message {message.role}">
			<p>{message.content}</p>
		</div>
	{/each}
</div>

<form
	method="POST"
	use:enhance={() => {
		sending = true;
		return ({ update }) => {
			update({ invalidateAll: true }).finally(() => {
				sending = false;
			});
		};
	}}
>
	<input type="hidden" name="chat_history" value={JSON.stringify(messages)} />
	<input
		type="text"
		name="message"
		bind:value={userInput}
		placeholder="Type your message..."
		required
		disabled={sending}
	/>
	<button type="submit" disabled={sending}>
		{sending ? 'Sending...' : 'Send'}
	</button>
</form>

<style>
	.chat-container {
		max-width: 800px;
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 5px;
		height: 400px;
		overflow-y: auto;
	}

	.message {
		margin-bottom: 10px;
		padding: 10px;
		border-radius: 5px;
	}

	.user {
		background-color: #e6f3ff;
		text-align: right;
	}

	.assistant {
		background-color: #f0f0f0;
	}

	form {
		max-width: 800px;
		margin: 20px auto;
		display: flex;
	}

	input {
		flex-grow: 1;
		padding: 10px;
		font-size: 16px;
	}

	button {
		padding: 10px 20px;
		font-size: 16px;
		background-color: #4CAF50;
		color: white;
		border: none;
		cursor: pointer;
	}

	button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}
</style>