import { prisma } from "@/lib/prisma";
import React from "react";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { id } = params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if (!post) {
    return (
      <div className="px-8 sm:px-20 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl text-red-600">Post nie istnieje.</h1>
        </div>
      </div>
    );
  }

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
