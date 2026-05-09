import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(): string {
  // Short non-cryptographic id, good enough for keying chat turns.
  return Math.random().toString(36).slice(2, 10);
}
