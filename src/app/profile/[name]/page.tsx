import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
import UserProfile from "@/components/UserProfile";

interface ProfilePageProps {
  params: { name: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const loggedInUser = await getUserFromCookie();

  const profileUser = await prisma.user.findUnique({
    where: { name: params.name },
    select: {
      id: true,
      name: true,
      description: true,
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

  return <UserProfile profileUser={profileUser} isOwnProfile={isOwnProfile} />;
}
