"use client";

import type { ChatRequest, SSEEvent } from "./types";

/**
 * Minimal SSE-over-fetch client. We don't use EventSource because it doesn't support POST bodies.
 * Streams the response, splits on the `\n\n` event terminator, parses each `data:` line as JSON.
 */
export async function streamChatRequest(
  body: ChatRequest,
  onEvent: (event: SSEEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) {
    const txt = await res.text().catch(() => "");
    throw new Error(`chat request failed: ${res.status} ${txt}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let sep: number;
    while ((sep = buffer.indexOf("\n\n")) !== -1) {
      const raw = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      const line = raw.split("\n").find((l) => l.startsWith("data: "));
      if (!line) continue;
      const payload = line.slice(6);
      try {
        onEvent(JSON.parse(payload) as SSEEvent);
      } catch {
        // ignore malformed
      }
    }
  }
}
