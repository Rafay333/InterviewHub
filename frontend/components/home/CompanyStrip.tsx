import { companyNames } from "@/lib/home-data";

export function CompanyStrip() {
  return (
    <section className="border-y border-primary/10 bg-gradient-to-r from-primary/5 via-white to-accent/5">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Questions asked across top companies
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {companyNames.map((name, index) => (
            <li
              key={name}
              className={`text-sm font-bold tracking-wide sm:text-base ${
                index % 3 === 0
                  ? "text-primary"
                  : index % 3 === 1
                    ? "text-navy/55"
                    : "text-accent"
              }`}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
