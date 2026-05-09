import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NPC Studio — Design AI NPCs with principles",
  description:
    "Configure an AI-driven NPC's persona, role tier, emotion intensity, and ethics safeguards — then chat with the result. LIF001 Group D30, Assessment 2.",
  openGraph: {
    title: "NPC Studio",
    description:
      "Design AI-driven NPCs with principles, then chat with them in real time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
