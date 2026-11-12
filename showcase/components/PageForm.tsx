"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PageFormData {
  id?: string;
  title: string;
  slug: string;
  content: string;
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
    content: initialData?.content ?? "",
    parentMenu: initialData?.parentMenu ?? "Projects",
    order: initialData?.order ?? 0,
    published: initialData?.published ?? true,
  });

  const [customMenu, setCustomMenu] = useState(
    initialData?.parentMenu && !PRESET_MENUS.includes(initialData.parentMenu)
      ? initialData.parentMenu
      : ""
  );
  const [useCustomMenu, setUseCustomMenu] = useState(
    !!(initialData?.parentMenu && !PRESET_MENUS.includes(initialData?.parentMenu ?? ""))
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  function generateSlug(title: string) {
    return title
      .toLowerCase()
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

      if (!res.ok) {
        setError(data.error || "Failed to save page");
        return;
      }

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
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
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
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-0 border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                <span className="px-3 py-2.5 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm border-r border-gray-300 dark:border-gray-600 shrink-0">
                  /pages/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, slug: e.target.value }))
                  }
                  required
                  placeholder="web-applications"
                  className="flex-1 px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Content editor */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setPreview(false)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    !preview
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setPreview(true)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    preview
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            {preview ? (
              <div className="p-5 min-h-64 prose dark:prose-invert max-w-none">
                <SimplePreview content={formData.content} />
              </div>
            ) : (
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, content: e.target.value }))
                }
                required
                rows={16}
                placeholder={`# Page Title\n\nWrite your page content here using Markdown.\n\n## Section Heading\n\nUse **bold**, *italic*, and other Markdown formatting.`}
                className="w-full px-5 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-y focus:outline-none border-0"
              />
            )}

            <div className="px-5 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400">
              Supports Markdown: # Headings, **bold**, *italic*, - lists, [links](url), `code`
            </div>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Page Settings</h3>

            {/* Menu assignment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Navigation Menu
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                This page will appear under this menu in the navbar
              </p>

              {!useCustomMenu ? (
                <div className="space-y-2">
                  <select
                    value={formData.parentMenu}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, parentMenu: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PRESET_MENUS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setUseCustomMenu(true)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Create custom menu
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customMenu}
                    onChange={(e) => setCustomMenu(e.target.value)}
                    placeholder="Custom menu name"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setUseCustomMenu(false)}
                    className="text-xs text-gray-500 hover:underline"
                  >
                    ← Use preset menu
                  </button>
                </div>
              )}
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))
                }
                min={0}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
            </div>

            {/* Published */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() =>
                    setFormData((p) => ({ ...p, published: !p.published }))
                  }
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    formData.published
                      ? "bg-blue-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      formData.published ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Published
                  </div>
                  <div className="text-xs text-gray-400">
                    {formData.published ? "Visible to users" : "Hidden from users"}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : isEdit ? "Update Page" : "Create Page"}
            </button>
            <Link
              href="/admin/pages"
              className="block text-center w-full py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

function SimplePreview({ content }: { content: string }) {
  if (!content) {
    return <p className="text-gray-400 italic">Nothing to preview yet.</p>;
  }
  return (
    <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
      {content}
    </div>
  );
}
