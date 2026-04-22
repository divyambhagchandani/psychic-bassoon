"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-primary text-white">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-2 py-1.5 text-left font-headline font-bold text-[11px]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-outline-variant/20 px-2 py-1.5">
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 rounded-r-lg border-l-3 border-primary bg-primary/5 py-1.5 pl-3 pr-2 text-[12px]">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-primary">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-muted">{children}</em>,
  h3: ({ children }) => (
    <h3 className="mt-3 mb-1 font-headline text-sm font-bold">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-2 mb-0.5 font-headline text-xs font-bold">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-1.5 ml-4 list-disc space-y-0.5 last:mb-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-1.5 ml-4 list-decimal space-y-0.5 last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="text-[12px]">{children}</li>,
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded bg-surface-container p-2 font-mono text-[11px]">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-surface-container px-1 py-0.5 font-mono text-[11px]">
        {children}
      </code>
    );
  },
  hr: () => <hr className="my-2 border-outline-variant/20" />,
};

export default function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="markdown-message">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
