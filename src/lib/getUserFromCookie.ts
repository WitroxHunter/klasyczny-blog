import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// Typ, który faktycznie zwraca verifyToken
export interface UserFromCookie {
  id: string;
  email: string;
}

export async function getUserFromCookie(): Promise<UserFromCookie | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    // jawne określenie typu wyniku verifyToken
    const user = verifyToken(token) as UserFromCookie;
    return user;
  } catch {
    return null;
  }
}
