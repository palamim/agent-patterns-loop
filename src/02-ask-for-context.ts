// ask for context — told it may ask; it asks instead of guessing
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';

const fileUrl = new URL('./example/index.ts', import.meta.url);
const indexFile = readFileSync(fileUrl, 'utf-8');

const messages: Anthropic.MessageParam[] = [
  {
    role: 'user',
    content: `You're a senior software engineer who's an expert in Typescript.
              Look at the code snippet below. Your goal is to improve the greeting logic:
              - If the user is a man, the greeting should end with 'What's up man?'
              - If the user is a woman, it should end with 'What's up girl?'

              --- CODE SNIPPET ---
              ${indexFile}
              
              IMPORTANT: if you're not confident you can give a reliable answer
              and feel you need more context, don't give the final answer.
              Simply ask for more context and what specific context you want.`,
  },
];

const main = async () => {
  const client = new Anthropic();

  const message = await client.messages.create({
    max_tokens: 4096,
    model: 'claude-haiku-4-5',
    messages: messages,
  });

  const lastBlock = message.content.filter((b) => b.type === 'text').pop();
  const text = lastBlock && lastBlock.type === 'text' ? lastBlock.text : '';

  console.log(text);
};

main();
