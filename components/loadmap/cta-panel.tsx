"use client";

import { ArrowRightIcon } from "./icons";

export type CtaAction = {
  label: string;
  description: string;
  /** mailto: or external link */
  href?: string;
  /** triggers the browser print dialog (PDF export MVP) */
  print?: boolean;
  primary?: boolean;
};

type CtaPanelProps = {
  ctas: CtaAction[];
  disclaimer: string;
};

const baseClass =
  "group flex items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2";

const primaryClass = "border-transparent bg-gradient-to-br from-brand-300 to-brand-500 text-surface-0 shadow-mint hover:-translate-y-0.5 hover:shadow-glow";
const secondaryClass =
  "border-white/[0.1] bg-white/[0.03] text-ink hover:-translate-y-0.5 hover:border-brand-300/40 hover:bg-white/[0.06]";

export function CtaPanel({ ctas, disclaimer }: CtaPanelProps) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-surface-0 p-6 text-ink shadow-panel">
      <div className="pointer-events-none absolute inset-0 bg-grid-dark bg-[size:32px_32px] opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-glow-tr" />
      <div className="relative">
        <p className="tech-label text-[11px] text-brand-300">Nächste Schritte</p>
        <p className="mt-2 text-sm text-ink-muted">
          Aus der Analyse wird der nächste konkrete Schritt — direkt anschlussfähig.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {ctas.map((cta) => {
            const className = [baseClass, cta.primary ? primaryClass : secondaryClass].join(" ");
            const inner = (
              <>
                <span className="flex flex-col gap-1">
                  <span>{cta.label}</span>
                  <span
                    className={[
                      "text-xs font-medium",
                      cta.primary ? "text-surface-0/70" : "text-ink-faint",
                    ].join(" ")}
                  >
                    {cta.description}
                  </span>
                </span>
                <ArrowRightIcon className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" />
              </>
            );

            if (cta.print) {
              return (
                <button
                  key={cta.label}
                  type="button"
                  onClick={() => window.print()}
                  className={className}
                >
                  {inner}
                </button>
              );
            }

            return (
              <a
                key={cta.label}
                href={cta.href ?? "#"}
                rel="noopener noreferrer"
                aria-label={`${cta.label}: ${cta.description}`}
                className={className}
              >
                {inner}
              </a>
            );
          })}
        </div>
        <p className="mt-6 text-sm leading-6 text-ink-faint">{disclaimer}</p>
      </div>
    </div>
  );
}
