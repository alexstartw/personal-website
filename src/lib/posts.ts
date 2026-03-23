import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  categories: string[];
  description: string;
  cover?: string;
}

export interface Post extends PostMeta {
  content: string; // rendered HTML
}

function toSlug(filename: string): string {
  return filename.replace(/\.md$/, "");
}

function parseDate(raw: unknown): string {
  if (!raw) return new Date().toISOString();
  const d = new Date(String(raw));
  return isNaN(d.getTime()) ? String(raw) : d.toISOString();
}

export function getAllPostMetas(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug: toSlug(filename),
        title: String(data.title ?? toSlug(filename)),
        date: parseDate(data.date),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        categories: Array.isArray(data.categories)
          ? data.categories.map(String)
          : [],
        description: String(data.description ?? ""),
        cover: data.cover ? String(data.cover) : undefined,
      } satisfies PostMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filepath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content: mdContent } = matter(raw);

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: "github-dark",
      keepBackground: true,
    })
    .use(rehypeStringify);

  const result = await processor.process(mdContent);

  return {
    slug,
    title: String(data.title ?? slug),
    date: parseDate(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    categories: Array.isArray(data.categories)
      ? data.categories.map(String)
      : [],
    description: String(data.description ?? ""),
    cover: data.cover ? String(data.cover) : undefined,
    content: String(result),
  };
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => toSlug(f));
}

export function getAllTags(): string[] {
  const metas = getAllPostMetas();
  const set = new Set<string>();
  metas.forEach((m) => m.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

export function getAllCategories(): string[] {
  const metas = getAllPostMetas();
  const set = new Set<string>();
  metas.forEach((m) => m.categories.forEach((c) => set.add(c)));
  return Array.from(set).sort();
}
