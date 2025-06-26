import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JewelFlow - Jewelry Management System",
  description: "Your comprehensive jewelry management application. Manage inventory, track sales, and grow your jewelry business.",
  keywords: ["jewelry", "management", "inventory", "business", "sales"],
  authors: [{ name: "JewelFlow Team" }],
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any' },
      { url: '/logo.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/logo.png', type: 'image/png' },
    ],
  },
  themeColor: '#ffffff',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="jewelflow-ui-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
