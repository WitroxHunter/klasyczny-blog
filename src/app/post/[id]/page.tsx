import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: {
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if (!post) return notFound();

  return (
    <div className="px-8 sm:px-20 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-2">
          {new Date(post.createdAt).toLocaleString("pl-PL")}
        </p>
        <div className="text-lg whitespace-pre-wrap">{post.content}</div>
      </div>
    </div>
  );
}
