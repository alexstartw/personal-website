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

const PORT = 3001;
const ROOT = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const COVERS_DIR = path.join(ROOT, "public", "images", "posts", "covers");
const CONTENT_IMG_DIR = path.join(ROOT, "public", "images", "posts", "content");

// Ensure dirs exist
[POSTS_DIR, COVERS_DIR, CONTENT_IMG_DIR].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

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

function downloadUrl(imgUrl, destDir) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(imgUrl);
    let filename = path.basename(parsed.pathname).split("?")[0];
    if (!filename || !filename.includes(".")) filename = `image-${Date.now()}.png`;
    const destPath = path.join(destDir, filename);

    const proto = parsed.protocol === "https:" ? https : require("http");
    proto
      .get(imgUrl, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadUrl(res.headers.location, destDir).then(resolve).catch(reject);
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

function handleGetPosts(res) {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const metas = files.map((f) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, f), "utf-8");
    const lines = raw.split("\n");
    const meta = { slug: f.replace(/\.md$/, "") };
    // Quick frontmatter parse
    let inFront = false;
    const cats = [], tags = [];
    for (const line of lines) {
      if (line.trim() === "---") { if (!inFront) { inFront = true; continue; } else break; }
      if (!inFront) continue;
      if (line.startsWith("title:")) meta.title = line.replace("title:", "").trim().replace(/^["']|["']$/g, "");
      if (line.startsWith("categories:") || line.startsWith("tags:")) {
        meta._reading = line.startsWith("categories:") ? "cat" : "tag";
      }
      if (line.startsWith("  - ") && meta._reading === "cat") cats.push(line.replace("  - ", "").replace(/^\[|\]$/g, "").trim());
      if (line.startsWith("  - ") && meta._reading === "tag") tags.push(line.replace("  - ", "").trim());
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
    ? fs.readdirSync(COVERS_DIR).filter((f) => /\.(png|jpe?g|webp|gif|svg)$/i.test(f))
    : [];
  const contentImgs = fs.existsSync(CONTENT_IMG_DIR)
    ? fs.readdirSync(CONTENT_IMG_DIR).filter((f) => /\.(png|jpe?g|webp|gif|svg)$/i.test(f))
    : [];
  json(res, { covers, contentImgs });
}

async function handleSavePost(req, res) {
  const buf = await readBody(req);
  const { filename, content } = JSON.parse(buf.toString());
  if (!filename || !content) return json(res, { error: "Missing filename or content" }, 400);
  const safe = filename.endsWith(".md") ? filename : `${filename}.md`;
  const dest = path.join(POSTS_DIR, safe);
  if (fs.existsSync(dest)) {
    // Overwrite allowed — editor warns first
  }
  fs.writeFileSync(dest, content, "utf-8");
  json(res, { ok: true, path: dest });
}

async function handleDownloadImage(req, res) {
  const buf = await readBody(req);
  const { imgUrl, type } = JSON.parse(buf.toString());
  if (!imgUrl) return json(res, { error: "Missing imgUrl" }, 400);
  const destDir = type === "cover" ? COVERS_DIR : CONTENT_IMG_DIR;
  try {
    const { filename } = await downloadUrl(imgUrl, destDir);
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

// ── Server ────────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url);

  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" });
    return res.end();
  }

  try {
    if (pathname === "/" || pathname === "/editor") return handleEditor(res);
    if (pathname === "/api/posts" && req.method === "GET") return handleGetPosts(res);
    if (pathname === "/api/covers" && req.method === "GET") return handleGetCovers(res);
    if (pathname === "/api/save" && req.method === "POST") return await handleSavePost(req, res);
    if (pathname === "/api/download-image" && req.method === "POST") return await handleDownloadImage(req, res);
    if (pathname === "/api/upload-image" && req.method === "POST") return await handleUploadImage(req, res);

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
