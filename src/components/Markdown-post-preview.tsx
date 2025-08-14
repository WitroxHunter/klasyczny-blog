"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const sanitizeProps = (props: any) => {
  const safeProps: Record<string, any> = {};
  Object.entries(props).forEach(([key, value]) => {
    if (!key.startsWith("on") || typeof value === "function") {
      safeProps[key] = value;
    }
  });
  return safeProps;
};

export default function MarkdownPostPreview({
  content,
}: {
  content: string | null;
}) {
  if (!content) return null;

  return (
    <div
      className="text-sm text-gray-300 overflow-hidden text-ellipsis max-w-full"
      style={{
        whiteSpace: "nowrap",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Zmiana komponentow na inline
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
          img: ({ src = "", alt = "", ...props }) => (
            <img
              src={src}
              alt={alt}
              className="w-40 my-4 rounded-xl max-w-full h-auto mx-auto shadow-md"
              {...sanitizeProps(props)}
            />
          ),
          br: () => <></>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
