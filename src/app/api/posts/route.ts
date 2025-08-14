import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

// GET wszystkie posty
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

// POST nowy post
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

// DELETE post
export async function DELETE(req: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user)
      return NextResponse.json({ message: "Nie zalogowany" }, { status: 401 });

    const body = await req.json();
    const id = body.id as string;
    if (!id) return NextResponse.json({ message: "Brak ID" }, { status: 400 });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post)
      return NextResponse.json(
        { message: "Post nie istnieje" },
        { status: 404 }
      );

    if (post.authorId !== user.id)
      return NextResponse.json({ message: "Brak dostępu" }, { status: 403 });

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: "Post usunięty" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Błąd serwera" }, { status: 500 });
  }
}
