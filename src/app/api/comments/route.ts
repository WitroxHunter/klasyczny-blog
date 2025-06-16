import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  if (!postId) return NextResponse.json([], { status: 400 });

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, content, authorId } = body;

    if (
      typeof postId !== "string" ||
      typeof content !== "string" ||
      typeof authorId !== "string"
    ) {
      return NextResponse.json(
        { error: "Nieprawidłowy format danych" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: { postId, content, authorId },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Błąd w API /comments POST:", error);
    return NextResponse.json(
      { error: "Wewnętrzny błąd serwera" },
      { status: 500 }
    );
  }
}
