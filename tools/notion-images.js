#!/usr/bin/env node
/**
 * notion-images.js
 * Downloads images from Notion (S3 / external URLs) to the local public dir.
 * Notion image URLs expire after ~1 hour, so we must download at import time.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const ROOT = path.join(__dirname, "..");
const COVERS_DIR = path.join(ROOT, "public", "images", "posts", "covers");
const CONTENT_IMG_DIR = path.join(ROOT, "public", "images", "posts", "content");

// Ensure directories exist
[COVERS_DIR, CONTENT_IMG_DIR].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

/**
 * Download a single URL to destDir/filename.
 * Follows redirects (Notion S3 URLs redirect).
 * Returns { filename, localPath }
 */
function downloadFile(imgUrl, destDir, filename, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects === 0) return reject(new Error("Too many redirects"));

    let parsed;
    try {
      parsed = new URL(imgUrl);
    } catch (e) {
      return reject(new Error(`Invalid URL: ${imgUrl}`));
    }

    const proto = parsed.protocol === "https:" ? https : http;
    const destPath = path.join(destDir, filename);

    const req = proto.get(imgUrl, { timeout: 30000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destDir, filename, maxRedirects - 1)
          .then(resolve)
          .catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${imgUrl}`));
      }
      const out = fs.createWriteStream(destPath);
      res.pipe(out);
      out.on("finish", () => resolve({ filename, localPath: destPath }));
      out.on("error", reject);
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${imgUrl}`));
    });
  });
}

/**
 * Download all images for a post.
 *
 * @param {Array<{notionUrl, localFilename, localPath, isCover}>} images
 * @param {function} onProgress  - called with (index, total, filename, ok, error)
 * @returns {Array<{notionUrl, localFilename, localPath, isCover, ok, error}>}
 */
async function downloadImages(images, onProgress) {
  const results = [];

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const destDir = img.isCover ? COVERS_DIR : CONTENT_IMG_DIR;

    try {
      await downloadFile(img.notionUrl, destDir, img.localFilename);
      results.push({ ...img, ok: true });
      if (onProgress) onProgress(i + 1, images.length, img.localFilename, true, null);
    } catch (err) {
      // Don't abort the whole import — leave a placeholder comment
      results.push({ ...img, ok: false, error: err.message });
      if (onProgress) onProgress(i + 1, images.length, img.localFilename, false, err.message);
    }
  }

  return results;
}

/**
 * After downloading, patch any failed image URLs in the markdown body
 * with a comment so the user knows what to fix manually.
 *
 * @param {string} markdownBody
 * @param {Array<{localPath, ok, error}>} results
 * @returns {string}
 */
function patchFailedImages(markdownBody, results) {
  let body = markdownBody;
  for (const r of results) {
    if (!r.ok) {
      // Replace the local path reference with a comment
      body = body.replace(
        new RegExp(`!\\[([^\\]]*)\\]\\(${escapeRegex(r.localPath)}\\)`, "g"),
        `<!-- Image download failed (${r.error}): ${r.notionUrl} -->`
      );
    }
  }
  return body;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = { downloadImages, patchFailedImages };
