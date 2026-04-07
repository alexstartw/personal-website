#!/usr/bin/env node
/**
 * Post Editor Dev Server
 * Usage: node tools/server.js
 *        (or: pnpm editor)
 * Opens: http://localhost:3001
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const https = require("https");
const url = require("url");
const { exec } = require("child_process");
const { convertNotionPage, buildMarkdownFile } = require("./notion-converter");
const { downloadImages, patchFailedImages } = require("./notion-images");

// In-memory Notion token store (session only, never written to disk)
let notionToken = process.env.NOTION_TOKEN || "";

const PORT = 3001;
const ROOT = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const COVERS_DIR = path.join(ROOT, "public", "images", "posts", "covers");
const CONTENT_IMG_DIR = path.join(ROOT, "public", "images", "posts", "content");
const PHOTOS_DIR = path.join(ROOT, "content", "photos");
const PHOTOS_IMG_DIR = path.join(ROOT, "public", "images", "photos");

// Ensure dirs exist
[POSTS_DIR, COVERS_DIR, CONTENT_IMG_DIR, PHOTOS_DIR, PHOTOS_IMG_DIR].forEach(
  (d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  },
);

// Load .env.local if present
const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const match = line.match(/^\s*([^#=\s][^=]*?)\s*=\s*(.*)\s*$/);
      if (match) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    });
  if (process.env.NOTION_TOKEN) notionToken = process.env.NOTION_TOKEN;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function json(res, data, status = 200) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(body);
}

function downloadUrl(imgUrl, destDir, customFilename) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(imgUrl);
    let filename =
      customFilename || path.basename(parsed.pathname).split("?")[0];
    if (!filename || !filename.includes("."))
      filename = `image-${Date.now()}.png`;
    const destPath = path.join(destDir, filename);

    const proto = parsed.protocol === "https:" ? https : require("http");
    proto
      .get(imgUrl, (res) => {
        // Follow redirects
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return downloadUrl(res.headers.location, destDir)
            .then(resolve)
            .catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const out = fs.createWriteStream(destPath);
        res.pipe(out);
        out.on("finish", () => resolve({ filename, destPath }));
        out.on("error", reject);
      })
      .on("error", reject);
  });
}

// ── Route handlers ────────────────────────────────────────────────────────────

function handleEditor(res) {
  const htmlPath = path.join(__dirname, "post-editor.html");
  const html = fs.readFileSync(htmlPath, "utf-8");
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

function handleNotionImporter(res) {
  const htmlPath = path.join(__dirname, "notion-import.html");
  const html = fs.readFileSync(htmlPath, "utf-8");
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

// ── Notion API handlers ───────────────────────────────────────────────────────

async function handleNotionSetToken(req, res) {
  const buf = await readBody(req);
  const { token } = JSON.parse(buf.toString());
  if (!token) return json(res, { error: "Missing token" }, 400);
  notionToken = token.trim();
  json(res, { ok: true });
}

function handleNotionStatus(res) {
  json(res, { configured: !!notionToken });
}

async function handleNotionDatabases(res) {
  if (!notionToken) return json(res, { error: "Notion token not set" }, 401);
  const { Client } = require("@notionhq/client");
  const notion = new Client({ auth: notionToken });
  try {
    const response = await notion.search({ page_size: 100 });
    const all = response.results;

    // Normalise every result into a common shape with parent info for tree building
    const items = all.map((r) => {
      let title = "Untitled";
      if (r.object === "database") {
        title = r.title?.[0]?.plain_text || "Untitled";
      } else {
        const titleProp = Object.values(r.properties || {}).find(
          (p) => p.type === "title",
        );
        title =
          (Array.isArray(titleProp?.title)
            ? titleProp.title.map((t) => t.plain_text).join("")
            : "") || "Untitled";
      }

      // Resolve parent id
      let parentId = null;
      if (r.parent?.type === "database_id") parentId = r.parent.database_id;
      else if (r.parent?.type === "page_id") parentId = r.parent.page_id;

      return {
        id: r.id,
        object: r.object, // "page" | "database"
        title,
        parentId,
        last_edited_time: r.last_edited_time || null,
        cover: r.cover?.external?.url || r.cover?.file?.url || null,
      };
    });

    console.log(
      `[Notion] search returned ${all.length} items:`,
      items.map((i) => `${i.object}:${i.title}`).join(", "),
    );

    json(res, { items: items.filter((i) => i.title !== "Untitled") });
  } catch (e) {
    json(res, { error: e.message }, 500);
  }
}

async function handleNotionPages(req, res) {
  if (!notionToken) return json(res, { error: "Notion token not set" }, 401);
  const { query } = url.parse(req.url, true);
  const databaseId = query.database_id;
  if (!databaseId) return json(res, { error: "Missing database_id" }, 400);

  const { Client } = require("@notionhq/client");
  const notion = new Client({ auth: notionToken });
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
    });
    const pages = response.results.map((page) => {
      const titleProp = Object.values(page.properties || {}).find(
        (p) => p.type === "title",
      );
      const title =
        (Array.isArray(titleProp?.title)
          ? titleProp.title.map((t) => t.plain_text).join("")
          : "") || "Untitled";
      return {
        id: page.id,
        title,
        url: page.url,
        created_time: page.created_time,
        last_edited_time: page.last_edited_time,
        cover: page.cover?.external?.url || page.cover?.file?.url || null,
      };
    });
    json(res, { pages: pages.filter((p) => p.title !== "Untitled") });
  } catch (e) {
    json(res, { error: e.message }, 500);
  }
}

async function handleNotionSearch(req, res) {
  if (!notionToken) return json(res, { error: "Notion token not set" }, 401);
  const { query: q } = url.parse(req.url, true);
  const query = q.query || "";

  const { Client } = require("@notionhq/client");
  const notion = new Client({ auth: notionToken });
  try {
    const response = await notion.search({
      query,
      filter: { property: "object", value: "page" },
      page_size: 30,
    });
    const pages = response.results.map((page) => {
      const titleProp = Object.values(page.properties || {}).find(
        (p) => p.type === "title",
      );
      const title =
        (Array.isArray(titleProp?.title)
          ? titleProp.title.map((t) => t.plain_text).join("")
          : "") || "Untitled";
      return {
        id: page.id,
        title,
        url: page.url,
        created_time: page.created_time,
        last_edited_time: page.last_edited_time,
        cover: page.cover?.external?.url || page.cover?.file?.url || null,
      };
    });
    json(res, { pages: pages.filter((p) => p.title !== "Untitled") });
  } catch (e) {
    json(res, { error: e.message }, 500);
  }
}

async function handleNotionPreview(req, res) {
  if (!notionToken) return json(res, { error: "Notion token not set" }, 401);
  const buf = await readBody(req);
  const { pageId, overrides } = JSON.parse(buf.toString());
  if (!pageId) return json(res, { error: "Missing pageId" }, 400);

  try {
    const result = await convertNotionPage(
      pageId,
      notionToken,
      overrides || {},
    );
    const fullMd = buildMarkdownFile(result.frontmatter, result.markdownBody);
    json(res, {
      slug: result.slug,
      frontmatter: result.frontmatter,
      markdownBody: result.markdownBody,
      markdownFile: fullMd,
      images: result.images,
      exists: fs.existsSync(path.join(POSTS_DIR, `${result.slug}.md`)),
    });
  } catch (e) {
    json(res, { error: e.message }, 500);
  }
}

async function handleNotionImport(req, res) {
  if (!notionToken) return json(res, { error: "Notion token not set" }, 401);
  const buf = await readBody(req);
  const { pageId, overrides, overwrite } = JSON.parse(buf.toString());
  if (!pageId) return json(res, { error: "Missing pageId" }, 400);

  try {
    // 1. Convert page
    const result = await convertNotionPage(
      pageId,
      notionToken,
      overrides || {},
    );
    const { slug, frontmatter, images } = result;
    let { markdownBody } = result;

    // 2. Check duplicate
    const destFile = path.join(POSTS_DIR, `${slug}.md`);
    if (fs.existsSync(destFile) && !overwrite) {
      return json(res, { exists: true, slug }, 409);
    }

    // 3. Download images
    const imgResults = await downloadImages(images);
    markdownBody = patchFailedImages(markdownBody, imgResults);

    // 4. Write .md file
    const fullMd = buildMarkdownFile(frontmatter, markdownBody);
    fs.writeFileSync(destFile, fullMd, "utf-8");

    const failedImages = imgResults.filter((r) => !r.ok);
    json(res, {
      ok: true,
      slug,
      title: frontmatter.title,
      failedImages,
      editorUrl: `/editor?slug=${encodeURIComponent(slug)}`,
    });
  } catch (e) {
    json(res, { error: e.message }, 500);
  }
}

function handleGetPosts(res) {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const metas = files.map((f) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, f), "utf-8");
    const lines = raw.split("\n");
    const meta = { slug: f.replace(/\.md$/, "") };
    // Quick frontmatter parse
    let inFront = false;
    const cats = [],
      tags = [];
    for (const line of lines) {
      if (line.trim() === "---") {
        if (!inFront) {
          inFront = true;
          continue;
        } else break;
      }
      if (!inFront) continue;
      if (line.startsWith("title:"))
        meta.title = line
          .replace("title:", "")
          .trim()
          .replace(/^["']|["']$/g, "");
      if (line.startsWith("categories:") || line.startsWith("tags:")) {
        meta._reading = line.startsWith("categories:") ? "cat" : "tag";
      }
      if (line.startsWith("  - ") && meta._reading === "cat")
        cats.push(
          line
            .replace("  - ", "")
            .replace(/^\[|\]$/g, "")
            .trim(),
        );
      if (line.startsWith("  - ") && meta._reading === "tag")
        tags.push(line.replace("  - ", "").trim());
    }
    meta.categories = cats;
    meta.tags = tags;
    delete meta._reading;
    return meta;
  });
  json(res, metas);
}

function handleGetCovers(res) {
  const covers = fs.existsSync(COVERS_DIR)
    ? fs
        .readdirSync(COVERS_DIR)
        .filter((f) => /\.(png|jpe?g|webp|gif|svg)$/i.test(f))
    : [];
  const contentImgs = fs.existsSync(CONTENT_IMG_DIR)
    ? fs
        .readdirSync(CONTENT_IMG_DIR)
        .filter((f) => /\.(png|jpe?g|webp|gif|svg)$/i.test(f))
    : [];
  json(res, { covers, contentImgs });
}

async function handleSavePost(req, res) {
  const buf = await readBody(req);
  const { filename, content } = JSON.parse(buf.toString());
  if (!filename || !content)
    return json(res, { error: "Missing filename or content" }, 400);
  const safe = filename.endsWith(".md") ? filename : `${filename}.md`;
  const dest = path.join(POSTS_DIR, safe);
  if (fs.existsSync(dest)) {
    // Overwrite allowed — editor warns first
  }
  fs.writeFileSync(dest, content, "utf-8");
  json(res, { ok: true, path: dest });
}

function handleGetPost(req, res) {
  const { query } = url.parse(req.url, true);
  const slug = query.slug;
  if (!slug) return json(res, { error: "Missing slug" }, 400);
  const filepath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return json(res, { error: "Not found" }, 404);
  const raw = fs.readFileSync(filepath, "utf-8");
  json(res, { raw });
}

async function handleDownloadImage(req, res) {
  const buf = await readBody(req);
  const { imgUrl, type, filename: customFilename } = JSON.parse(buf.toString());
  if (!imgUrl) return json(res, { error: "Missing imgUrl" }, 400);
  const destDir = type === "cover" ? COVERS_DIR : CONTENT_IMG_DIR;
  try {
    const { filename } = await downloadUrl(imgUrl, destDir, customFilename);
    const publicPath =
      type === "cover"
        ? `/images/posts/covers/${filename}`
        : `/images/posts/content/${filename}`;
    json(res, { ok: true, path: publicPath, filename });
  } catch (e) {
    json(res, { error: e.message }, 500);
  }
}

async function handleUploadImage(req, res) {
  // Receives raw binary body with header X-Filename
  const filename = req.headers["x-filename"] || `paste-${Date.now()}.png`;
  const buf = await readBody(req);
  const dest = path.join(CONTENT_IMG_DIR, filename);
  fs.writeFileSync(dest, buf);
  json(res, { ok: true, path: `/images/posts/content/${filename}` });
}

// ── Photo handlers ────────────────────────────────────────────────────────────

function handleGetPhotos(res) {
  const files = fs.existsSync(PHOTOS_DIR)
    ? fs.readdirSync(PHOTOS_DIR).filter((f) => f.endsWith(".md"))
    : [];
  const works = files.map((f) => {
    const raw = fs.readFileSync(path.join(PHOTOS_DIR, f), "utf-8");
    const slug = f.replace(/\.md$/, "");
    let title = slug,
      category = "portrait";
    let inFront = false;
    for (const line of raw.split("\n")) {
      if (line.trim() === "---") {
        if (!inFront) {
          inFront = true;
          continue;
        } else break;
      }
      if (!inFront) continue;
      if (line.startsWith("title:"))
        title = line
          .replace("title:", "")
          .trim()
          .replace(/^["']|["']$/g, "");
      if (line.startsWith("category:"))
        category = line.replace("category:", "").trim();
    }
    return { slug, title, category };
  });
  json(res, works);
}

function handleGetPhoto(req, res) {
  const { query } = url.parse(req.url, true);
  const slug = query.slug;
  if (!slug) return json(res, { error: "Missing slug" }, 400);
  const filepath = path.join(PHOTOS_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return json(res, { error: "Not found" }, 404);
  json(res, { raw: fs.readFileSync(filepath, "utf-8") });
}

async function handleSavePhoto(req, res) {
  const buf = await readBody(req);
  const { filename, content } = JSON.parse(buf.toString());
  if (!filename || !content)
    return json(res, { error: "Missing filename or content" }, 400);
  const safe = filename.endsWith(".md") ? filename : `${filename}.md`;
  fs.writeFileSync(path.join(PHOTOS_DIR, safe), content, "utf-8");
  json(res, { ok: true });
}

async function handleUploadPhoto(req, res) {
  const filename = req.headers["x-filename"] || `photo-${Date.now()}.jpg`;
  const buf = await readBody(req);
  const dest = path.join(PHOTOS_IMG_DIR, filename);
  fs.writeFileSync(dest, buf);
  // Resize with sips (macOS)
  const { execSync } = require("child_process");
  try {
    execSync(`sips -Z 2400 "${dest}" --out "${dest}"`, { stdio: "ignore" });
  } catch (_) {}
  json(res, { ok: true, path: `/images/photos/${filename}` });
}

async function handleDeletePost(req, res) {
  const buf = await readBody(req);
  const { slug } = JSON.parse(buf.toString());
  if (!slug) return json(res, { error: "Missing slug" }, 400);
  const filepath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return json(res, { error: "Not found" }, 404);
  fs.unlinkSync(filepath);
  json(res, { ok: true });
}

async function handleDeletePhoto(req, res) {
  const buf = await readBody(req);
  const { slug } = JSON.parse(buf.toString());
  if (!slug) return json(res, { error: "Missing slug" }, 400);
  const filepath = path.join(PHOTOS_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return json(res, { error: "Not found" }, 404);
  fs.unlinkSync(filepath);
  json(res, { ok: true });
}

async function handlePublishPhoto(req, res) {
  const buf = await readBody(req);
  const { slug, title } = JSON.parse(buf.toString());
  if (!slug || !title)
    return json(res, { error: "Missing slug or title" }, 400);

  function run(cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, { cwd: ROOT }, (err, stdout, stderr) => {
        if (err) reject(new Error(stderr || err.message));
        else resolve(stdout.trim());
      });
    });
  }

  try {
    await run(`git add "content/photos/${slug}.md" "public/images/photos"`);
    const staged = await run("git diff --cached --name-only");
    if (!staged) return json(res, { ok: true, message: "Nothing to commit" });
    await run(`git commit -m "photo: ${title.replace(/"/g, "'")}"`);
    await run("git push");
    json(res, { ok: true, message: "Published!" });
  } catch (e) {
    json(res, { error: e.message }, 500);
  }
}

async function handlePublish(req, res) {
  const buf = await readBody(req);
  const { slug, title } = JSON.parse(buf.toString());
  if (!slug || !title)
    return json(res, { error: "Missing slug or title" }, 400);

  const postFile = path.join("content", "posts", `${slug}.md`);
  const imagesDir = path.join("public", "images", "posts");

  function run(cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, { cwd: ROOT }, (err, stdout, stderr) => {
        if (err) reject(new Error(stderr || err.message));
        else resolve(stdout.trim());
      });
    });
  }

  try {
    await run(`git add "${postFile}" "${imagesDir}"`);
    // Check if there's anything staged
    const staged = await run("git diff --cached --name-only");
    if (!staged) return json(res, { ok: true, message: "Nothing to commit" });
    await run(`git commit -m "post: ${title.replace(/"/g, "'")}"`);
    await run("git push");
    json(res, { ok: true, message: "Published!" });
  } catch (e) {
    json(res, { error: e.message }, 500);
  }
}

// ── Server ────────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url);

  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    });
    return res.end();
  }

  try {
    if (pathname === "/" || pathname === "/editor") return handleEditor(res);
    if (pathname === "/import") return handleNotionImporter(res);

    // Notion API routes
    if (pathname === "/api/notion/token" && req.method === "POST")
      return await handleNotionSetToken(req, res);
    if (pathname === "/api/notion/status" && req.method === "GET")
      return handleNotionStatus(res);
    if (pathname === "/api/notion/databases" && req.method === "GET")
      return await handleNotionDatabases(res);
    if (pathname === "/api/notion/pages" && req.method === "GET")
      return await handleNotionPages(req, res);
    if (pathname === "/api/notion/search" && req.method === "GET")
      return await handleNotionSearch(req, res);
    if (pathname === "/api/notion/preview" && req.method === "POST")
      return await handleNotionPreview(req, res);
    if (pathname === "/api/notion/import" && req.method === "POST")
      return await handleNotionImport(req, res);

    if (pathname === "/api/posts" && req.method === "GET")
      return handleGetPosts(res);
    if (pathname === "/api/covers" && req.method === "GET")
      return handleGetCovers(res);
    if (pathname === "/api/post" && req.method === "GET")
      return handleGetPost(req, res);
    if (pathname === "/api/save" && req.method === "POST")
      return await handleSavePost(req, res);
    if (pathname === "/api/download-image" && req.method === "POST")
      return await handleDownloadImage(req, res);
    if (pathname === "/api/upload-image" && req.method === "POST")
      return await handleUploadImage(req, res);
    if (pathname === "/api/publish" && req.method === "POST")
      return await handlePublish(req, res);
    if (pathname === "/api/photos" && req.method === "GET")
      return handleGetPhotos(res);
    if (pathname === "/api/photo" && req.method === "GET")
      return handleGetPhoto(req, res);
    if (pathname === "/api/save-photo" && req.method === "POST")
      return await handleSavePhoto(req, res);
    if (pathname === "/api/upload-photo" && req.method === "POST")
      return await handleUploadPhoto(req, res);
    if (pathname === "/api/publish-photo" && req.method === "POST")
      return await handlePublishPhoto(req, res);
    if (pathname === "/api/delete-post" && req.method === "POST")
      return await handleDeletePost(req, res);
    if (pathname === "/api/delete-photo" && req.method === "POST")
      return await handleDeletePhoto(req, res);

    // Serve static files from /public/
    if (pathname.startsWith("/public/")) {
      const filePath = path.join(ROOT, pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mime =
          {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".webp": "image/webp",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
          }[ext] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": mime });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }

    res.writeHead(404);
    res.end("Not found");
  } catch (e) {
    console.error(e);
    json(res, { error: e.message }, 500);
  }
});

server.listen(PORT, () => {
  console.log(`\n✦ Post Editor running at http://localhost:${PORT}\n`);
});
