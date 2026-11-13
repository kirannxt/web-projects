"use client";

import { useState, useEffect } from "react";

interface HomepageSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;
  hero_button_url: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
  featured_heading: string;
  all_heading: string;
}

const defaults: HomepageSettings = {
  hero_title: "Our Project Showcase",
  hero_subtitle: "Explore our portfolio of innovative projects spanning web apps, mobile applications, and open-source contributions.",
  hero_button_text: "View Projects",
  hero_button_url: "#projects",
  stat1_value: "10+",
  stat1_label: "Projects",
  stat2_value: "5",
  stat2_label: "Featured",
  stat3_value: "100%",
  stat3_label: "Open to explore",
  featured_heading: "Highlighted Projects",
  all_heading: "All Projects",
};

export default function HomepageEditorPage() {
  const [settings, setSettings] = useState<HomepageSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  function Field({ label, field, placeholder, textarea }: {
    label: string;
    field: keyof HomepageSettings;
    placeholder?: string;
    textarea?: boolean;
  }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
        {textarea ? (
          <textarea
            value={settings[field]}
            onChange={(e) => setSettings((p) => ({ ...p, [field]: e.target.value }))}
            rows={3}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 resize-none"
          />
        ) : (
          <input
            type="text"
            value={settings[field]}
            onChange={(e) => setSettings((p) => ({ ...p, [field]: e.target.value }))}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2"
          />
        )}
      </div>
    );
  }

  if (loading) return <div className="text-gray-400 py-12 text-center">Loading...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Homepage Editor</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Customize your homepage content</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 text-white font-semibold rounded-xl transition-opacity disabled:opacity-60 text-sm"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Hero section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-lg">🎯</span> Hero Section
        </h2>
        <Field label="Headline" field="hero_title" placeholder="Our Project Showcase" />
        <Field label="Subtitle" field="hero_subtitle" placeholder="Explore our portfolio..." textarea />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Button Text" field="hero_button_text" placeholder="View Projects" />
          <Field label="Button URL" field="hero_button_url" placeholder="#projects" />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-lg">📊</span> Stats Bar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stat 1</p>
            <Field label="Value" field="stat1_value" placeholder="10+" />
            <Field label="Label" field="stat1_label" placeholder="Projects" />
          </div>
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stat 2</p>
            <Field label="Value" field="stat2_value" placeholder="5" />
            <Field label="Label" field="stat2_label" placeholder="Featured" />
          </div>
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stat 3</p>
            <Field label="Value" field="stat3_value" placeholder="100%" />
            <Field label="Label" field="stat3_label" placeholder="Open to explore" />
          </div>
        </div>
      </div>

      {/* Section headings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-lg">📌</span> Section Headings
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Featured Projects Heading" field="featured_heading" placeholder="Highlighted Projects" />
          <Field label="All Projects Heading" field="all_heading" placeholder="All Projects" />
        </div>
      </div>
    </form>
  );
}
