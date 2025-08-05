import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const response = NextResponse.redirect(new URL("/login", req.url));

  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // wygasza ciasteczko
  });

  return response;
}
