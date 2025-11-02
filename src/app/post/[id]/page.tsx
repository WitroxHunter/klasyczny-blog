import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Comments } from "@/components/Comments";
import MarkdownComponent from "@/components/Markdown-component";

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
    <div className="px-6  bg-gradient-to-br from-gray-950 to-gray-900 sm:px-20 py-20 overflow-y-hidden">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* AUTHOR SECTION */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 rounded-3xl flex items-center gap-4 shadow-md">
          <Image
            src="/profile_placeholder.webp"
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
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-3xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-white">{post.title}</h1>
          <div className="prose prose-invert text-white space-y-4">
            <MarkdownComponent content={post.content} />
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 rounded-3xl shadow-md space-y-4">
          <Comments postId={post.id} />
        </div>
      </div>
    </div>
  );
}
