import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  console.log("Zaladowano posty");
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { authorId, title, content } = body;

  const newPost = await prisma.post.create({
    data: {
      authorId,
      title,
      content,
    },
  });

  return NextResponse.json(newPost);
}
