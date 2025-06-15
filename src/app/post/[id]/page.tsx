import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post) return notFound();

  return (
    <div className="px-6 sm:px-20 py-20 overflow-y-scroll">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* AUTHOR SECTION */}
        <div className="bg-zinc-900 p-6 rounded-3xl flex items-center gap-4 shadow-md">
          <Image
            src="https://thispersondoesnotexist.com/"
            alt={post.author.name || "Autor"}
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
          <div>
            <Link href={`/profile/${post.author.name}`}>
              <p className="text-white font-semibold text-lg">
                {post.author?.name}
              </p>
            </Link>
            <p className="text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleString("pl-PL")}
            </p>
          </div>
        </div>

        {/* POST CONTENT */}
        <div className="bg-zinc-900 p-8 rounded-3xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-white">{post.title}</h1>
          <div className="prose prose-invert text-white space-y-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-4xl font-bold mt-8 mb-4 text-white"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-3xl font-bold mt-8 mb-4 text-white"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 text-gray-300" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-disc ml-6 mb-4" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc ml-6 mb-4" {...props} />
                ),
                li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-gray-600 pl-4 italic text-gray-400"
                    {...props}
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>

            <div className="prose prose-invert">
              <h1>dfsdf</h1>
            </div>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="bg-zinc-900 p-6 rounded-3xl shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-xl font-semibold">Komentarze</h2>
            <button className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium px-4 py-2 rounded-xl">
              Dodaj komentarz
            </button>
          </div>

          <p className="text-gray-400">Brak komentarzy.</p>
        </div>
      </div>
    </div>
  );
}
