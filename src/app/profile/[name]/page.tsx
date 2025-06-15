import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const user = await prisma.user.findUnique({
    where: { name },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return notFound();

  return (
    <div className="px-6 sm:px-20 py-20 max-w-4xl mx-auto space-y-8">
      {/* PROFIL */}
      <div className="bg-zinc-900 p-6 rounded-3xl flex items-center gap-6 shadow-md">
        <Image
          src="https://thispersondoesnotexist.com/"
          alt="Profilowe"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-gray-400 text-sm">
            Dołączył: {new Date(user.createdAt).toLocaleDateString("pl-PL")}
          </p>
        </div>
      </div>

      {/* POSTY */}
      <div className="space-y-4">
        <h2 className="text-xl text-white font-semibold">Posty użytkownika</h2>
        {user.posts.length === 0 ? (
          <p className="text-gray-400">Brak postów.</p>
        ) : (
          user.posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="block bg-zinc-800 hover:bg-zinc-700 transition p-4 rounded-xl"
            >
              <h3 className="text-white text-lg font-medium">{post.title}</h3>
              <p className="text-gray-400 text-sm">
                {new Date(post.createdAt).toLocaleString("pl-PL")}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
