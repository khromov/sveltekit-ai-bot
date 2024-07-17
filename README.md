# SvelteKit AI Assistant

A SvelteKit app that provides an AI-powered chatbot for answering questions about Svelte and SvelteKit. This bot uses the Anthropic Claude API to generate responses based on the latest Svelte and SvelteKit documentation.

Thanks to the new Sonnet 3.5 model with 200k context we can utilize "context stuffing" to put the entire SvelteKit documentation into the context, which provides very good responses. 

You will need to sign up for an [Anthropic API account](https://console.anthropic.com/dashboard) and set the API key in `.env` (see `.env.example`). Keep in mind that adding the docs adds about 80k tokens which costs ~0.2USD/message. 

If you want to do something similar without the API limits, you can use [Claude Projects](https://www.anthropic.com/news/projects) and upload the SvelteKit docs to the project for a similar experience.

![Screenshot 2024-07-17 at 21 03 08](https://github.com/user-attachments/assets/00c7a9f9-6efa-4e4a-8649-281365f46051)


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

## Updating the docs

Use `npm run updatedocs` command to download the latest SvelteKit documentation.

## Wrap up codebase for upload to Claude Projects

```
npx ai-digest
```
