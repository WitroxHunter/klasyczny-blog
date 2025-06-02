import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Brak ID" }, { status: 400 });
  }

  try {
    const post_data = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
        content: true,
        createdAt: true,
        title: true,
      },
    });

    if (!post_data) {
      return NextResponse.json(
        { error: "Nie znaleziono posta" },
        { status: 401 }
      );
    }

    return NextResponse.json({ post_data });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Błąd serwera" }, { status: 401 });
  }
}
