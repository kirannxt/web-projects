"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { ACCENT_COLORS } from "@/lib/theme";

export default function ThemeSwitcher() {
  const { theme, setDarkMode, setAccent, resolvedDark } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Theme settings"
        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {resolvedDark ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
            {/* Dark mode */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Mode
              </p>
              <div className="flex gap-1.5">
                {(["light", "system", "dark"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDarkMode(mode)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                      theme.darkMode === mode
                        ? "bg-accent text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    style={theme.darkMode === mode ? { backgroundColor: "var(--accent)" } : {}}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent color */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Accent Color
              </p>
              <div className="grid grid-cols-6 gap-1.5">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setAccent(c.value)}
                    title={c.label}
                    className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                      theme.accent === c.value ? "ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500 scale-110" : ""
                    }`}
                    style={{ backgroundColor: c.color }}
                    aria-label={c.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
