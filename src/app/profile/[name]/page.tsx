// app/profile/[name]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const loggedInUser = await getUserFromCookie();

  const profileUser = await prisma.user.findUnique({
    where: { name: resolvedParams.name },
    select: {
      id: true,
      name: true,
      createdAt: true,
      posts: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      },
    },
  });

  if (!profileUser) return notFound();

  const isOwnProfile = loggedInUser?.id === profileUser.id;

  return (
    <div className="px-6 sm:px-20 py-20 max-w-4xl mx-auto space-y-8">
      {/* PROFIL */}
      <div className="bg-zinc-900 p-6 rounded-3xl flex items-center gap-6 shadow-md justify-between">
        <div className="flex items-center gap-6">
          <Image
            src="/profile_placeholder.webp"
            alt="Profilowe"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">
              {profileUser.name}
            </h1>
            <p className="text-gray-400 text-sm">
              Dołączył:{" "}
              {new Date(profileUser.createdAt).toLocaleDateString("pl-PL")}
            </p>
          </div>
        </div>
        {isOwnProfile && (
          <Link
            href={`/profile/${profileUser.name}/edit`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl"
          >
            Edytuj profil
          </Link>
        )}
      </div>

      {/* POSTY */}
      <div className="space-y-4">
        <h2 className="text-xl text-white font-semibold">Posty użytkownika</h2>
        {profileUser.posts.length === 0 ? (
          <p className="text-gray-400">Brak postów.</p>
        ) : (
          profileUser.posts.map((post) => (
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
