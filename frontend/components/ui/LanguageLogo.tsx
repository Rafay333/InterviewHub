"use client";

import { useState } from "react";
import { resolveLanguageLogo } from "@/lib/language-logo";

type Props = {
  name: string;
  slug: string;
  pictureUrl?: string | null;
  iconFallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
} as const;

const imgSize = {
  sm: "h-6 w-6",
  md: "h-7 w-7",
  lg: "h-9 w-9",
} as const;

export function LanguageLogo({
  name,
  slug,
  pictureUrl,
  iconFallback,
  size = "md",
  className = "",
}: Props) {
  const resolved = resolveLanguageLogo(name, slug, pictureUrl);
  const [failed, setFailed] = useState(false);
  const letters =
    iconFallback ||
    name
      .replace(/interview|questions?/gi, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() ||
    "IH";

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-sm ${sizeClass[size]} ${className}`}
    >
      {resolved && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt=""
          className={`${imgSize[size]} object-contain`}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-xs font-bold text-primary">{letters.slice(0, 2)}</span>
      )}
    </span>
  );
}
