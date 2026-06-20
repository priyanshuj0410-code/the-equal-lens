import { cookies } from "next/headers";

export type Audience = "kid" | "adult";

export async function getAudience(): Promise<Audience> {
  const c = await cookies();
  return c.get("audience")?.value === "adult" ? "adult" : "kid";
}

// True once the visitor has made an explicit kid/adult choice. Lets us tell a
// first-time visitor (no cookie) apart from someone who actively picked "kid".
export async function hasAudienceChoice(): Promise<boolean> {
  const c = await cookies();
  const v = c.get("audience")?.value;
  return v === "adult" || v === "kid";
}
