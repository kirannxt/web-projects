"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SectionEditor from "./SectionEditor";
import type { Section } from "@/types/sections";

interface PageFormData {
  id?: string;
  title: string;
  slug: string;
  sections: Section[];
  parentMenu: string;
  order: number;
  published: boolean;
}

interface Props {
  initialData?: PageFormData;
}

const PRESET_MENUS = ["Projects", "Company", "Resources", "Blog", "Docs"];

export default function PageForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [formData, setFormData] = useState<PageFormData>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    sections: initialData?.sections ?? [],
    parentMenu: initialData?.parentMenu ?? "Projects",
    order: initialData?.order ?? 0,
    published: initialData?.published ?? true,
  });

  const [customMenu, setCustomMenu] = useState(
    initialData?.parentMenu && !PRESET_MENUS.includes(initialData.parentMenu)
      ? initialData.parentMenu : ""
  );
  const [useCustomMenu, setUseCustomMenu] = useState(
    !!(initialData?.parentMenu && !PRESET_MENUS.includes(initialData?.parentMenu ?? ""))
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function generateSlug(title: string) {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleTitleChange(title: string) {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : generateSlug(title),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...formData,
      parentMenu: useCustomMenu ? customMenu : formData.parentMenu,
      sections: JSON.stringify(formData.sections),
    };

    try {
      const url = isEdit ? `/api/pages/${initialData!.id}` : "/api/pages";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save page"); return; }
      router.push("/admin/pages");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title & Slug */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="e.g. Web Applications"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden focus-within:ring-2">
                <span className="px-3 py-2.5 bg-gray-100 dark:bg-gray-600 text-gray-500 text-sm border-r border-gray-300 dark:border-gray-600 shrink-0">
                  /pages/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  required
                  placeholder="web-applications"
                  className="flex-1 px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section builder */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Page Sections</h3>
                <p className="text-xs text-gray-400 mt-0.5">Add, reorder, and edit content sections</p>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {formData.sections.length} section{formData.sections.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="p-5">
              <SectionEditor
                sections={formData.sections}
                onChange={(sections) => setFormData((p) => ({ ...p, sections }))}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Page Settings</h3>

            {/* Menu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Navigation Menu</label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Appears under this menu in the navbar</p>
              {!useCustomMenu ? (
                <div className="space-y-2">
                  <select
                    value={formData.parentMenu}
                    onChange={(e) => setFormData((p) => ({ ...p, parentMenu: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2"
                  >
                    {PRESET_MENUS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <button type="button" onClick={() => setUseCustomMenu(true)} className="text-xs text-accent hover:underline" style={{ color: "var(--accent)" }}>
                    + Custom menu
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customMenu}
                    onChange={(e) => setCustomMenu(e.target.value)}
                    placeholder="Custom menu name"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2"
                  />
                  <button type="button" onClick={() => setUseCustomMenu(false)} className="text-xs text-gray-500 hover:underline">← Use preset</button>
                </div>
              )}
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                min={0}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2"
              />
            </div>

            {/* Published */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setFormData((p) => ({ ...p, published: !p.published }))}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{ backgroundColor: formData.published ? "var(--accent)" : "#d1d5db" }}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.published ? "translate-x-5" : "translate-x-0"}`} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Published</div>
                <div className="text-xs text-gray-400">{formData.published ? "Visible to users" : "Hidden"}</div>
              </div>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-400">{error}</div>
          )}

          <div className="space-y-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full text-white font-semibold py-2.5 rounded-xl transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {saving ? "Saving..." : isEdit ? "Update Page" : "Create Page"}
            </button>
            <Link href="/admin/pages" className="block text-center w-full py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
