import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: {
    default: "Vancouver Virtual Productions",
    template: "%s | Vancouver Virtual Productions",
  },
  description: "A website for showcasing virtual production services and work",
  keywords: ["virtual production", "Vancouver", "film production", "virtual sets"],
  authors: [{ name: "Vancouver Virtual Productions" }],
  creator: "Vancouver Virtual Productions",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vvp.com",
    title: "Vancouver Virtual Productions",
    description: "A website for showcasing virtual production services and work",
    siteName: "Vancouver Virtual Productions",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vancouver Virtual Productions",
    description: "A website for showcasing virtual production services and work",
    creator: "@vvp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vancouver Virtual Productions",
    description: "A website for showcasing virtual production services and work",
    url: "https://vvp.com",
    logo: "https://vvp.com/apple-touch-icon.png",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
    },
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </body>
    </html>
  );
}
