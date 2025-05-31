import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

type DecodedToken = { id: string } | null;

export function verifyToken(token: string): DecodedToken {
  try {
    return jwt.verify(token, SECRET) as DecodedToken;
  } catch {
    return null;
  }
}
