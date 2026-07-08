import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCarousel from "@/components/BlogCarousel";
import EmbedResizer from "@/components/EmbedResizer";
import { getPost, getPostsMeta } from "@/lib/knowledge";

export async function generateStaticParams() {
  const [kid, adult] = await Promise.all([
    getPostsMeta("kid"),
    getPostsMeta("adult"),
  ]);
  return [...kid, ...adult].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
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
  const post = await getPost(slug);
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
      {post.carousel && post.carousel.length > 0 && (
        <BlogCarousel images={post.carousel} className="mt-8" />
      )}
      <div
        className="blog-body mt-8 leading-relaxed text-ink/80"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <EmbedResizer />
      {post.placeholder && (
        <p className="mt-10 rounded-xl bg-mist/60 p-4 text-sm text-violet-800">
          This is placeholder content to demonstrate the blog layout.
        </p>
      )}
    </article>
  );
}
