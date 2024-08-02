<script lang="ts">
	import { enhance } from '$app/forms';
    import SvelteMarkdown from 'svelte-markdown'
	import { onMount, tick } from 'svelte';
	import toast from 'svelte-french-toast';
	import type { PageData, ActionData } from './$types';
	import type { Message } from './+page';
	import Intro from '$lib/Intro.svelte';
	import Outro from '$lib/Outro.svelte';

	export let data: PageData;
	export let form: ActionData;

	let messages: Message[] = data.messages;
	let userInput = '';
	let sending = false;
	let chatContainer: HTMLDivElement;
	let inputElement: HTMLInputElement;

	$: if (form?.chatHistory) {
		messages = JSON.parse(form.chatHistory);
		updateLocalStorage();
		scrollToBottom();
	}

	function updateLocalStorage() {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('chat_messages', JSON.stringify(messages));
		}
	}

	async function scrollToBottom() {
		await tick();
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}

	async function focusInput() {
		await tick();
		inputElement.focus();
	}
    
	onMount(() => {
		focusInput();
		scrollToBottom();
	});

	function handleClearChat() {
		messages = [];
		updateLocalStorage();
	}
</script>

<main>
	<Intro />
	<div class="chat-container" bind:this={chatContainer}>
		{#if messages.length === 0}
			<p class="empty-state">No messages yet. Start the conversation by asking a question about SvelteKit!</p>
		{:else}
			{#each messages as message}
				<div class="message {message.role}">
					<SvelteMarkdown source={message.content} />
				</div>
			{/each}
		{/if}
	</div>

	<form
		method="POST"
		use:enhance={() => {
			sending = true;
			return ({ update, result }) => {
				update({ invalidateAll: true }).finally(async () => {
					sending = false;
					if (result.type === 'failure') {
						toast.error(result.data?.error || 'An error occurred');
					} else {
						userInput = '';
						await scrollToBottom();
					}
					focusInput();
				});
			};
		}}
	>
		<input type="hidden" name="chat_history" value={JSON.stringify(messages)} />
		<div class="input-container">
			<input
				type="text"
				name="message"
				bind:value={userInput}
				bind:this={inputElement}
				placeholder="Ask about SvelteKit..."
				required
				disabled={sending}
			/>
			<button type="submit" disabled={sending} class="send-button">
				{sending ? 'Sending...' : 'Send'}
			</button>
		</div>
		<div class="checkbox-container">
			<label>
				<input type="checkbox" name="include_docs" />
				Include full SvelteKit documentation (adds ~80k tokens, increases cost by ~$0.2 USD/message)
			</label>
		</div>
		<button type="button" on:click={handleClearChat} class="clear-button">Clear Chat</button>
	</form>
	<Outro/>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
	}

	.chat-container {
		background-color: #f7f7f7;
		border-radius: 12px;
		padding: 20px;
		height: 400px;
		overflow-y: auto;
		margin-bottom: 20px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.empty-state {
		color: #999;
		text-align: center;
		margin-top: 180px;
	}

	.message {
		margin-bottom: 15px;
		padding: 12px;
		border-radius: 18px;
		max-width: 80%;
	}

	.user {
		background-color: #007aff;
		color: white;
		align-self: flex-end;
		margin-left: auto;
	}

	.assistant {
		background-color: #e5e5ea;
		color: #333;
	}

	form {
		display: flex;
		flex-direction: column;
	}

	.input-container {
		display: flex;
		margin-bottom: 10px;
	}

	input[type="text"] {
		flex-grow: 1;
		padding: 12px;
		font-size: 16px;
		border: 1px solid #ccc;
		border-radius: 25px;
		outline: none;
	}

	button {
		padding: 12px 20px;
		font-size: 16px;
		color: white;
		border: none;
		cursor: pointer;
		border-radius: 25px;
		transition: background-color 0.3s ease;
	}

	.send-button {
		background-color: #007aff;
		margin-left: 10px;
	}

	.send-button:hover {
		background-color: #0056b3;
	}

	.send-button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}

	.clear-button {
		background-color: #ff3b30;
		align-self: center;
		margin-top: 10px;
	}

	.clear-button:hover {
		background-color: #d63029;
	}

	.checkbox-container {
		margin-bottom: 10px;
	}

	.checkbox-container label {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #666;
	}

	.checkbox-container input[type="checkbox"] {
		margin-right: 8px;
	}
</style>