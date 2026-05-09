import type { NPC, NPCConfig } from "./types";

// Compact wire format that goes into the URL hash. Keep keys short so
// the base64-encoded payload stays clipboard-friendly.
//
// PRD §11.2: (npcId + config) is base64-encoded into URL hash so server
// logs never see it. PRD §3.4 + the Create-NPC feature mean a share link
// must also be able to carry a full custom NPC body, not just a reference.
type Wire = {
  v: 1;
  n: string; // npcId — same string for built-in or custom NPCs
  r: NPCConfig["roleTier"];
  e: NPCConfig["emotion"];
  t: 1 | 0; // ethicsMode
  f: 1 | 0; // allowRefusal
  c?: NPC; // optional embedded custom NPC; only present for user-created shares
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

export function encodeShare(
  npcId: string,
  config: NPCConfig,
  customNpc?: NPC,
): string {
  const wire: Wire = {
    v: 1,
    n: npcId,
    r: config.roleTier,
    e: config.emotion,
    t: config.ethicsMode ? 1 : 0,
    f: config.allowRefusal ? 1 : 0,
    ...(customNpc ? { c: customNpc } : {}),
  };
  return toBase64Url(JSON.stringify(wire));
}

export function decodeShare(
  raw: string,
): { npcId: string; config: NPCConfig; customNpc?: NPC } | null {
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
    const customNpc = isValidNpc(parsed.c) ? parsed.c : undefined;
    return {
      npcId: parsed.n,
      config: {
        roleTier: parsed.r,
        emotion: parsed.e,
        ethicsMode: parsed.t === 1,
        allowRefusal: parsed.f === 1,
      },
      customNpc,
    };
  } catch {
    return null;
  }
}

// Defensive validation of a custom-NPC payload from an untrusted URL.
// Required fields must be present + non-empty strings; tags must be a string array.
function isValidNpc(c: unknown): c is NPC {
  if (!c || typeof c !== "object") return false;
  const o = c as Record<string, unknown>;
  const stringFields = [
    "id",
    "name",
    "archetype",
    "setting",
    "persona",
    "opener",
    "worldAnchor",
  ] as const;
  for (const f of stringFields) {
    if (typeof o[f] !== "string" || (o[f] as string).length === 0) return false;
  }
  if (!Array.isArray(o.tags)) return false;
  if (!o.tags.every((t) => typeof t === "string")) return false;
  return true;
}

// Read+strip the share payload from window.location.hash on mount.
export function readShareFromLocation():
  | { npcId: string; config: NPCConfig; customNpc?: NPC }
  | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;
  return decodeShare(hash);
}

export function buildShareUrl(
  npcId: string,
  config: NPCConfig,
  customNpc?: NPC,
): string {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  url.hash = encodeShare(npcId, config, customNpc);
  // Drop search params — share links should be clean.
  url.search = "";
  return url.toString();
}
