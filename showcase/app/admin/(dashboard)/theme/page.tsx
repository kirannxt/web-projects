"use client";

import { useState, useEffect } from "react";
import { ACCENT_COLORS } from "@/lib/theme";
import type { AccentColor, DarkMode } from "@/lib/theme";

export default function ThemeSettingsPage() {
  const [darkMode, setDarkMode] = useState<DarkMode>("system");
  const [accent, setAccent] = useState<AccentColor>("blue");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.theme_dark_mode) setDarkMode(data.theme_dark_mode);
        if (data.theme_accent) setAccent(data.theme_accent);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme_dark_mode: darkMode, theme_accent: accent }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Theme Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Set the default theme for all visitors</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 text-white font-semibold rounded-xl transition-opacity disabled:opacity-60 text-sm"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      <p className="text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
        💡 These are the <strong>site defaults</strong>. Individual visitors can still override them using the theme switcher in the navbar.
      </p>

      {/* Dark mode */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Default Mode</h2>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: "light", label: "Light", icon: "☀️", desc: "Always light mode" },
            { value: "system", label: "System", icon: "💻", desc: "Follows OS setting" },
            { value: "dark", label: "Dark", icon: "🌙", desc: "Always dark mode" },
          ] as { value: DarkMode; label: string; icon: string; desc: string }[]).map((m) => (
            <button
              key={m.value}
              onClick={() => setDarkMode(m.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                darkMode === m.value
                  ? "border-accent"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              style={darkMode === m.value ? { borderColor: "var(--accent)" } : {}}
            >
              <div className="text-2xl mb-1">{m.icon}</div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">{m.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Accent Color</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setAccent(c.value)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                accent === c.value
                  ? "border-current"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
              style={accent === c.value ? { borderColor: c.color } : {}}
            >
              <div className="w-8 h-8 rounded-full shrink-0 ring-2 ring-offset-2 ring-transparent transition-all"
                style={{ backgroundColor: c.color, ...(accent === c.value ? { ringColor: c.color } : {}) }} />
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white text-sm">{c.label}</div>
                <div className="text-xs font-mono text-gray-400">{c.color}</div>
              </div>
              {accent === c.value && (
                <svg className="w-4 h-4 ml-auto shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: c.color }}>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Live preview */}
        <div className="mt-5 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</p>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: ACCENT_COLORS.find((c) => c.value === accent)?.color }}>
              Primary Button
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium border-2" style={{ borderColor: ACCENT_COLORS.find((c) => c.value === accent)?.color, color: ACCENT_COLORS.find((c) => c.value === accent)?.color }}>
              Outline Button
            </button>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: ACCENT_COLORS.find((c) => c.value === accent)?.color + "20", color: ACCENT_COLORS.find((c) => c.value === accent)?.color }}>
              Badge
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
