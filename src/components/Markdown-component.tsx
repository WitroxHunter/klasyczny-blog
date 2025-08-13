import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";

interface MarkdownProps {
  content: string | null;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function MarkdownComponent({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: (props) => (
          <h1 className="text-4xl font-bold mt-8 mb-4 text-white" {...props} />
        ),
        h2: (props) => (
          <h2 className="text-3xl font-bold mt-8 mb-4 text-white" {...props} />
        ),
        a: (props) => <a className="text-cyan-500" {...props} />,
        p: (props) => (
          <p
            className="mb-4 text-gray-300 break-words whitespace-pre-wrap"
            {...props}
          />
        ),
        ol: (props) => <ol className="list-decimal ml-6 mb-4" {...props} />,
        ul: (props) => <ul className="list-disc ml-6 mb-4" {...props} />,
        li: (props) => <li className="mb-2" {...props} />,
        blockquote: (props) => (
          <blockquote
            className="border-l-4 border-gray-600 pl-4 italic text-gray-400"
            {...props}
          />
        ),
        img: ({ src = "", alt = "", ...props }) => (
          <Image
            src={src}
            alt={alt}
            className="my-4 rounded-xl max-w-full h-auto mx-auto shadow-md"
            width={800}
            height={600}
            {...props}
          />
        ),
        table: (props) => (
          <table
            className="table-auto border-collapse border border-gray-600 my-4"
            {...props}
          />
        ),
        th: (props) => (
          <th
            className="border border-gray-500 px-4 py-2 text-white"
            {...props}
          />
        ),
        td: (props) => (
          <td
            className="border border-gray-500 px-4 py-2 text-gray-300"
            {...props}
          />
        ),

        code: ({
          inline,
          className,
          children,
          ...props
        }: CodeProps & React.HTMLAttributes<HTMLElement>) => {
          if (inline) {
            return (
              <code
                className="bg-gray-700 text-white px-1 py-0.5 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            );
          }

          const match = /language-(\w+)/.exec(className || "");
          return (
            <SyntaxHighlighter
              style={oneDark}
              language={match ? match[1] : "text"}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {content || ""}
    </ReactMarkdown>
  );
}
