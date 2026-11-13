import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ThemeProvider from "@/components/ThemeProvider";
import { prisma } from "@/lib/prisma";
import type { AccentColor, DarkMode } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Showcase",
  description: "Explore our portfolio of amazing projects",
};

async function getSiteTheme() {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: { key: { in: ["theme_dark_mode", "theme_accent"] } },
    });
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return {
      darkMode: (map["theme_dark_mode"] as DarkMode) || "system",
      accent: (map["theme_accent"] as AccentColor) || "blue",
    };
  } catch {
    return { darkMode: "system" as DarkMode, accent: "blue" as AccentColor };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const siteTheme = await getSiteTheme();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider defaultTheme={siteTheme}>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
