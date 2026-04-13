import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { env } from "../config/env.js";

// FUTURE IMPLEMENTATION: Redis Implementation
// Per the architecture prompt, refresh tokens and user sessions should be cached 
// and validated against a Redis store. Currently, auth is only JWT-based and stateless.

type TokenPayload = { sub: string; email: string };

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(user: Pick<User, "id" | "email">) {
  return jwt.sign({ sub: user.id, email: user.email } satisfies TokenPayload, env.JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function signRefreshToken(user: Pick<User, "id" | "email">) {
  return jwt.sign(
    { sub: user.id, email: user.email } satisfies TokenPayload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
}

export function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  return new Promise((resolve) => {
    jwt.verify(token, env.JWT_REFRESH_SECRET, (err, payload) => {
      if (err || typeof payload !== "object" || payload === null) {
        resolve(null);
        return;
      }
      const sub = "sub" in payload ? payload.sub : undefined;
      const email = "email" in payload ? payload.email : undefined;
      if (typeof sub !== "string" || typeof email !== "string") {
        resolve(null);
        return;
      }
      resolve({ sub, email });
    });
  });
}

