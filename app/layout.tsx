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

const siteUrl = "https://caspy-ai.vercel.app";
const title = "CaspyAI — Caspian Ecological Emergency Response";
const description =
  "Real-time ecological incident monitoring and emergency AI reporting for the Caspian Sea, Aktau, and Mangystau coastal region.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "CaspyAI",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: ["/logo.png"],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "CaspyAI",
    title,
    description,
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 701,
        height: 693,
        alt: "CaspyAI — Caspian Sea Eco-Intelligence",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-hidden bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
