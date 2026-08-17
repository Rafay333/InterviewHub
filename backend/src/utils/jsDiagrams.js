/**
 * Diverse Full HD (1920×1080) explanation visuals for JavaScript (not only 2-column bullets).
 * Layout kinds: steps | cycle | layers | code | timeline | hub | compare
 */
const fs = require("fs");
const path = require("path");
const { uploadRoot } = require("../middleware/upload");

const BASE = process.env.PUBLIC_API_BASE || "http://localhost:5050";
const W = 1920;
const H = 1080;

let createCanvas;
try {
  ({ createCanvas } = require("@napi-rs/canvas"));
} catch {
  createCanvas = null;
}

function ensureDir() {
  if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });
}

function save(buffer, slug) {
  ensureDir();
  const name = `${Date.now()}-${String(slug || "js")
    .replace(/[^a-z0-9]+/gi, "-")
    .slice(0, 40)
    .toLowerCase()}-fhd.png`;
  fs.writeFileSync(path.join(uploadRoot, name), buffer);
  return `${BASE}/uploads/${name}`;
}

function rr(ctx, x, y, w, h, r) {
  const R = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + R, y);
  ctx.arcTo(x + w, y, x + w, y + h, R);
  ctx.arcTo(x + w, y + h, x, y + h, R);
  ctx.arcTo(x, y + h, x, y, R);
  ctx.arcTo(x, y, x + w, y, R);
  ctx.closePath();
}

function wrap(ctx, text, maxW) {
  const words = String(text || "")
    .split(/\s+/)
    .filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(t).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

function bg(ctx) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#dbe3ee";
  ctx.lineWidth = 3;
  rr(ctx, 4, 4, W - 8, H - 8, 18);
  ctx.stroke();
}

function titleBar(ctx, title) {
  ctx.fillStyle = "#0b1f3a";
  ctx.font = "700 56px Segoe UI, Arial, sans-serif";
  const t = String(title || "JavaScript");
  let size = 56;
  while (size > 40 && ctx.measureText(t).width > W - 100) {
    size -= 2;
    ctx.font = `700 ${size}px Segoe UI, Arial, sans-serif`;
  }
  ctx.fillText(t, 56, 70 + size * 0.15);
  ctx.fillStyle = "#f7df1e";
  rr(ctx, 56, 70 + size + 10, 160, 10, 5);
  ctx.fill();
  return 70 + size + 40;
}

function footer(ctx, text) {
  if (!text) return;
  ctx.fillStyle = "#64748b";
  ctx.font = "600 26px Segoe UI, Arial, sans-serif";
  const line = wrap(ctx, text, W - 120)[0];
  ctx.fillText(line, 56, H - 36);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 18px Segoe UI, Arial, sans-serif";
  ctx.fillText("1920×1080", W - 160, H - 34);
}

function arrowRight(ctx, x1, y, x2) {
  ctx.strokeStyle = "#2563eb";
  ctx.fillStyle = "#2563eb";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2 - 18, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y);
  ctx.lineTo(x2 - 22, y - 14);
  ctx.lineTo(x2 - 22, y + 14);
  ctx.closePath();
  ctx.fill();
}

function arrowDown(ctx, x, y1, y2) {
  ctx.strokeStyle = "#2563eb";
  ctx.fillStyle = "#2563eb";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x, y1);
  ctx.lineTo(x, y2 - 18);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y2);
  ctx.lineTo(x - 14, y2 - 22);
  ctx.lineTo(x + 14, y2 - 22);
  ctx.closePath();
  ctx.fill();
}

/** Horizontal numbered pipeline */
function drawSteps(ctx, contentTop, steps) {
  const n = Math.min(steps.length, 5);
  const gap = 28;
  const m = 56;
  const boxW = (W - m * 2 - gap * (n - 1)) / n;
  const boxH = 420;
  const y = contentTop + 40;
  const colors = ["#2563eb", "#0d9488", "#ea580c", "#7c3aed", "#db2777"];

  for (let i = 0; i < n; i++) {
    const x = m + i * (boxW + gap);
    const c = colors[i % colors.length];
    ctx.fillStyle = "#f8fafc";
    rr(ctx, x, y, boxW, boxH, 24);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 3;
    rr(ctx, x, y, boxW, boxH, 24);
    ctx.stroke();

    // big number circle
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x + boxW / 2, y + 70, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "700 42px Segoe UI, Arial, sans-serif";
    const num = String(i + 1);
    const nw = ctx.measureText(num).width;
    ctx.fillText(num, x + boxW / 2 - nw / 2, y + 84);

    ctx.fillStyle = "#0b1f3a";
    ctx.font = "700 32px Segoe UI, Arial, sans-serif";
    const head = wrap(ctx, steps[i].h || `Step ${i + 1}`, boxW - 40);
    let ty = y + 160;
    head.forEach((ln) => {
      ctx.fillText(ln, x + 24, ty);
      ty += 40;
    });

    ctx.fillStyle = "#334155";
    ctx.font = "600 26px Segoe UI, Arial, sans-serif";
    (steps[i].lines || []).slice(0, 5).forEach((raw) => {
      wrap(ctx, raw, boxW - 48).forEach((ln) => {
        if (ty > y + boxH - 36) return;
        ctx.fillText(ln, x + 24, ty);
        ty += 34;
      });
      ty += 8;
    });

    if (i < n - 1) {
      arrowRight(ctx, x + boxW + 2, y + boxH / 2, x + boxW + gap - 2);
    }
  }
}

/** Circular process (event loop style) */
function drawCycle(ctx, contentTop, items) {
  const cx = W / 2;
  const cy = contentTop + (H - contentTop - 80) / 2;
  const R = 280;
  const n = Math.min(items.length, 6);
  const colors = ["#2563eb", "#0d9488", "#ea580c", "#7c3aed", "#db2777", "#0891b2"];

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#fefce8";
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f7df1e";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#0b1f3a";
  ctx.font = "700 28px Segoe UI, Arial, sans-serif";
  const mid = wrap(ctx, "JS engine", 180);
  mid.forEach((ln, i) => {
    const tw = ctx.measureText(ln).width;
    ctx.fillText(ln, cx - tw / 2, cy - 10 + i * 32);
  });

  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R;
    const c = colors[i % colors.length];
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, 72, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "700 22px Segoe UI, Arial, sans-serif";
    const label = String(items[i].h || items[i] || "").slice(0, 14);
    const lines = wrap(ctx, label, 120);
    lines.forEach((ln, li) => {
      const tw = ctx.measureText(ln).width;
      ctx.fillText(ln, x - tw / 2, y - (lines.length - 1) * 12 + li * 26);
    });

    // radial caption box
    const out = 1.42;
    const bx = cx + Math.cos(a) * R * out;
    const by = cy + Math.sin(a) * R * out;
    const cardW = 260;
    const cardH = 100;
    ctx.fillStyle = "#f8fafc";
    rr(ctx, bx - cardW / 2, by - cardH / 2, cardW, cardH, 14);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    rr(ctx, bx - cardW / 2, by - cardH / 2, cardW, cardH, 14);
    ctx.stroke();
    ctx.fillStyle = "#334155";
    ctx.font = "600 20px Segoe UI, Arial, sans-serif";
    const body = String((items[i].lines && items[i].lines[0]) || items[i].h || "").slice(0, 48);
    wrap(ctx, body, cardW - 24)
      .slice(0, 3)
      .forEach((ln, li) => {
        ctx.fillText(ln, bx - cardW / 2 + 14, by - 20 + li * 26);
      });
  }
}

/** Stacked layers (scope chain / call stack) */
function drawLayers(ctx, contentTop, layers) {
  const m = 120;
  const list = layers.slice(0, 5);
  const gap = 22;
  const totalH = H - contentTop - 100;
  const layerH = (totalH - gap * (list.length - 1)) / list.length;
  const colors = ["#dbeafe", "#ccfbf1", "#ffedd5", "#f3e8ff", "#fce7f3"];
  const borders = ["#2563eb", "#0d9488", "#ea580c", "#7c3aed", "#db2777"];

  list.forEach((L, i) => {
    const y = contentTop + 20 + i * (layerH + gap);
    ctx.fillStyle = colors[i % colors.length];
    rr(ctx, m, y, W - m * 2, layerH, 20);
    ctx.fill();
    ctx.strokeStyle = borders[i % borders.length];
    ctx.lineWidth = 5;
    rr(ctx, m, y, W - m * 2, layerH, 20);
    ctx.stroke();

    ctx.fillStyle = borders[i % borders.length];
    ctx.font = "700 36px Segoe UI, Arial, sans-serif";
    ctx.fillText(L.h || `Layer ${i + 1}`, m + 36, y + 50);

    ctx.fillStyle = "#0f172a";
    ctx.font = "600 28px Segoe UI, Arial, sans-serif";
    let tx = m + 36;
    let ty = y + 100;
    (L.lines || []).slice(0, 4).forEach((raw) => {
      wrap(ctx, "• " + raw, W - m * 2 - 80).forEach((ln) => {
        if (ty > y + layerH - 24) return;
        ctx.fillText(ln, tx, ty);
        ty += 36;
      });
    });
  });
}

/** Code board with side notes */
function drawCode(ctx, contentTop, spec) {
  const codeX = 56;
  const codeY = contentTop + 20;
  const codeW = 1100;
  const codeH = H - contentTop - 100;
  const noteX = codeX + codeW + 36;
  const noteW = W - noteX - 56;

  // window chrome
  ctx.fillStyle = "#0f172a";
  rr(ctx, codeX, codeY, codeW, codeH, 18);
  ctx.fill();
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(codeX + 28, codeY + 28, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(codeX + 56, codeY + 28, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.arc(codeX + 84, codeY + 28, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 22px Consolas, monospace";
  ctx.fillText(spec.file || "script.js", codeX + 120, codeY + 36);

  const lines = (spec.code || []).slice(0, 14);
  ctx.font = "600 28px Consolas, 'Courier New', monospace";
  let ly = codeY + 90;
  lines.forEach((ln, i) => {
    ctx.fillStyle = "#475569";
    ctx.fillText(String(i + 1).padStart(2, " "), codeX + 24, ly);
    ctx.fillStyle = "#e2e8f0";
    const row = String(ln).slice(0, 52);
    ctx.fillText(row, codeX + 80, ly);
    ly += 42;
  });

  // notes
  const notes = (spec.notes || []).slice(0, 5);
  notes.forEach((n, i) => {
    const ny = codeY + i * 140;
    ctx.fillStyle = i % 2 === 0 ? "#eff6ff" : "#ecfdf5";
    rr(ctx, noteX, ny, noteW, 120, 16);
    ctx.fill();
    ctx.strokeStyle = i % 2 === 0 ? "#2563eb" : "#0d9488";
    ctx.lineWidth = 4;
    rr(ctx, noteX, ny, noteW, 120, 16);
    ctx.stroke();
    ctx.fillStyle = "#0b1f3a";
    ctx.font = "700 28px Segoe UI, Arial, sans-serif";
    ctx.fillText(n.h || `Note ${i + 1}`, noteX + 24, ny + 40);
    ctx.fillStyle = "#334155";
    ctx.font = "600 24px Segoe UI, Arial, sans-serif";
    wrap(ctx, n.text || "", noteW - 48)
      .slice(0, 2)
      .forEach((ln, li) => {
        ctx.fillText(ln, noteX + 24, ny + 78 + li * 30);
      });
  });
}

/** Vertical timeline */
function drawTimeline(ctx, contentTop, events) {
  const xLine = 220;
  const top = contentTop + 30;
  const bottom = H - 90;
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(xLine, top);
  ctx.lineTo(xLine, bottom);
  ctx.stroke();

  const list = events.slice(0, 5);
  const step = (bottom - top) / Math.max(list.length - 1, 1);

  list.forEach((ev, i) => {
    const y = top + i * step;
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(xLine, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "700 20px Segoe UI, Arial, sans-serif";
    const n = String(i + 1);
    ctx.fillText(n, xLine - ctx.measureText(n).width / 2, y + 7);

    const cardX = xLine + 60;
    const cardW = W - cardX - 70;
    ctx.fillStyle = "#f8fafc";
    rr(ctx, cardX, y - 70, cardW, 130, 18);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 3;
    rr(ctx, cardX, y - 70, cardW, 130, 18);
    ctx.stroke();

    ctx.fillStyle = "#0b1f3a";
    ctx.font = "700 32px Segoe UI, Arial, sans-serif";
    ctx.fillText(ev.h || `Stage ${i + 1}`, cardX + 28, y - 25);
    ctx.fillStyle = "#334155";
    ctx.font = "600 26px Segoe UI, Arial, sans-serif";
    wrap(ctx, (ev.lines && ev.lines[0]) || "", cardW - 56)
      .slice(0, 2)
      .forEach((ln, li) => {
        ctx.fillText(ln, cardX + 28, y + 20 + li * 32);
      });
  });
}

/** Central hub with radiating nodes */
function drawHub(ctx, contentTop, hub, nodes) {
  const cx = W / 2;
  const cy = contentTop + (H - contentTop - 70) / 2 + 20;
  const list = nodes.slice(0, 6);

  ctx.fillStyle = "#f7df1e";
  ctx.beginPath();
  ctx.arc(cx, cy, 130, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#0b1f3a";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 130, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#0b1f3a";
  ctx.font = "700 30px Segoe UI, Arial, sans-serif";
  wrap(ctx, hub || "JavaScript", 200).forEach((ln, i) => {
    const tw = ctx.measureText(ln).width;
    ctx.fillText(ln, cx - tw / 2, cy - 10 + i * 34);
  });

  const colors = ["#2563eb", "#0d9488", "#ea580c", "#7c3aed", "#db2777", "#0891b2"];
  list.forEach((node, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / list.length;
    const nx = cx + Math.cos(a) * 380;
    const ny = cy + Math.sin(a) * 300;
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 130, cy + Math.sin(a) * 130);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    const bw = 280;
    const bh = 120;
    ctx.fillStyle = "#ffffff";
    rr(ctx, nx - bw / 2, ny - bh / 2, bw, bh, 16);
    ctx.fill();
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = 4;
    rr(ctx, nx - bw / 2, ny - bh / 2, bw, bh, 16);
    ctx.stroke();
    ctx.fillStyle = "#0b1f3a";
    ctx.font = "700 26px Segoe UI, Arial, sans-serif";
    const tw = ctx.measureText(node.h || "").width;
    ctx.fillText(node.h || "", nx - tw / 2, ny - 10);
    ctx.fillStyle = "#475569";
    ctx.font = "600 20px Segoe UI, Arial, sans-serif";
    const sub = (node.lines && node.lines[0]) || "";
    wrap(ctx, sub, bw - 30)
      .slice(0, 2)
      .forEach((ln, li) => {
        const lw = ctx.measureText(ln).width;
        ctx.fillText(ln, nx - lw / 2, ny + 24 + li * 24);
      });
  });
}

/** Two fat visual cards with big icons (not tiny 3-lines) */
function drawCompare(ctx, contentTop, left, right) {
  const gap = 48;
  const m = 60;
  const cardW = (W - m * 2 - gap) / 2;
  const cardH = H - contentTop - 110;
  const y = contentTop + 20;
  const sides = [
    { data: left, color: "#2563eb", x: m },
    { data: right, color: "#0d9488", x: m + cardW + gap },
  ];

  sides.forEach(({ data, color, x }) => {
    ctx.fillStyle = "#f8fafc";
    rr(ctx, x, y, cardW, cardH, 28);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    rr(ctx, x, y, cardW, cardH, 28);
    ctx.stroke();

    // header band
    ctx.fillStyle = color;
    rr(ctx, x, y, cardW, 110, 28);
    ctx.fill();
    ctx.fillRect(x, y + 70, cardW, 40);
    ctx.fillStyle = "#fff";
    ctx.font = "700 40px Segoe UI, Arial, sans-serif";
    ctx.fillText(data.h || "", x + 36, y + 68);

    // big visual rows
    let ty = y + 150;
    (data.lines || []).slice(0, 6).forEach((raw, idx) => {
      const rowH = 90;
      ctx.fillStyle = idx % 2 === 0 ? "#ffffff" : "#f1f5f9";
      rr(ctx, x + 28, ty, cardW - 56, rowH - 12, 16);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + 70, ty + 38, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.font = "600 30px Segoe UI, Arial, sans-serif";
      wrap(ctx, raw, cardW - 160)
        .slice(0, 2)
        .forEach((ln, li) => {
          ctx.fillText(ln, x + 110, ty + 32 + li * 34);
        });
      ty += rowH;
    });
  });
}

/**
 * @param {{
 *  title: string,
 *  kind: 'steps'|'cycle'|'layers'|'code'|'timeline'|'hub'|'compare',
 *  footer?: string,
 *  steps?: any[],
 *  items?: any[],
 *  layers?: any[],
 *  code?: object,
 *  events?: any[],
 *  hub?: string,
 *  nodes?: any[],
 *  left?: object,
 *  right?: object,
 * }} visual
 */
function renderJsVisual(visual) {
  if (!createCanvas) return null;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  bg(ctx);
  const top = titleBar(ctx, visual.title);
  const kind = visual.kind || "steps";

  if (kind === "steps") drawSteps(ctx, top, visual.steps || visual.items || []);
  else if (kind === "cycle") drawCycle(ctx, top, visual.items || visual.steps || []);
  else if (kind === "layers") drawLayers(ctx, top, visual.layers || visual.items || []);
  else if (kind === "code") drawCode(ctx, top, visual.code || {});
  else if (kind === "timeline") drawTimeline(ctx, top, visual.events || visual.items || []);
  else if (kind === "hub") drawHub(ctx, top, visual.hub, visual.nodes || []);
  else if (kind === "compare")
    drawCompare(ctx, top, visual.left || {}, visual.right || {});
  else drawSteps(ctx, top, visual.steps || []);

  footer(ctx, visual.footer || "");
  return save(canvas.toBuffer("image/png"), visual.title);
}

module.exports = { renderJsVisual, W, H };
