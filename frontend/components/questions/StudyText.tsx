import type { ReactNode } from "react";

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; text: string };

function renderInline(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function isBulletLine(line: string) {
  return /^\s*[-*•]\s+\S/.test(line);
}

function isNumberedLine(line: string) {
  return /^\s*\d+[.)]\s+\S/.test(line);
}

function stripBullet(line: string) {
  return line.replace(/^\s*[-*•]\s+/, "").trim();
}

function stripNumber(line: string) {
  return line.replace(/^\s*\d+[.)]\s+/, "").trim();
}

function parseChunk(chunk: string): Block[] {
  const lines = chunk.split("\n").map((line) => line.trimEnd());
  const nonempty = lines.filter((line) => line.trim());
  if (nonempty.length === 0) return [];

  if (nonempty.every(isBulletLine)) {
    return [{ type: "ul", items: nonempty.map(stripBullet) }];
  }
  if (nonempty.every(isNumberedLine)) {
    return [{ type: "ol", items: nonempty.map(stripNumber) }];
  }

  if (nonempty.length > 1 && nonempty.every((line) => isBulletLine(line) || isNumberedLine(line))) {
    const items = nonempty.map((line) =>
      isBulletLine(line) ? stripBullet(line) : stripNumber(line),
    );
    return [{ type: nonempty[0] && isNumberedLine(nonempty[0]) ? "ol" : "ul", items }];
  }

  if (lines.some((line) => line.trim())) {
    const paragraphs = chunk
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (paragraphs.length > 1) {
      return paragraphs.map((text) => ({ type: "p" as const, text }));
    }
  }

  return [{ type: "p", text: chunk.replace(/\s+\n/g, " ").replace(/\n+/g, " ").trim() }];
}

export function parseStudyText(raw: string): Block[] {
  const text = String(raw || "").replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  const blocks: Block[] = [];
  const fenced = text.split(/(```[\s\S]*?```)/g);

  for (const piece of fenced) {
    if (!piece) continue;
    if (piece.startsWith("```") && piece.endsWith("```")) {
      const inner = piece.replace(/^```[a-zA-Z0-9_-]*\n?/, "").replace(/```$/, "").trimEnd();
      blocks.push({ type: "code", text: inner });
      continue;
    }

    const chunks = piece.split(/\n{2,}/);
    for (const chunk of chunks) {
      blocks.push(...parseChunk(chunk.trim()));
    }
  }

  return blocks;
}

export function StudyText({
  text,
  muted = false,
}: {
  text: string;
  muted?: boolean;
}) {
  const blocks = parseStudyText(text);
  if (blocks.length === 0) {
    return <p className="study-prose text-muted">—</p>;
  }

  return (
    <div className={`study-prose ${muted ? "is-muted" : ""}`}>
      {blocks.map((block, i) => {
        if (block.type === "ul") {
          return (
            <ul key={i}>
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={i}>
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }
        if (block.type === "code") {
          return (
            <pre key={i}>
              <code>{block.text}</code>
            </pre>
          );
        }
        return <p key={i}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
