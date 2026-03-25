import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  PhotoWork,
  PhotoCategory,
  PhotoPerson,
  PhotoLocation,
} from "@/types/photo";

function parsePerson(raw: unknown): PhotoPerson | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const obj = raw as Record<string, unknown>;
  if (!obj.name) return undefined;
  return {
    name: String(obj.name),
    ig: obj.ig ? String(obj.ig) : undefined,
  };
}

function parseLocation(raw: unknown): PhotoLocation | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const obj = raw as Record<string, unknown>;
  if (!obj.name) return undefined;
  return {
    name: String(obj.name),
    ig: obj.ig ? String(obj.ig) : undefined,
  };
}

const PHOTOS_DIR = path.join(process.cwd(), "content/photos");

function toSlug(filename: string): string {
  return filename.replace(/\.md$/, "");
}

function parseDate(raw: unknown): string {
  if (!raw) return new Date().toISOString();
  const d = new Date(String(raw));
  return isNaN(d.getTime()) ? String(raw) : d.toISOString();
}

export function getAllPhotoWorks(): PhotoWork[] {
  if (!fs.existsSync(PHOTOS_DIR)) return [];
  const files = fs.readdirSync(PHOTOS_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(PHOTOS_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug: toSlug(filename),
        title: String(data.title ?? toSlug(filename)),
        category: (data.category as PhotoCategory) ?? "portrait",
        images: Array.isArray(data.images) ? data.images.map(String) : [],
        igUrl: String(data.igUrl ?? ""),
        date: parseDate(data.date),
        description: data.description ? String(data.description) : undefined,
        subject: data.subject ? String(data.subject) : undefined,
        model: parsePerson(data.model),
        location: parseLocation(data.location),
        camera: data.camera ? String(data.camera) : undefined,
        lens: data.lens ? String(data.lens) : undefined,
      } satisfies PhotoWork;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPhotoWorkBySlug(slug: string): PhotoWork | null {
  const filepath = path.join(PHOTOS_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data } = matter(raw);

  return {
    slug,
    title: String(data.title ?? slug),
    category: (data.category as PhotoCategory) ?? "portrait",
    images: Array.isArray(data.images) ? data.images.map(String) : [],
    igUrl: String(data.igUrl ?? ""),
    date: parseDate(data.date),
    description: data.description ? String(data.description) : undefined,
    subject: data.subject ? String(data.subject) : undefined,
    model: parsePerson(data.model),
    location: parseLocation(data.location),
    camera: data.camera ? String(data.camera) : undefined,
    lens: data.lens ? String(data.lens) : undefined,
  };
}

export function getAllPhotoSlugs(): string[] {
  if (!fs.existsSync(PHOTOS_DIR)) return [];
  return fs
    .readdirSync(PHOTOS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => toSlug(f));
}

export function getPhotoWorksByCategory(category: PhotoCategory): PhotoWork[] {
  return getAllPhotoWorks().filter((w) => w.category === category);
}
