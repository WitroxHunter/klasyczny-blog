"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const sanitizeProps = (props: React.HTMLAttributes<HTMLElement>) => {
  const safeProps: React.HTMLAttributes<HTMLElement> = {};
  Object.entries(props).forEach(([key, value]) => {
    if (!key.startsWith("on") || typeof value === "function") {
      (safeProps as Record<string, unknown>)[key] = value;
    }
  });
  return safeProps;
};

const extractFirstImage = (content: string) => {
  const regex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(regex);
  return match ? match[1] : null;
};

export default function MarkdownPostPreview({
  content,
}: {
  content: string | null;
}) {
  if (!content) return null;

  const firstImgSrc = extractFirstImage(content);

  return (
    <div className="text-sm text-gray-300 overflow-hidden max-w-full flex flex-row-reverse gap-4 items-start">
      {firstImgSrc && (
        <img
          src={firstImgSrc}
          alt="preview"
          className="w-40 rounded-xl shadow-md flex-shrink-0"
        />
      )}
      <div
        className={`text-gray-300 overflow-hidden ${
          firstImgSrc
            ? "line-clamp-5 break-words text-left"
            : "whitespace-nowrap text-ellipsis"
        }`}
        style={{ flex: 1 }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            p: (props) => <span {...sanitizeProps(props)} />,
            h1: (props) => <span {...sanitizeProps(props)} />,
            h2: (props) => <span {...sanitizeProps(props)} />,
            h3: (props) => <span {...sanitizeProps(props)} />,
            h4: (props) => <span {...sanitizeProps(props)} />,
            h5: (props) => <span {...sanitizeProps(props)} />,
            h6: (props) => <span {...sanitizeProps(props)} />,
            a: (props) => (
              <span className="text-cyan-500" {...sanitizeProps(props)} />
            ),
            ol: (props) => <span {...sanitizeProps(props)} />,
            ul: (props) => <span {...sanitizeProps(props)} />,
            li: (props) => <span {...sanitizeProps(props)} />,
            blockquote: (props) => <span {...sanitizeProps(props)} />,
            hr: () => <></>,
            img: () => null,
            br: () => <></>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
