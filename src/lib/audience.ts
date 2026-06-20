import { cookies } from "next/headers";

export type Audience = "kid" | "adult";

export async function getAudience(): Promise<Audience> {
  const c = await cookies();
  return c.get("audience")?.value === "adult" ? "adult" : "kid";
}
