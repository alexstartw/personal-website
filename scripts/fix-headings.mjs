#!/usr/bin/env node
/**
 * Fix heading hierarchy in all migrated posts:
 * 1. Cap h5/h6 → h4
 * 2. Fix forward level skips (h2 → h4 becomes h2 → h3)
 * 3. Fix posts whose first heading is h3+ (normalize min to h2)
 *
 * Only touches content headings — skips lines inside fenced code blocks.
 */

import fs from "fs";
import path from "path";

const POSTS_DIR =
  "/Users/alex/Documents/Coding/personal_website/content/posts";

function fixHeadings(body) {
  const lines = body.split("\n");
  let inCode = false;

  // ── Pass 1: collect heading levels outside code blocks ──────────────────
  const headingLines = []; // { idx, level }
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = lines[i].match(/^(#{2,6}) /);
    if (m) headingLines.push({ idx: i, level: m[1].length });
  }

  if (headingLines.length === 0) return body;

  // ── Pass 2: build level-remap table ─────────────────────────────────────
  // Step A: shift everything so min level becomes 2
  const minLevel = Math.min(...headingLines.map((h) => h.level));
  const shift = minLevel > 2 ? 2 - minLevel : 0; // negative or zero

  // Apply shift first
  headingLines.forEach((h) => (h.level = h.level + shift));

  // Step B: cap at h4
  headingLines.forEach((h) => {
    if (h.level > 4) h.level = 4;
  });

  // Step C: fix forward skips — ensure no level jumps by more than 1
  for (let i = 1; i < headingLines.length; i++) {
    const prev = headingLines[i - 1].level;
    const cur = headingLines[i].level;
    if (cur > prev + 1) {
      headingLines[i].level = prev + 1;
    }
  }

  // ── Pass 3: apply remaps ─────────────────────────────────────────────────
  const newLines = [...lines];
  for (const { idx, level } of headingLines) {
    const original = lines[idx];
    const originalLevel = original.match(/^(#+) /)?.[1].length ?? level;
    if (originalLevel !== level) {
      newLines[idx] = "#".repeat(level) + original.slice(originalLevel);
    }
  }

  return newLines.join("\n");
}

const files = fs
  .readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith(".md"))
  .sort();

let fixed = 0;
let unchanged = 0;

for (const filename of files) {
  const slug = filename.replace(/\.md$/, "");
  const filepath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filepath, "utf-8");

  // Split front matter from body
  const fmMatch = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!fmMatch) {
    console.log(`[SKIP] ${slug} — no front matter`);
    continue;
  }

  const fm = fmMatch[0];
  const body = raw.slice(fm.length);
  const newBody = fixHeadings(body);

  if (newBody !== body) {
    fs.writeFileSync(filepath, fm + newBody, "utf-8");
    console.log(`[FIXED] ${slug}`);
    fixed++;
  } else {
    unchanged++;
  }
}

console.log(`\nDone. ${fixed} fixed, ${unchanged} unchanged.`);
