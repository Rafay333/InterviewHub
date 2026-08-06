/**
 * Full HD (1920×1080) clean explanation diagrams for interview Q&A images.
 */
const fs = require("fs");
const { uploadRoot } = require("../middleware/upload");

const BASE = process.env.PUBLIC_API_BASE || "http://localhost:5050";

/** True Full HD output */
const FULL_HD_W = 1920;
const FULL_HD_H = 1080;

let createCanvas;
try {
  ({ createCanvas } = require("@napi-rs/canvas"));
} catch {
  createCanvas = null;
}

function ensureUploadDir() {
  if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });
}

function savePng(buffer, slug) {
  ensureUploadDir();
  const filename = `${Date.now()}-${String(slug || "diagram")
    .replace(/[^a-z0-9]+/gi, "-")
    .slice(0, 36)
    .toLowerCase()}-fhd.png`;
  fs.writeFileSync(require("path").join(uploadRoot, filename), buffer);
  return `${BASE}/uploads/${filename}`;
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function wrapLines(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * @param {{ title: string, panels: { h: string, lines: string[] }[], footer?: string }} spec
 * @returns {string|null} public URL of a 1920×1080 PNG
 */
function renderCleanDiagram(spec) {
  if (!createCanvas) return null;

  const title = spec.title || "Explanation";
  const panels = Array.isArray(spec.panels) ? spec.panels : [];
  const footer = spec.footer || "";
  const n = Math.max(panels.length, 1);

  const W = FULL_HD_W;
  const H = FULL_HD_H;

  // Full-HD scale (layout tuned for 1080p)
  const padX = 80;
  const padTop = 72;
  const titleBlock = 100;
  const gap = 48;
  const panelInnerPad = 48;
  const lineH = 42;
  const footerReserve = footer ? 90 : 48;

  const usableW = W - padX * 2 - gap * (n - 1);
  const panelW = usableW / n;
  const panelY = padTop + titleBlock;
  const panelH = H - panelY - footerReserve - padTop * 0.35;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // Crisp text rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.textBaseline = "alphabetic";

  // Clean white Full HD canvas
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Soft edge frame
  ctx.strokeStyle = "#e8eef5";
  ctx.lineWidth = 2;
  roundRect(ctx, 2, 2, W - 4, H - 4, 28);
  ctx.stroke();

  // Title
  ctx.fillStyle = "#0b1f3a";
  ctx.font = "600 48px Segoe UI, Arial, sans-serif";
  ctx.fillText(title, padX, padTop + 40);

  // Rule under title
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padX, padTop + titleBlock - 24);
  ctx.lineTo(W - padX, padTop + titleBlock - 24);
  ctx.stroke();

  const accents = ["#2563eb", "#0d9488", "#ea580c", "#7c3aed"];

  panels.forEach((p, i) => {
    const x = padX + i * (panelW + gap);
    const accent = accents[i % accents.length];

    // Card background
    ctx.fillStyle = "#f8fafc";
    roundRect(ctx, x, panelY, panelW, panelH, 24);
    ctx.fill();

    // Card border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    roundRect(ctx, x, panelY, panelW, panelH, 24);
    ctx.stroke();

    // Left accent bar
    ctx.fillStyle = accent;
    roundRect(ctx, x, panelY, 8, panelH, 4);
    ctx.fill();
    ctx.fillRect(x + 4, panelY, 6, panelH);

    // Panel heading
    ctx.fillStyle = "#0b1f3a";
    ctx.font = "600 32px Segoe UI, Arial, sans-serif";
    const heading = p.h || `Part ${i + 1}`;
    const headLines = wrapLines(ctx, heading, panelW - panelInnerPad * 2);
    let hy = panelY + 56;
    headLines.forEach((ln) => {
      ctx.fillText(ln, x + panelInnerPad, hy);
      hy += 40;
    });

    // Divider
    const dividerY = hy + 12;
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + panelInnerPad, dividerY);
    ctx.lineTo(x + panelW - panelInnerPad, dividerY);
    ctx.stroke();

    // Body bullets
    ctx.font = "400 28px Segoe UI, Arial, sans-serif";
    let y = dividerY + 52;
    const maxTextW = panelW - panelInnerPad * 2 - 28;
    const maxY = panelY + panelH - 36;

    (p.lines || []).forEach((raw) => {
      if (y > maxY) return;
      const lines = wrapLines(ctx, raw, maxTextW);
      lines.forEach((ln, li) => {
        if (y > maxY) return;
        if (li === 0) {
          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.arc(x + panelInnerPad + 8, y - 8, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#334155";
          ctx.fillText(ln, x + panelInnerPad + 28, y);
        } else {
          ctx.fillStyle = "#334155";
          ctx.fillText(ln, x + panelInnerPad + 28, y);
        }
        y += lineH;
      });
      y += 14;
    });
  });

  if (footer) {
    ctx.fillStyle = "#64748b";
    ctx.font = "400 24px Segoe UI, Arial, sans-serif";
    const fy = panelY + panelH + 40;
    const flines = wrapLines(ctx, footer, W - padX * 2);
    flines.forEach((ln, i) => {
      ctx.fillText(ln, padX, fy + i * 32);
    });
  }

  // Tiny corner tag so exports are identifiable as FHD
  ctx.fillStyle = "#94a3b8";
  ctx.font = "400 16px Segoe UI, Arial, sans-serif";
  ctx.fillText("1920×1080", W - padX - 100, H - 28);

  return savePng(canvas.toBuffer("image/png"), title);
}

module.exports = {
  renderCleanDiagram,
  FULL_HD_W,
  FULL_HD_H,
};
