import type { User } from "../types/auth";

export function normalizeUser(raw: any): User {
  return {
    ...raw,
    role: String(raw.role).toLowerCase() as "admin" | "standard",
  };
}