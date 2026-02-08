import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fragmentos do Cinema - Cinema e Séries",
  description: "Críticas, listas, vídeos e entrevistas de cinema e séries.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Fragmentos do Cinema - Cinema e Séries",
    description: "Críticas, listas, vídeos e entrevistas de cinema e séries.",
    type: "website",
    locale: "pt_BR",
    siteName: "Fragmentos do Cinema",
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1080,
        height: 1080,
        alt: 'Fragmentos do Cinema',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fragmentos do Cinema - Cinema e Séries",
    description: "Críticas, listas, vídeos e entrevistas de cinema e séries.",
    images: ['/opengraph-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
