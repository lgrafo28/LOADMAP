import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Neuroway LoadMap",
  description:
    "Interaktives B2B-MVP zur Erfassung körperlicher Belastungen am Arbeitsplatz mit visueller Einordnung und Handlungsempfehlungen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
