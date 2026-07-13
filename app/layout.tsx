import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Italir Pothe | Learn Italian with Bangla Guidance",
    template: "%s | Italir Pothe",
  },

  description:
    "Learn Italian with Bangla pronunciation, practical courses, quizzes, live webinars, career preparation, books and verifiable certificates.",

  applicationName: "Italir Pothe",

  keywords: [
    "Italir Pothe",
    "learn Italian in Bangla",
    "Italian language course",
    "Italian pronunciation Bangla",
    "Italian learning app",
    "Italian language book",
    "Survival Italian",
    "Italian webinars",
    "Italian certificate",
  ],

  authors: [
    {
      name: "Italir Pothe",
    },
  ],

  creator: "Italir Pothe",
  publisher: "Italir Pothe",
  category: "Education",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Italir Pothe",
    title: "Italir Pothe | Learn Italian with Bangla Guidance",
    description:
      "Learn Italian through Bangla pronunciation, practical lessons, webinars, books, career preparation and verified certification.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Italir Pothe | Learn Italian with Bangla Guidance",
    description:
      "Learn Italian through Bangla pronunciation, practical lessons, webinars, books, career preparation and verified certification.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#006B3F",
  colorScheme: "light",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}