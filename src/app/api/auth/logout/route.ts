import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Wylogowano" });

  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // wygasza ciasteczko
  });

  return response;
}
