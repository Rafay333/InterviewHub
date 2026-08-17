/**
 * Full HD (1920×1080) explanation diagrams — large, high-contrast, edge-to-edge readable type.
 */
const fs = require("fs");
const path = require("path");
const { uploadRoot } = require("../middleware/upload");

const BASE = process.env.PUBLIC_API_BASE || "http://localhost:5050";

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
  fs.writeFileSync(path.join(uploadRoot, filename), buffer);
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

/** Greedy word wrap using measured text width */
function wrapLines(ctx, text, maxWidth) {
  const words = String(text || "")
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return [""];
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
 * Fit font size so title fits and looks large on 1080p.
 */
function fitFont(ctx, text, family, weight, maxPx, minPx, maxWidth) {
  for (let size = maxPx; size >= minPx; size -= 2) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
  }
  return minPx;
}

/**
 * @param {{ title: string, panels: { h: string, lines: string[] }[], footer?: string }} spec
 * @returns {string|null}
 */
function renderCleanDiagram(spec) {
  if (!createCanvas) return null;

  const title = String(spec.title || "Explanation");
  const panels = Array.isArray(spec.panels) && spec.panels.length ? spec.panels : [{ h: "Notes", lines: ["—"] }];
  const footer = String(spec.footer || "");
  const n = Math.min(Math.max(panels.length, 1), 3);

  const W = FULL_HD_W;
  const H = FULL_HD_H;
  const family = "Segoe UI, Arial, Helvetica, sans-serif";

  // Tight outer margins so content looks zoomed / fills FHD
  const marginX = 48;
  const marginTop = 36;
  const marginBottom = 36;
  const gap = 36;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.textBaseline = "alphabetic";

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Border
  ctx.strokeStyle = "#dbe3ee";
  ctx.lineWidth = 3;
  roundRect(ctx, 4, 4, W - 8, H - 8, 20);
  ctx.stroke();

  // Title — very large, fills width
  const titleMaxW = W - marginX * 2;
  const titleSize = fitFont(ctx, title, family, "700", 72, 44, titleMaxW);
  ctx.fillStyle = "#0b1f3a";
  ctx.font = `700 ${titleSize}px ${family}`;
  ctx.fillText(title, marginX, marginTop + titleSize);

  const titleBottom = marginTop + titleSize + 18;

  // Accent underline (thick)
  ctx.fillStyle = "#2563eb";
  roundRect(ctx, marginX, titleBottom, Math.min(220, titleMaxW * 0.2), 8, 4);
  ctx.fill();

  const ruleY = titleBottom + 22;
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(marginX, ruleY);
  ctx.lineTo(W - marginX, ruleY);
  ctx.stroke();

  const footerBlock = footer ? 70 : 28;
  const panelTop = ruleY + 28;
  const panelBottom = H - marginBottom - footerBlock;
  const panelH = panelBottom - panelTop;
  const usableW = W - marginX * 2 - gap * (n - 1);
  const panelW = usableW / n;

  const accents = ["#2563eb", "#0d9488", "#ea580c"];

  // Max bullets per panel — keep large type; truncate extras rather than shrink too much
  const MAX_BULLETS = 6;

  panels.slice(0, n).forEach((p, i) => {
    const x = marginX + i * (panelW + gap);
    const accent = accents[i % accents.length];
    const linesIn = (p.lines || []).slice(0, MAX_BULLETS);

    // Card fill
    ctx.fillStyle = "#f1f5f9";
    roundRect(ctx, x, panelTop, panelW, panelH, 22);
    ctx.fill();

    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 3;
    roundRect(ctx, x, panelTop, panelW, panelH, 22);
    ctx.stroke();

    // Thick left accent
    ctx.fillStyle = accent;
    roundRect(ctx, x, panelTop, 14, panelH, 6);
    ctx.fill();
    ctx.fillRect(x + 8, panelTop, 10, panelH);

    const innerLeft = x + 40;
    const innerRight = x + panelW - 36;
    const innerW = innerRight - innerLeft;

    // Panel heading — large
    const head = String(p.h || `Part ${i + 1}`);
    const headSize = fitFont(ctx, head, family, "700", 48, 32, innerW);
    ctx.fillStyle = "#0b1f3a";
    ctx.font = `700 ${headSize}px ${family}`;
    let y = panelTop + 28 + headSize;
    const headLines = wrapLines(ctx, head, innerW);
    headLines.forEach((ln) => {
      ctx.fillText(ln, innerLeft, y);
      y += headSize + 8;
    });

    // Divider
    y += 10;
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(innerLeft, y);
    ctx.lineTo(innerRight, y);
    ctx.stroke();
    y += 36;

    // Body type size — scale to remaining height
    const remainingH = panelTop + panelH - y - 28;
    const approxRows = Math.max(linesIn.length * 2, 4);
    let bodySize = Math.floor(remainingH / (approxRows * 1.35));
    bodySize = Math.max(30, Math.min(44, bodySize));
    const lineStep = Math.floor(bodySize * 1.45);
    const bulletR = Math.max(8, Math.floor(bodySize * 0.28));

    ctx.font = `600 ${bodySize}px ${family}`;

    linesIn.forEach((raw) => {
      if (y > panelTop + panelH - bodySize - 16) return;
      const wrapped = wrapLines(ctx, raw, innerW - bulletR * 2 - 28);
      wrapped.forEach((ln, li) => {
        if (y > panelTop + panelH - bodySize - 12) return;
        if (li === 0) {
          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.arc(innerLeft + bulletR, y - bodySize * 0.32, bulletR, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#0f172a";
          ctx.fillText(ln, innerLeft + bulletR * 2 + 18, y);
        } else {
          ctx.fillStyle = "#0f172a";
          ctx.fillText(ln, innerLeft + bulletR * 2 + 18, y);
        }
        y += lineStep;
      });
      y += Math.floor(bodySize * 0.35);
    });
  });

  if (footer) {
    const footerSize = 28;
    ctx.fillStyle = "#475569";
    ctx.font = `600 ${footerSize}px ${family}`;
    const fy = H - marginBottom - 18;
    const flines = wrapLines(ctx, footer, W - marginX * 2);
    // single line preferred — if wraps, take first only for clarity, or both small
    const line = flines[0] || footer;
    ctx.fillText(line, marginX, fy);
  }

  // FHD badge (small, not competing with content)
  ctx.fillStyle = "#94a3b8";
  ctx.font = `600 18px ${family}`;
  ctx.fillText("1920×1080", W - marginX - 110, H - 18);

  return savePng(canvas.toBuffer("image/png"), title);
}

module.exports = {
  renderCleanDiagram,
  FULL_HD_W,
  FULL_HD_H,
};
