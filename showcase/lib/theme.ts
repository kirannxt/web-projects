export type AccentColor = "blue" | "purple" | "green" | "orange" | "rose" | "teal";
export type DarkMode = "light" | "dark" | "system";

export interface ThemeSettings {
  darkMode: DarkMode;
  accent: AccentColor;
}

export const ACCENT_COLORS: { value: AccentColor; label: string; color: string }[] = [
  { value: "blue",   label: "Blue",   color: "#3b82f6" },
  { value: "purple", label: "Purple", color: "#8b5cf6" },
  { value: "green",  label: "Green",  color: "#22c55e" },
  { value: "orange", label: "Orange", color: "#f97316" },
  { value: "rose",   label: "Rose",   color: "#f43f5e" },
  { value: "teal",   label: "Teal",   color: "#14b8a6" },
];

export const DEFAULT_THEME: ThemeSettings = {
  darkMode: "system",
  accent: "blue",
};

export const THEME_STORAGE_KEY = "ps-theme";
