import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Neuroway LoadMap",
  description:
    "Interaktives B2B-MVP zur Erfassung körperlicher Belastungen am Arbeitsplatz mit visueller Einordnung und Handlungsempfehlungen.",
  openGraph: {
    title: "Neuroway LoadMap – Ergonomische Belastungsanalyse",
    description:
      "Erfassen Sie die körperlichen Belastungen Ihrer Mitarbeitenden in wenigen Minuten und erhalten Sie konkrete Handlungsempfehlungen.",
    type: "website",
    locale: "de_DE",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧬</text></svg>",
  },
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
