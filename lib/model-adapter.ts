import Anthropic from "@anthropic-ai/sdk";
import type { ChatTurn } from "./types";

// Provider-agnostic shape, so swapping in DeepSeek later (PRD §17 fallback) only touches this file.
export type ChatStreamArgs = {
  systemPrompt: string;
  history: ChatTurn[];
  message: string;
  temperature: number;
  maxTokens: number;
  // Yields a string per delta. Caller decides what to do with it (forward over SSE).
  onToken: (text: string) => void;
};

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and fill it in.",
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

function toAnthropicMessages(
  history: ChatTurn[],
  message: string,
): Anthropic.MessageParam[] {
  const msgs: Anthropic.MessageParam[] = history.map((t) => ({
    role: t.role === "user" ? "user" : "assistant",
    content: t.content,
  }));
  msgs.push({ role: "user", content: message });
  return msgs;
}

export async function streamChat(args: ChatStreamArgs): Promise<void> {
  const c = getClient();
  const stream = c.messages.stream({
    model: DEFAULT_MODEL,
    system: args.systemPrompt,
    messages: toAnthropicMessages(args.history, args.message),
    temperature: args.temperature,
    max_tokens: args.maxTokens,
  });

  stream.on("text", (text) => {
    args.onToken(text);
  });

  await stream.finalMessage();
}
