import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { name }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return NextResponse.json(
        { error: "Konto z tym adresem e-mail już istnieje." },
        { status: 409 }
      );
    }
    if (existingUser.name === name) {
      return NextResponse.json(
        { error: "Użytkownik z tą nazwą już istnieje." },
        { status: 409 }
      );
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json(newUser, { status: 201 });
}
