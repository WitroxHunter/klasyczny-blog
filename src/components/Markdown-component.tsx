import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function MarkdownComponent(props: { content: string | null }) {
  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: (props) => (
            <h1
              className="text-4xl font-bold mt-8 mb-4 text-white"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="text-3xl font-bold mt-8 mb-4 text-white"
              {...props}
            />
          ),
          a: (props) => <a className=" text-cyan-500" {...props} />,
          p: (props) => <p className="mb-4 text-gray-300" {...props} />,
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
            <img
              src={src}
              alt={alt}
              className="my-4 rounded-xl max-w-full h-auto mx-auto shadow-md"
              {...props}
            />
          ),
        }}
      >
        {props.content}
      </ReactMarkdown>
    </>
  );
}
