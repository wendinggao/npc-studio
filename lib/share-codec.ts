import type { NPCConfig } from "./types";

// Compact wire format that goes into the URL hash. Keep the keys short; this becomes a base64 string.
// PRD §11.2: (npcId + config) is base64-encoded into URL hash so server logs never see it.
type Wire = {
  v: 1;
  n: string; // npcId
  r: NPCConfig["roleTier"];
  e: NPCConfig["emotion"];
  t: 1 | 0; // ethicsMode
  f: 1 | 0; // allowRefusal
};

function toBase64Url(s: string): string {
  // btoa works on latin1; encode UTF-8 first.
  const utf8 = unescape(encodeURIComponent(s));
  return btoa(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    s.length + ((4 - (s.length % 4)) % 4),
    "=",
  );
  const utf8 = atob(padded);
  return decodeURIComponent(escape(utf8));
}

export function encodeShare(npcId: string, config: NPCConfig): string {
  const wire: Wire = {
    v: 1,
    n: npcId,
    r: config.roleTier,
    e: config.emotion,
    t: config.ethicsMode ? 1 : 0,
    f: config.allowRefusal ? 1 : 0,
  };
  return toBase64Url(JSON.stringify(wire));
}

export function decodeShare(
  raw: string,
): { npcId: string; config: NPCConfig } | null {
  try {
    const parsed = JSON.parse(fromBase64Url(raw)) as Partial<Wire>;
    if (parsed.v !== 1 || typeof parsed.n !== "string") return null;
    if (
      parsed.r !== "main" &&
      parsed.r !== "side" &&
      parsed.r !== "ambient"
    ) {
      return null;
    }
    if (parsed.e !== "low" && parsed.e !== "medium" && parsed.e !== "high") {
      return null;
    }
    return {
      npcId: parsed.n,
      config: {
        roleTier: parsed.r,
        emotion: parsed.e,
        ethicsMode: parsed.t === 1,
        allowRefusal: parsed.f === 1,
      },
    };
  } catch {
    return null;
  }
}

// Read+strip the share payload from window.location.hash on mount.
export function readShareFromLocation(): {
  npcId: string;
  config: NPCConfig;
} | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;
  return decodeShare(hash);
}

export function buildShareUrl(npcId: string, config: NPCConfig): string {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  url.hash = encodeShare(npcId, config);
  // Drop search params — share links should be clean.
  url.search = "";
  return url.toString();
}
