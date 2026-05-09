import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";
import type { ChatTurn } from "./types";

// Provider-agnostic shape used by the API route. Adding another provider later
// (e.g. Aliyun Bailian, OpenRouter) means writing one more `streamX()` function
// and dispatching to it from streamChat() — nothing else has to change.
export type ChatStreamArgs = {
  systemPrompt: string;
  history: ChatTurn[];
  message: string;
  temperature: number;
  maxTokens: number;
  onToken: (text: string) => void;
};

type Provider = "anthropic" | "openai";

function getProvider(): Provider {
  const raw = (process.env.MODEL_PROVIDER ?? "anthropic").toLowerCase();
  if (raw === "openai" || raw === "deepseek" || raw === "openrouter") {
    return "openai";
  }
  return "anthropic";
}

function getProxyAgent() {
  const proxyUrl =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy;
  return proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;
}

// ---------------- Anthropic path (api.anthropic.com or compatible) ----------------

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Set MODEL_PROVIDER=openai for DeepSeek, or fill ANTHROPIC_API_KEY in .env.local.",
      );
    }
    const baseURL = process.env.ANTHROPIC_BASE_URL?.trim() || undefined;
    anthropicClient = new Anthropic({ apiKey, baseURL, httpAgent: getProxyAgent() });
  }
  return anthropicClient;
}

async function streamAnthropic(args: ChatStreamArgs): Promise<void> {
  const c = getAnthropicClient();
  const stream = c.messages.stream({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
    system: args.systemPrompt,
    messages: [
      ...args.history.map((t) => ({
        role: (t.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: t.content,
      })),
      { role: "user" as const, content: args.message },
    ],
    temperature: args.temperature,
    max_tokens: args.maxTokens,
  });
  stream.on("text", (text) => args.onToken(text));
  await stream.finalMessage();
}

// ---------------- OpenAI-compatible path (DeepSeek / OpenRouter / etc.) ----------------

let openaiClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY is not set. Get a DeepSeek key at https://platform.deepseek.com/ and put it in .env.local.",
      );
    }
    // DeepSeek default. Override via OPENAI_BASE_URL for OpenRouter, Together,
    // self-hosted gateways, etc.
    const baseURL =
      process.env.OPENAI_BASE_URL?.trim() || "https://api.deepseek.com/v1";
    openaiClient = new OpenAI({ apiKey, baseURL });
  }
  return openaiClient;
}

async function streamOpenAI(args: ChatStreamArgs): Promise<void> {
  const c = getOpenAIClient();
  const stream = await c.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "deepseek-chat",
    messages: [
      { role: "system", content: args.systemPrompt },
      ...args.history.map((t) => ({
        role: (t.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: t.content,
      })),
      { role: "user" as const, content: args.message },
    ],
    temperature: args.temperature,
    max_tokens: args.maxTokens,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) args.onToken(delta);
  }
}

// ---------------- Public entry ----------------

export async function streamChat(args: ChatStreamArgs): Promise<void> {
  if (getProvider() === "openai") {
    await streamOpenAI(args);
  } else {
    await streamAnthropic(args);
  }
}
