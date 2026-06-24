import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Sanity webhook target: on publish, refresh the affected pages so the live site
// updates within seconds (a 60s time-based revalidate is the fallback either way).
// Set SANITY_REVALIDATE_SECRET in env and as the webhook secret in Sanity.
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type?: string;
      slug?: { current?: string };
    }>(req, process.env.SANITY_REVALIDATE_SECRET);

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const type = body?._type;
    const slug = body?.slug?.current;

    // per-page copy singletons -> their route
    const PAGE_ROUTES: Record<string, string> = {
      homePage: "/",
      aboutPage: "/about",
      programsPage: "/programs",
      gamesPage: "/games",
      blogPage: "/blog",
      contactPage: "/contact",
      joinPage: "/join",
    };

    if (type && PAGE_ROUTES[type]) {
      revalidatePath(PAGE_ROUTES[type]);
    } else if (type === "program") {
      revalidatePath("/programs");
    } else if (type === "testimonial") {
      revalidatePath("/");
      revalidatePath("/programs");
    } else if (type === "teamMember") {
      revalidatePath("/about");
    } else if (type === "job") {
      revalidatePath("/join");
    } else if (type === "post") {
      revalidatePath("/blog");
      if (slug) revalidatePath(`/blog/${slug}`);
    }

    return NextResponse.json({ revalidated: true, type, now: Date.now() });
  } catch (err) {
    return new NextResponse((err as Error).message, { status: 500 });
  }
}
