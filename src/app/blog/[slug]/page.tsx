import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPostsMeta } from "@/lib/knowledge";

export function generateStaticParams() {
  return [...getPostsMeta("kid"), ...getPostsMeta("adult")].map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found - The Equal Lens" };
  return { title: `${post.title} - The Equal Lens`, description: post.excerpt };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/blog" className="text-sm text-brand hover:underline">
        ← Back to blog
      </Link>
      <p className="mt-6 text-xs uppercase tracking-widest text-brandsoft">
        {formatDate(post.date)}
        {post.author ? ` · ${post.author}` : ""}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        {post.title}
      </h1>
      <div
        className="mt-8 leading-relaxed text-ink/80 [&_a]:text-brand [&_a]:underline [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-violet-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-ink/60 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-violet-700 [&_li]:my-1 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      {post.placeholder && (
        <p className="mt-10 rounded-xl bg-mist/60 p-4 text-sm text-violet-800">
          This is placeholder content to demonstrate the blog layout.
        </p>
      )}
    </article>
  );
}
