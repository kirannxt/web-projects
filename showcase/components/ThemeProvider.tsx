"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AccentColor, DarkMode, ThemeSettings } from "@/lib/theme";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme";

interface ThemeContextType {
  theme: ThemeSettings;
  setDarkMode: (mode: DarkMode) => void;
  setAccent: (accent: AccentColor) => void;
  resolvedDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  setDarkMode: () => {},
  setAccent: () => {},
  resolvedDark: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

interface Props {
  children: React.ReactNode;
  // Server-side default from DB
  defaultTheme?: Partial<ThemeSettings>;
}

export default function ThemeProvider({ children, defaultTheme }: Props) {
  const [theme, setTheme] = useState<ThemeSettings>({
    ...DEFAULT_THEME,
    ...defaultTheme,
  });
  const [resolvedDark, setResolvedDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // On mount, load from localStorage (visitor preference overrides site default)
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ThemeSettings>;
        setTheme((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  // Apply dark class and accent to <html>
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark =
      theme.darkMode === "dark" ||
      (theme.darkMode === "system" && prefersDark);

    html.classList.toggle("dark", isDark);
    html.setAttribute("data-accent", theme.accent);
    setResolvedDark(isDark);
  }, [theme, mounted]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme.darkMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
      setResolvedDark(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme.darkMode]);

  function setDarkMode(mode: DarkMode) {
    const next = { ...theme, darkMode: mode };
    setTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  function setAccent(accent: AccentColor) {
    const next = { ...theme, accent };
    setTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  return (
    <ThemeContext.Provider value={{ theme, setDarkMode, setAccent, resolvedDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
