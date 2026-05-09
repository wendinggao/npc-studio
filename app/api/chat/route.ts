import { NPC_BY_ID } from "@/lib/npcs";
import { buildPrompt } from "@/lib/prompt-builder";
import type {
  ChatRequest,
  SSEDoneEvent,
  SSEErrorEvent,
  SSERulesEvent,
  SSETokenEvent,
} from "@/lib/types";
import { streamChat } from "@/lib/model-adapter";

// Streaming requires the Node.js runtime — Anthropic SDK uses Node streams.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sse(event: object): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

export async function POST(req: Request) {
  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const npc = NPC_BY_ID[body.npcId];
  if (!npc) {
    return new Response("unknown npc", { status: 400 });
  }
  if (!body.message || body.message.trim().length === 0) {
    return new Response("empty message", { status: 400 });
  }

  // Compose the prompt synchronously — this is the IP, the LLM never sees the raw config.
  const built = buildPrompt(npc, body.config);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // PRD §11.1 step 5: emit the rules event FIRST, before any model tokens.
      const rulesEvent: SSERulesEvent = {
        type: "rules",
        rules: built.activeRules,
        systemPrompt: built.systemPrompt,
        temperature: built.temperature,
        maxTokens: built.maxTokens,
      };
      controller.enqueue(sse(rulesEvent));

      try {
        await streamChat({
          systemPrompt: built.systemPrompt,
          history: body.history ?? [],
          message: body.message,
          temperature: built.temperature,
          maxTokens: built.maxTokens,
          onToken: (text) => {
            const ev: SSETokenEvent = { type: "token", text };
            controller.enqueue(sse(ev));
          },
        });
        const done: SSEDoneEvent = { type: "done" };
        controller.enqueue(sse(done));
      } catch (err) {
        const ev: SSEErrorEvent = {
          type: "error",
          message:
            err instanceof Error ? err.message : "Unknown upstream error.",
        };
        controller.enqueue(sse(ev));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
