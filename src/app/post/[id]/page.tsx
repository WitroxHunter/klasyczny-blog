import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
          <div className="text-gray-200 whitespace-pre-wrap text-lg">
            {post.content}
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
