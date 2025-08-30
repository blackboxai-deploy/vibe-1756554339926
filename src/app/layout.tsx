import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/useLanguage";
import { AuthProvider } from "@/lib/useAuth";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgriConnect - NASA Powered Smart Farming",
  description: "Advanced agricultural platform powered by NASA satellite data for crop monitoring, disease detection, and weather intelligence",
  keywords: "agriculture, farming, NASA, satellite data, crop monitoring, disease detection, weather alerts",
  authors: [{ name: "AgriConnect Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#16a34a",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16a34a" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-background">
              {children}
            </div>
            <Toaster position="top-right" />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}