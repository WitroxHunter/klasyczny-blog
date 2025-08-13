import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
import UserProfile from "@/components/UserProfile";

// Dynamiczny parametr [name]
interface ProfilePageParams {
  name: string;
}

export default async function ProfilePage({
  params,
}: {
  params: ProfilePageParams;
}) {
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
