import Link from "next/link";

/** Shared form control styles — use across all admin forms & filters */
export const adminInputClass =
  "w-full rounded-xl border border-primary/15 bg-white px-3 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

export const adminSelectClass =
  "w-full rounded-xl border border-primary/15 bg-white px-3 py-2.5 text-sm text-ink shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export const adminLabelClass = "mb-1.5 block text-sm font-semibold text-navy";

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: string;
};

export function AdminPageHeader({
  title,
  description,
  actions,
  eyebrow = "InterviewHub Admin",
}: Props) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-white to-accent/10 shadow-sm shadow-primary/5">
      <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="h-1 bg-gradient-to-r from-primary via-teal to-accent" />
    </div>
  );
}

export function AdminPrimaryButton({
  href,
  children,
  onClick,
  type = "button",
  disabled,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const className =
    "inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60";
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}

export function AdminSecondaryButton({
  href,
  children,
  onClick,
  disabled,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const className =
    "inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-sm font-semibold text-navy shadow-sm transition hover:border-accent/40 hover:bg-[#fff7ed] disabled:cursor-not-allowed disabled:opacity-60";
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}

export function AdminAccentButton({
  href,
  children,
  onClick,
  type = "button",
  disabled,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const className =
    "inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60";
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: "draft" | "published" }) {
  const published = status === "published";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        published
          ? "bg-easy/15 text-easy ring-1 ring-easy/20"
          : "bg-medium/15 text-medium ring-1 ring-medium/20"
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
    beginner: "bg-easy/15 text-easy ring-1 ring-easy/20",
    intermediate: "bg-medium/15 text-medium ring-1 ring-medium/20",
    expert: "bg-hard/15 text-hard ring-1 ring-hard/20",
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
      className={`rounded-2xl border border-primary/12 bg-white/95 p-4 shadow-sm shadow-primary/5 backdrop-blur-sm sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

const statTones = [
  "from-primary/20 via-white to-white border-primary/25",
  "from-accent/20 via-white to-white border-accent/25",
  "from-teal/20 via-white to-white border-teal/25",
  "from-easy/20 via-white to-white border-easy/25",
  "from-medium/20 via-white to-white border-medium/25",
  "from-hard/15 via-white to-white border-hard/20",
] as const;

export function AdminStatCard({
  label,
  value,
  hint,
  href,
  tone = 0,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  tone?: number;
}) {
  const toneClass = statTones[tone % statTones.length];
  const inner = (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${toneClass}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-navy">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/12 bg-white shadow-sm shadow-primary/5">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-primary/10 bg-gradient-to-r from-surface-tint via-white to-[#fff7ed] text-xs uppercase tracking-wide text-muted">
      {children}
    </thead>
  );
}

export function AdminTh({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3.5 font-semibold text-navy/70 ${className}`}>{children}</th>;
}

export function AdminTd({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3.5 ${className}`}>{children}</td>;
}

export function AdminTr({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-primary/8 transition last:border-0 hover:bg-primary/[0.03]">
      {children}
    </tr>
  );
}

export function AdminFilters({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-2xl border border-primary/12 bg-gradient-to-r from-white via-surface-tint/40 to-[#fff7ed]/40 p-3 shadow-sm sm:p-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
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
    <div className="rounded-2xl border border-dashed border-primary/30 bg-gradient-to-br from-surface-tint/60 via-white to-[#fff7ed]/50 px-6 py-16 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
        +
      </div>
      <h2 className="text-lg font-semibold text-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function AdminSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      {children}
    </h2>
  );
}

export function AdminLink({
  href,
  children,
  tone = "primary",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "primary" | "danger" | "accent";
}) {
  const tones = {
    primary: "font-semibold text-primary hover:text-primary-dark",
    accent: "font-semibold text-accent hover:text-orange-700",
    danger: "font-semibold text-hard hover:text-red-700",
  };
  return (
    <Link href={href} className={tones[tone]}>
      {children}
    </Link>
  );
}
