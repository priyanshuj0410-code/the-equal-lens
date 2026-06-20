import type { Metadata } from "next";
import Link from "next/link";
import { getPostsMeta } from "@/lib/knowledge";

export const metadata: Metadata = {
  title: "Blog — The Equal Lens",
  description:
    "Ideas on fairness, play, and helping kids unlearn bias and relearn empathy.",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getPostsMeta();

  return (
    <div>
      <section className="bg-violet-600 text-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <p className="font-display text-xs uppercase tracking-widest text-violet-200">
            Blog
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Notes on fairness &amp; play
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-ink/60">No posts yet — check back soon.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group overflow-hidden rounded-3xl border border-mist bg-white transition-shadow hover:shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.cover || "/blog/placeholder.svg"}
                  alt=""
                  className="h-44 w-full object-cover"
                />
                <div className="p-6">
                  <p className="text-xs text-ink/50">{formatDate(p.date)}</p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-ink group-hover:text-violet-600">
                    {p.title}
                  </h2>
                  {p.excerpt && (
                    <p className="mt-2 text-sm text-ink/70">{p.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
