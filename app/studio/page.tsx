import type { Metadata } from "next";
import StudioClient from "./StudioClient";

export const metadata: Metadata = {
  title: "Studio — NPC Studio",
};

export default function StudioPage() {
  return <StudioClient />;
}
