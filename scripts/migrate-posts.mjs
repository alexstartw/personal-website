#!/usr/bin/env node
/**
 * Migrate Hexo posts → content/posts/
 *
 * Transformations applied:
 * 1. Heading shift: # → ##, ## → ###, etc. (title already renders as <h1>)
 * 2. {% asset_img filename [alt] %} → ![alt](/images/posts/[slug]/filename)
 * 3. cover: /img/cover/X.png → /images/posts/covers/X.png
 *    (copies the file to public/images/posts/covers/)
 * 4. Local post images copied to public/images/posts/[slug]/
 * 5. top_img field stripped (not used in new site)
 */

import fs from "fs";
import path from "path";

const HEXO_POSTS = "/Users/alex/Documents/Coding/Notes/source/_posts";
const HEXO_COVERS = "/Users/alex/Documents/Coding/Notes/source/img/cover";
const OUT_POSTS = "/Users/alex/Documents/Coding/personal_website/content/posts";
const OUT_PUBLIC =
  "/Users/alex/Documents/Coding/personal_website/public/images/posts";

// ── Helpers ──────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`  ⚠ source not found: ${src}`);
    return false;
  }
  ensureDir(path.dirname(dest));
  const buf = fs.readFileSync(src);
  fs.writeFileSync(dest, buf);
  return true;
}

/**
 * Parse YAML-ish front matter (simple key: value, arrays, multiline not needed).
 * Returns { data, body }.
 */
function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const yamlBlock = match[1];
  const body = match[2];

  const data = {};
  let currentKey = null;
  let inArray = false;

  for (const line of yamlBlock.split("\n")) {
    const arrayItem = line.match(/^\s{2,}-\s+(.+)$/);
    // Match key: value only when value is non-empty after trimming
    const keyValue = line.match(/^(\w[\w-]*):\s+(.+)/);
    // Match key: (empty or just whitespace) — array header
    const emptyArray = line.match(/^(\w[\w-]*):\s*$/);

    if (arrayItem && inArray && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(arrayItem[1].trim());
    } else if (emptyArray) {
      inArray = true;
      currentKey = emptyArray[1];
      data[currentKey] = [];
    } else if (keyValue) {
      inArray = false;
      currentKey = keyValue[1];
      data[currentKey] = keyValue[2].trim();
    }
  }

  return { data, body };
}

/**
 * Rebuild front matter YAML from a data object.
 * Handles strings and arrays. Omits empty / undefined fields.
 */
function buildFrontMatter(data) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      lines.push(`${k}:`);
      v.forEach((item) => lines.push(`  - ${item}`));
    } else {
      // Quote values that contain colons to keep YAML valid
      const needsQuote = String(v).includes(":") && !String(v).startsWith('"');
      lines.push(`${k}: ${needsQuote ? `"${v}"` : v}`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

/**
 * Shift all heading levels down by 1 in markdown body.
 * e.g. # Foo → ## Foo (but only at line start, not inside code blocks)
 */
function shiftHeadings(body) {
  const lines = body.split("\n");
  let inCodeBlock = false;
  const result = [];
  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
    }
    if (!inCodeBlock && /^#{1,5} /.test(line)) {
      result.push("#" + line);
    } else {
      result.push(line);
    }
  }
  return result.join("\n");
}

/**
 * Convert {% asset_img filename alt %} → ![alt](/images/posts/slug/filename)
 */
function convertAssetImgTags(body, slug) {
  return body.replace(
    /\{%\s*asset_img\s+(\S+)(?:\s+(.*?))?\s*%\}/g,
    (_, filename, alt) => {
      const altText = (alt ?? "").trim() || filename;
      return `![${altText}](/images/posts/${slug}/${filename})`;
    }
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

const files = fs
  .readdirSync(HEXO_POSTS)
  .filter((f) => f.endsWith(".md"))
  .sort();

console.log(`Found ${files.length} posts to migrate.\n`);

let skipped = 0;
let migrated = 0;

for (const filename of files) {
  const slug = filename.replace(/\.md$/, "");
  const srcPath = path.join(HEXO_POSTS, filename);
  const destPath = path.join(OUT_POSTS, filename);

  const raw = fs.readFileSync(srcPath, "utf8");
  const { data, body } = parseFrontMatter(raw);

  console.log(`[${slug}]`);

  // ── 1. Migrate cover image ───────────────────────────────────────────────
  let newCover = "";
  const rawCover = typeof data.cover === "string" ? data.cover.trim() : "";
  if (rawCover) {
    const coverFilename = path.basename(rawCover); // e.g. airflow.png
    const coverSrc = path.join(HEXO_COVERS, coverFilename);
    const coverDest = path.join(OUT_PUBLIC, "covers", coverFilename);
    const copied = copyFile(coverSrc, coverDest);
    if (copied) {
      newCover = `/images/posts/covers/${coverFilename}`;
      console.log(`  cover → /images/posts/covers/${coverFilename}`);
    }
  }

  // ── 2. Copy local post images ────────────────────────────────────────────
  const imgSrcDir = path.join(HEXO_POSTS, slug);
  if (fs.existsSync(imgSrcDir)) {
    const imgDestDir = path.join(OUT_PUBLIC, slug);
    ensureDir(imgDestDir);
    const imgs = fs.readdirSync(imgSrcDir);
    imgs.forEach((img) => {
      const src = path.join(imgSrcDir, img);
      const dest = path.join(imgDestDir, img);
      const buf = fs.readFileSync(src);
      fs.writeFileSync(dest, buf);
      console.log(`  img: ${img}`);
    });
  }

  // ── 3. Transform body ────────────────────────────────────────────────────
  let newBody = shiftHeadings(body);
  newBody = convertAssetImgTags(newBody, slug);

  // ── 4. Build output front matter ────────────────────────────────────────
  const outData = {};
  if (data.title) outData.title = data.title;
  if (data.date) outData.date = data.date;
  if (data.description) outData.description = data.description;
  if (Array.isArray(data.categories) && data.categories.length > 0) {
    outData.categories = data.categories;
  } else if (data.categories && !Array.isArray(data.categories)) {
    outData.categories = [data.categories];
  }
  if (Array.isArray(data.tags) && data.tags.length > 0) {
    outData.tags = data.tags;
  } else if (data.tags && !Array.isArray(data.tags)) {
    outData.tags = [data.tags];
  }
  if (newCover) outData.cover = newCover;
  // top_img is intentionally omitted

  const output = buildFrontMatter(outData) + "\n" + newBody;

  fs.writeFileSync(destPath, output, "utf8");
  console.log(`  ✓ written → content/posts/${filename}`);
  migrated++;
}

console.log(`\nDone. ${migrated} posts migrated, ${skipped} skipped.`);
