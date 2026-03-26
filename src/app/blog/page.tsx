import type { Metadata } from "next";
import { getAllPostMetas, getPostBySlug } from "@/lib/posts";
import { BlogPageClient } from "@/components/blog/BlogPageClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical writing on data engineering, GenAI, cloud infrastructure, and software development. Notes and deep-dives by Alex Lin.",
};

export default async function BlogPage() {
  const metas = getAllPostMetas();

  const posts = await Promise.all(metas.map((m) => getPostBySlug(m.slug)));
  const postContents: Record<string, string> = {};
  for (const p of posts) {
    if (p) postContents[p.slug] = p.content;
  }

  return <BlogPageClient postMetas={metas} postContents={postContents} />;
}
