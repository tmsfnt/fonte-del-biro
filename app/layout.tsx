import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fonte del Biro — Sapore di Toscana",
  description:
    "Azienda agricola nel cuore del Chianti. Vini, olio e ospitalità originati alla Fonte del Biro.",
  openGraph: {
    title: "Fonte del Biro",
    description: "Sapore di Toscana, originato alla Fonte del Biro.",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/images/logo-granata.png" type="image/png" />
      </head>
      <body className="bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}
