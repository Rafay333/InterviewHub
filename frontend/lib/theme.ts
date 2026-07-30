/** Shared brand accents used across home, languages, and cards */
export const accentPalettes = [
  {
    icon: "bg-[#2563eb] text-white",
    ring: "hover:border-[#2563eb]/40",
    glow: "from-[#dbeafe] to-white",
    soft: "bg-[#dbeafe] text-[#1d4ed8]",
  },
  {
    icon: "bg-[#0d9488] text-white",
    ring: "hover:border-[#0d9488]/40",
    glow: "from-[#ccfbf1] to-white",
    soft: "bg-[#ccfbf1] text-[#0f766e]",
  },
  {
    icon: "bg-[#ea580c] text-white",
    ring: "hover:border-[#ea580c]/40",
    glow: "from-[#ffedd5] to-white",
    soft: "bg-[#ffedd5] text-[#c2410c]",
  },
  {
    icon: "bg-[#0f766e] text-white",
    ring: "hover:border-[#0f766e]/40",
    glow: "from-[#ccfbf1] to-white",
    soft: "bg-[#99f6e4] text-[#115e59]",
  },
  {
    icon: "bg-[#db2777] text-white",
    ring: "hover:border-[#db2777]/40",
    glow: "from-[#fce7f3] to-white",
    soft: "bg-[#fce7f3] text-[#be185d]",
  },
  {
    icon: "bg-[#0369a1] text-white",
    ring: "hover:border-[#0369a1]/40",
    glow: "from-[#e0f2fe] to-white",
    soft: "bg-[#e0f2fe] text-[#0369a1]",
  },
] as const;

export function getAccent(index: number) {
  return accentPalettes[index % accentPalettes.length];
}

/** Page hero wash — blue + orange (logo colors) */
export const heroWashClass =
  "bg-[radial-gradient(ellipse_at_top_left,_#bfdbfe_0%,_transparent_50%),radial-gradient(ellipse_at_top_right,_#fed7aa_0%,_transparent_45%),linear-gradient(180deg,_#eff6ff_0%,_#f8fafc_100%)]";
