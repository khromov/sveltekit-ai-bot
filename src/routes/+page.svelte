<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import toast from 'svelte-french-toast';
	import type { PageData, ActionData } from './$types';
	import type { Message } from './+page';

	export let data: PageData;
	export let form: ActionData;

	let messages: Message[] = data.messages;
	let userInput = '';
	let sending = false;
	let chatContainer: HTMLDivElement;
	let inputElement: HTMLInputElement;

	$: console.log('xx', form);

	$: if (form?.chatHistory) {
		// When form errors it returns null as chatHistory so we don't update the messages
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
		focusInput(); // TODO: For some reason not working
		scrollToBottom();
	});
</script>

<h1>Chat with Claude</h1>

<div class="chat-container" bind:this={chatContainer}>
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
	<input
		type="text"
		name="message"
		bind:value={userInput}
		bind:this={inputElement}
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
		background-color: #4caf50;
		color: white;
		border: none;
		cursor: pointer;
	}

	button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}
</style>