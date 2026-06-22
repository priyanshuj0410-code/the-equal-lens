import type { Metadata } from "next";
import Link from "next/link";
import { getPostsMeta, getPageContent } from "@/lib/knowledge";
import { scatterForPath } from "@/lib/pageMyths";
import { getAudience } from "@/lib/audience";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";

export const metadata: Metadata = {
  title: "Blog - The Equal Lens",
  description:
    "Ideas on fairness, play, and helping kids unlearn bias and relearn empathy.",
};

type Content = {
  hero: {
    eyebrow: string;
    headline: { kid: string; adult: string };
  };
  emptyState: string;
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const audience = await getAudience();
  const posts = await getPostsMeta(audience);
  const c = (await getPageContent("blog")) as Content;

  return (
    <div>
      <section className="relative overflow-hidden">
        <Doodle name="spiral" className="anim-float absolute left-10 top-16 w-10 text-brandsoft" />
        <Doodle name="heart" className="anim-wobble absolute right-14 top-12 w-7 text-grow" />
        <MythScatter items={scatterForPath("/blog", audience)} />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="eyebrow">
            {c.hero.eyebrow}
          </p>
          <h1 className="mt-3 font-hand text-4xl font-extrabold text-ink sm:text-5xl">
            {c.hero.headline[audience]}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10">
        {posts.length === 0 ? (
          <p className="text-center text-ink/60">{c.emptyState}</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
                className="sticker hover-pop block overflow-hidden rounded-3xl bg-surface"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover || "/blog/placeholder.svg"} alt="" className="h-44 w-full border-b-2 border-ink object-cover" />
                <div className="p-6">
                  <p className="text-xs text-ink/50">{formatDate(p.date)}</p>
                  <h2 className="mt-1 font-hand text-2xl font-bold text-ink">{p.title}</h2>
                  {p.excerpt && <p className="mt-2 text-sm text-ink/70">{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
