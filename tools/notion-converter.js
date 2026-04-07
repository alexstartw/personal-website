#!/usr/bin/env node
/**
 * notion-converter.js
 * Converts a Notion page to Markdown + gray-matter frontmatter.
 *
 * Returns: { slug, frontmatter, markdownBody, images[] }
 * where images = [{ notionUrl, localPath, isCover }]
 */

const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");

// ── Slug helpers ────────────────────────────────────────────────────────────

/**
 * Build a URL-safe slug from a title.
 * - Preserves CJK characters (consistent with existing posts like "Airflow-建立學習.md")
 * - Replaces spaces/unsafe chars with hyphens
 * - Removes characters that are unsafe on filesystems
 */
function titleToSlug(title) {
  return title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Rich text helpers ────────────────────────────────────────────────────────

function richTextToPlain(richTexts) {
  if (!Array.isArray(richTexts)) return "";
  return richTexts.map((t) => t.plain_text || "").join("");
}

// ── Property extractors ─────────────────────────────────────────────────────

function extractTitle(page) {
  const titleProp = Object.values(page.properties || {}).find(
    (p) => p.type === "title",
  );
  if (titleProp) return richTextToPlain(titleProp.title);
  return "Untitled";
}

function extractDate(page) {
  // Try a Date property first, fall back to created_time
  const dateProp = Object.values(page.properties || {}).find(
    (p) => p.type === "date" && p.date?.start,
  );
  if (dateProp) return dateProp.date.start;
  return (page.created_time || new Date().toISOString()).slice(0, 10);
}

function extractMultiSelect(page, propertyNames) {
  for (const name of propertyNames) {
    const prop = page.properties?.[name];
    if (prop?.type === "multi_select") {
      return prop.multi_select.map((s) => s.name);
    }
    if (prop?.type === "select" && prop.select) {
      return [prop.select.name];
    }
  }
  return [];
}

function extractDescription(page) {
  // Try a rich_text property named Description / Summary / Excerpt
  const candidates = [
    "Description",
    "description",
    "Summary",
    "Excerpt",
    "摘要",
  ];
  for (const name of candidates) {
    const prop = page.properties?.[name];
    if (prop?.type === "rich_text") {
      const text = richTextToPlain(prop.rich_text).trim();
      if (text) return text;
    }
  }
  return "";
}

// ── Custom notion-to-md transformers ─────────────────────────────────────────

function setupCustomTransformers(n2m) {
  // Callout → blockquote with emoji
  n2m.setCustomTransformer("callout", async (block) => {
    const icon = block.callout?.icon?.emoji || "💡";
    const text = richTextToPlain(block.callout?.rich_text || []);
    return `> ${icon} ${text}`;
  });

  // Bookmark → link
  n2m.setCustomTransformer("bookmark", async (block) => {
    const url = block.bookmark?.url || "";
    const caption = richTextToPlain(block.bookmark?.caption || []) || url;
    return `[${caption}](${url})`;
  });

  // Table of contents → skip
  n2m.setCustomTransformer("table_of_contents", async () => "");

  // Divider → ---
  n2m.setCustomTransformer("divider", async () => "---");

  // Embed → link
  n2m.setCustomTransformer("embed", async (block) => {
    const url = block.embed?.url || "";
    return `[Embedded content](${url})`;
  });
}

// ── Image extraction ─────────────────────────────────────────────────────────

/**
 * Walk the markdown body and extract all Notion image URLs.
 * Returns: { updatedBody, images[] }
 * images = [{ notionUrl, localFilename, localPath }]
 */
function extractImages(markdownBody, slug) {
  const images = [];
  let counter = 1;

  const updatedBody = markdownBody.replace(
    /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g,
    (match, alt, imgUrl) => {
      const ext = extractExtension(imgUrl);
      const localFilename = `${slug}-${counter}${ext}`;
      // Convention: /images/posts/<slug>/<filename>  (matches existing posts)
      const localPath = `/images/posts/${slug}/${localFilename}`;
      images.push({
        notionUrl: imgUrl,
        localFilename,
        localPath,
        slug,
        isCover: false,
      });
      counter++;
      return `![${alt}](${localPath})`;
    },
  );

  return { updatedBody, images };
}

function extractExtension(imgUrl) {
  try {
    const pathname = new URL(imgUrl).pathname;
    const base = pathname.split("/").pop().split("?")[0];
    const dotIdx = base.lastIndexOf(".");
    if (dotIdx !== -1) {
      const ext = base.slice(dotIdx).toLowerCase();
      if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].includes(ext))
        return ext;
    }
  } catch (_) {}
  return ".png";
}

// ── Cover image ──────────────────────────────────────────────────────────────

function extractCoverUrl(page) {
  const cover = page.cover;
  if (!cover) return null;
  if (cover.type === "external") return cover.external?.url || null;
  if (cover.type === "file") return cover.file?.url || null;
  return null;
}

// ── Main converter ───────────────────────────────────────────────────────────

/**
 * Convert a Notion page to a blog post.
 *
 * @param {string} pageId   - Notion page ID
 * @param {string} token    - Notion integration token
 * @param {object} overrides - Optional frontmatter overrides from UI
 * @returns {{ slug, frontmatter, markdownBody, images, rawPage }}
 */
async function convertNotionPage(pageId, token, overrides = {}) {
  const notion = new Client({ auth: token });
  const n2m = new NotionToMarkdown({ notionClient: notion });
  setupCustomTransformers(n2m);

  // Fetch the page
  const page = await notion.pages.retrieve({ page_id: pageId });

  // Extract metadata
  const title = overrides.title || extractTitle(page);
  const slug = overrides.slug || titleToSlug(title);
  const date = overrides.date || extractDate(page);
  const tags =
    overrides.tags || extractMultiSelect(page, ["Tags", "tags", "Tag", "標籤"]);
  const categories =
    overrides.categories ||
    extractMultiSelect(page, ["Categories", "Category", "categories", "分類"]);
  const description = overrides.description || extractDescription(page);

  // Convert blocks to Markdown
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  let markdownBody = n2m.toMarkdownString(mdBlocks).parent || "";

  // Extract and rewrite inline images
  const { updatedBody, images } = extractImages(markdownBody, slug);
  markdownBody = updatedBody;

  // Handle cover image
  const coverUrl = extractCoverUrl(page);
  let coverPath = overrides.cover || "";
  if (coverUrl && !overrides.cover) {
    const ext = extractExtension(coverUrl);
    const localFilename = `${slug}-cover${ext}`;
    coverPath = `/images/posts/covers/${localFilename}`;
    images.push({
      notionUrl: coverUrl,
      localFilename,
      localPath: coverPath,
      isCover: true,
    });
  }

  // Build frontmatter object
  const frontmatter = {
    title,
    date,
    ...(description && { description }),
    ...(categories.length && { categories }),
    ...(tags.length && { tags }),
    ...(coverPath && { cover: coverPath }),
  };

  return { slug, frontmatter, markdownBody, images, rawPage: page };
}

/**
 * Render frontmatter object to YAML string (gray-matter compatible).
 */
function renderFrontmatter(fm) {
  const lines = ["---"];
  lines.push(`title: "${fm.title.replace(/"/g, '\\"')}"`);
  lines.push(`date: "${fm.date}"`);
  if (fm.description)
    lines.push(`description: "${fm.description.replace(/"/g, '\\"')}"`);
  if (fm.categories?.length) {
    lines.push("categories:");
    fm.categories.forEach((c) => lines.push(`  - ${c}`));
  }
  if (fm.tags?.length) {
    lines.push("tags:");
    fm.tags.forEach((t) => lines.push(`  - ${t}`));
  }
  if (fm.cover) lines.push(`cover: "${fm.cover}"`);
  lines.push("---");
  return lines.join("\n");
}

/**
 * Build the full .md file content.
 */
function buildMarkdownFile(frontmatter, markdownBody) {
  return `${renderFrontmatter(frontmatter)}\n\n${markdownBody.trim()}\n`;
}

module.exports = { convertNotionPage, buildMarkdownFile, titleToSlug };
