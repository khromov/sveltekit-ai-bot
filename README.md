# sveltekit-ai-bot

A SvelteKit app that provides an AI-powered chatbot for answering questions about Svelte and SvelteKit. This bot uses the Anthropic Claude API to generate responses based on the latest Svelte and SvelteKit documentation.

<img width="884" alt="Screenshot 2024-07-17 at 01 25 31" src="https://github.com/user-attachments/assets/efe85c3e-3db1-4099-be01-e111401e66c8">

## Features

- AI-powered responses for Svelte and SvelteKit queries
- Real-time chat interface
- Markdown support for formatted code examples
- Local storage for chat history persistence

## Getting started

```bash
cp .env.example .env # Fill in the .env file with Anthropic API key
nvm i && nvm use
npm i
npm run dev
```

Visit http://localhost:5173 to start chatting with the AI assistant.

## Usage

Simply type your Svelte or SvelteKit related questions into the chat interface. The AI will provide answers, explanations, and code examples based on the latest documentation.

## Wrap up codebase for upload to Claude Projects

```
npx ai-digest
```