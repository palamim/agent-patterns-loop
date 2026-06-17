# agent-patterns-loop

A tiny, runnable companion to the **The Loop** concept on [Agent Patterns](#).

It shows — in plain TypeScript, no framework — the difference between calling a language model **once, blind** and wrapping it in **a loop that can gather context and act**. Each stage is a single file you can run and watch.

## The idea

A raw LLM call is a single, stateless strike: text in, text out, no memory, no ability to look things up. Give it one file and ask it to improve the code, and it will _guess_ about everything it can't see — and guess wrong.

A loop changes that. It lets the model ask for more context (read another file), see the result, and only then act. Same model. Different outcome.

This repo demonstrates that progression in four runnable stages.

## The sample code

The model is asked to improve a small program:

- `src/example/index.ts` — greets a user by name.
- `src/example/users.ts` — defines the `User` type and `getUser`, which `index.ts` depends on.

Improving `index.ts` _correctly_ requires knowing what's in `users.ts` — the shape of `User` (including that `gender` is `'Man' | 'Woman'`, not `'male'/'female'`) and that `getUser` can return `undefined`. Seeing only `index.ts` is not enough. That's the whole point.

## The stages

Run them in order and compare the output.

```bash
npm run 01   # blind call    — sees only index.ts, guesses, gets it wrong
npm run 02   # ask for context — told it may ask; it asks instead of guessing
npm run 03   # with tools    — asked to return structured JSON the loop can read
npm run 04   # the loop      — read → reason → act → repeat, with memory
```

- **`src/01-blind-call.ts`** — sends only `index.ts`. The model has to guess about `users.ts` and produces an answer that is confident but wrong (it invents values that don't exist).
- **`src/02-ask-for-context.ts`** — the prompt now tells the model it may ask for more context instead of answering. It stops guessing and asks. Correct, but the goal still isn't done.
- **`src/03-with-tools.ts`** — the prompt asks the model to reply in a fixed JSON shape (`{ finalAnswer, content }`) so a program can tell whether it's done or requesting a file. This is the structured output a loop needs.
- **`src/04-the-loop.ts`** — the full pattern. The loop calls the model, reads its structured reply, feeds back the requested file, and calls again — carrying the whole conversation forward as memory — until the model returns a final answer.

Each stage is a self-contained file you can read top to bottom. The progression is also visible as a diff between consecutive files.

## Running it yourself

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Create your own `.env` in the project root with your Anthropic API key (see `.env.example`):
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Run any stage:
   ```bash
   npm run 01
   ```

Requires Node and an Anthropic API key. Stages run with [`tsx`](https://github.com/privatenumber/tsx), so there is nothing to compile. The examples use a small, inexpensive model for learning purposes — model names may change over time, and outputs will vary between runs.

## Why this exists

Most explanations of "agents" start at the framework. This starts at the substrate: what a single model call actually is, and what the loop adds on top. For the full walkthrough — with the reasoning, the visuals, and the analogy — read [The Loop on Agent Patterns](#).
