import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function MarkdownPostPreview(props: { content: string | null }) {
  return (
    <>
      <span className="text-sm text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: (props) => <span {...props} />,
            h2: (props) => <span {...props} />,
            a: (props) => <span className=" text-cyan-500" {...props} />,
            p: (props) => <span className=" text-gray-300" {...props} />,
            ol: (props) => <span className="" {...props} />,
            ul: (props) => <span className="" {...props} />,
            li: (props) => <span className="" {...props} />,
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
                className="w-40 my-4 rounded-xl max-w-full h-auto mx-auto shadow-md"
                {...props}
              />
            ),
          }}
        >
          {props.content}
        </ReactMarkdown>
      </span>
    </>
  );
}
