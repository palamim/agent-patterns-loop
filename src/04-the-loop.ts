// the loop      — read → reason → act → repeat, with memory
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';

const indexUrl = new URL('./example/index.ts', import.meta.url);
const usersUrl = new URL('./example/users.ts', import.meta.url);
const indexFile = readFileSync(indexUrl, 'utf-8');
const usersFile = readFileSync(usersUrl, 'utf-8');

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
              To gather more context, you may ask to read a specific project file.
              ALWAYS return a JSON object in the exact shape below:

              {
                finalAnswer: <true/false>,
                content: <your-response>
              }
                    
              If you need more context, finalAnswer should de false and content should be 'read_file'.
              If it's yous final answer, finalAnswer should be true and content should be the code snippet.`,
  },
];

interface Response {
  finalAnswer: boolean;
  content: string;
}

const extractResponse = (message: Anthropic.Messages.Message): Response => {
  let response;
  const lastBlock = message.content.filter((b) => b.type === 'text').pop();
  const text = lastBlock && lastBlock.type === 'text' ? lastBlock.text : '';

  const match = text.match(/\{[\s\S]*\}/);
  // naive: grabs the first {...} block. Fine for this demo; a real agent needs sturdier parsing.
  if (!match) {
    console.error('No JSON found:\n', text);
    process.exit(1);
  }
  try {
    response = JSON.parse(match[0]);
  } catch {
    console.error('Could not parse JSON:\n', match[0]);
    process.exit(1);
  }
  return response;
};

const runAgent = async (client: Anthropic) => {
  let response: Response | null = null;

  let steps = 0;
  const MAX_STEPS = 3;
  while (steps < MAX_STEPS) {
    steps++;
    const message = await client.messages.create({
      max_tokens: 4096,
      model: 'claude-haiku-4-5',
      messages: messages,
    });

    // The model has no memory. The loop holds it: every pass we replay
    // the full conversation by pushing onto `messages`.
    messages.push({
      role: 'assistant',
      content: message.content,
    });

    response = extractResponse(message);

    if (response?.finalAnswer === true) {
      console.log(response.content);
      break;
    }

    if (response?.finalAnswer === false) {
      console.log(`Not the model's final answer. Model asked for: ${response.content}`);
      // Model asked for context. The loop "executes the tool" (here: reads
      // users.ts) and feeds the result back.
      messages.push({
        role: 'user',
        content: `Here's the users file: ${usersFile}`,
      });
    }
  }

  if (!response) {
    console.error('Ended loop without a response (hit MAX_STEPS).');
    process.exit(1);
  }
};

const main = async () => {
  const client = new Anthropic();

  await runAgent(client);
};

main();
