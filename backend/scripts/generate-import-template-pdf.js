/**
 * Generates a clear PDF template showing Q / Answer / Explanation layout.
 * Run: node scripts/generate-import-template-pdf.js
 */
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const outDir = path.resolve(__dirname, "../../frontend/public/templates");
const outPath = path.join(outDir, "interviewhub-questions-template.pdf");

fs.mkdirSync(outDir, { recursive: true });

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 48, bottom: 48, left: 52, right: 52 },
  info: {
    Title: "InterviewHub Questions Import Template",
    Author: "InterviewHub",
  },
});

const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

function heading(text, options = {}) {
  doc
    .fillColor(options.color || "#0f172a")
    .font("Helvetica-Bold")
    .fontSize(options.size || 18)
    .text(text, { align: options.align || "left" });
  doc.moveDown(options.down || 0.4);
}

function body(text, options = {}) {
  doc
    .fillColor(options.color || "#334155")
    .font(options.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(options.size || 11)
    .text(text, { align: options.align || "left", lineGap: 2 });
  doc.moveDown(options.down || 0.35);
}

function labelValue(label, value, labelColor) {
  doc.font("Helvetica-Bold").fontSize(11).fillColor(labelColor).text(label, {
    continued: true,
  });
  doc.font("Helvetica").fillColor("#1e293b").text(` ${value}`);
  doc.moveDown(0.25);
}

// Title bar
doc.rect(0, 0, doc.page.width, 72).fill("#2563eb");
doc
  .fillColor("#ffffff")
  .font("Helvetica-Bold")
  .fontSize(20)
  .text("InterviewHub", 52, 22);
doc
  .font("Helvetica")
  .fontSize(11)
  .fillColor("#dbeafe")
  .text("Questions PDF Import Template", 52, 46);

doc.moveDown(3.2);

heading("How to write questions in your PDF", { size: 14, color: "#ea580c" });
body(
  "Use this exact structure for every question. Keep labels bold if you want, but the words Answer: and Explanation: must appear as shown so import can read them.",
  { size: 10.5, down: 0.5 },
);

const rules = [
  "Start each item with Q1. or Question 1: then the question text.",
  "Next line starts with Answer: then the short answer.",
  "Next line starts with Explanation: then more detail.",
  "Leave one blank line before the next question.",
  "Save / Export the document as PDF, then upload in Admin → Import.",
];
rules.forEach((r, i) => {
  body(`${i + 1}. ${r}`, { size: 10.5, down: 0.2 });
});

doc.moveDown(0.6);
heading("Example page (copy this style)", { size: 14, color: "#2563eb" });

doc
  .fillColor("#2563eb")
  .font("Helvetica-Bold")
  .fontSize(16)
  .text("React Interview Questions", { align: "center" });
doc
  .fillColor("#3b82f6")
  .font("Helvetica")
  .fontSize(12)
  .text("Beginner Level (Q1–Q15)", { align: "center" });
doc.moveDown(0.8);

const samples = [
  {
    q: "Q1. What is React?",
    a: "React is a JavaScript library for building UIs with reusable components using JSX syntax.",
    e: "React creates interactive interfaces by breaking them into small, independent components and updating them efficiently.",
  },
  {
    q: "Q2. What are Components in React?",
    a: "Components are JavaScript functions or classes that accept props and return elements describing what to display.",
    e: "Like LEGO blocks, you build small self-contained pieces and combine them into complex user interfaces.",
  },
  {
    q: "Q3. What is JSX?",
    a: "JSX is a syntax that lets you write HTML-like code inside JavaScript. It is compiled to React.createElement() calls.",
    e: "JSX makes UI code more readable. Babel converts it so the browser can run the result.",
  },
  {
    q: "Question 4: What is the difference between state and props?",
    a: "Props are read-only data passed from parent to child. State is mutable data managed inside a component.",
    e: "Use props to configure a component. Use state when the data changes over time with user interaction.",
  },
];

samples.forEach((item) => {
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#0f172a").text(item.q);
  doc.moveDown(0.2);
  labelValue("Answer:", item.a, "#16a34a");
  labelValue("Explanation:", item.e, "#ea580c");
  doc.moveDown(0.45);
});

doc.moveDown(0.4);
doc
  .roundedRect(doc.x, doc.y, doc.page.width - 104, 58, 8)
  .fillAndStroke("#eff6ff", "#2563eb");
const boxY = doc.y + 12;
doc
  .fillColor("#1d4ed8")
  .font("Helvetica-Bold")
  .fontSize(10)
  .text("Tip for Word / Google Docs", 62, boxY);
doc
  .fillColor("#334155")
  .font("Helvetica")
  .fontSize(9.5)
  .text(
    "Type questions like the sample above → File → Save as PDF / Download as PDF → upload on the Import page. You can also Preview parse before Import.",
    62,
    boxY + 16,
    { width: doc.page.width - 124 },
  );

doc.end();

stream.on("finish", () => {
  console.log("Wrote", outPath);
});
