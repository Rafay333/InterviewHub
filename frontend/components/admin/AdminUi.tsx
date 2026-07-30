import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function AdminPageHeader({ title, description, actions }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminPrimaryButton({
  href,
  children,
  onClick,
  type = "button",
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const className =
    "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary-dark";
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function AdminSecondaryButton({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const className =
    "inline-flex items-center justify-center rounded-lg border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:border-accent/40 hover:bg-[#fff7ed]";
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: "draft" | "published" }) {
  const published = status === "published";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function DifficultyBadge({
  difficulty,
}: {
  difficulty: "beginner" | "intermediate" | "expert";
}) {
  const map = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-[#ffedd5] text-[#c2410c]",
    expert: "bg-red-100 text-red-800",
  } as const;
  const label = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    expert: "Expert",
  } as const;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[difficulty]}`}>
      {label[difficulty]}
    </span>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-primary/10 bg-white/90 p-4 shadow-sm shadow-primary/5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-primary/25 bg-white/80 px-6 py-16 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
