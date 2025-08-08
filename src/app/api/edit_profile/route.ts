import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

export async function POST(req: Request) {
  try {
    const { id, name, description } = await req.json();
    const loggedInUser = await getUserFromCookie();

    if (!loggedInUser || loggedInUser.id !== id) {
      return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
    }

    const existing = await prisma.user.findFirst({
      where: { name, NOT: { id } },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ta nazwa jest już zajęta", errorCode: "NAME_TAKEN" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id },
      data: { name, description },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
