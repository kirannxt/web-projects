"use client";

/**
 * Simple markdown renderer without external dependencies.
 * Supports: headings, bold, italic, lists, links, code, blockquotes.
 */
export default function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Heading 1
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-3xl font-bold mb-4 mt-6 text-gray-900 dark:text-white">
          {parseInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // Heading 2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-semibold mb-3 mt-5 text-gray-900 dark:text-white">
          {parseInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    // Heading 3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white">
          {parseInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">
          {parseInline(line.slice(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Unordered list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(
          <li key={i} className="leading-relaxed">
            {parseInline(lines[i].slice(2))}
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside mb-4 space-y-1 text-gray-700 dark:text-gray-300">
          {items}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          <li key={i} className="leading-relaxed">
            {parseInline(lines[i].replace(/^\d+\.\s/, ""))}
          </li>
        );
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside mb-4 space-y-1 text-gray-700 dark:text-gray-300">
          {items}
        </ol>
      );
      continue;
    }

    // Code block
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto mb-4 text-sm font-mono text-gray-800 dark:text-gray-200">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (line === "---" || line === "***") {
      elements.push(<hr key={i} className="border-gray-200 dark:border-gray-700 my-6" />);
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={i} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
        {parseInline(line)}
      </p>
    );
    i++;
  }

  return <div>{elements}</div>;
}

function parseInline(text: string): React.ReactNode {
  // Bold **text**
  // Italic *text*
  // Inline code `code`
  // Links [text](url)
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const patterns = [
    { regex: /\*\*(.+?)\*\*/, render: (match: RegExpMatchArray) => <strong key={key++} className="font-semibold">{match[1]}</strong> },
    { regex: /\*(.+?)\*/, render: (match: RegExpMatchArray) => <em key={key++} className="italic">{match[1]}</em> },
    { regex: /`(.+?)`/, render: (match: RegExpMatchArray) => <code key={key++} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-blue-700 dark:text-blue-300">{match[1]}</code> },
    { regex: /\[(.+?)\]\((.+?)\)/, render: (match: RegExpMatchArray) => <a key={key++} href={match[2]} className="text-blue-600 dark:text-blue-400 hover:underline" target={match[2].startsWith("http") ? "_blank" : undefined} rel={match[2].startsWith("http") ? "noopener noreferrer" : undefined}>{match[1]}</a> },
  ];

  while (remaining.length > 0) {
    let earliest: { index: number; length: number; node: React.ReactNode } | null = null;

    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match && match.index !== undefined) {
        if (!earliest || match.index < earliest.index) {
          earliest = {
            index: match.index,
            length: match[0].length,
            node: pattern.render(match),
          };
        }
      }
    }

    if (!earliest) {
      parts.push(remaining);
      break;
    }

    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }
    parts.push(earliest.node);
    remaining = remaining.slice(earliest.index + earliest.length);
  }

  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
}
