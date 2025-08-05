import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function getUserFromCookie() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const user = verifyToken(token); // np. { id: "...", email: "..." }
    return user;
  } catch {
    return null;
  }
}
