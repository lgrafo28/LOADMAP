import { LoadPathNode } from "@/types/loadmap";

type DiagnosticPathProps = {
  nodes: LoadPathNode[];
  title?: string;
};

const statusStyles: Record<
  LoadPathNode["status"],
  { dot: string; ring: string; label: string }
> = {
  selected: { dot: "bg-brand-400", ring: "ring-brand-400/40", label: "Auswahl" },
  detected: { dot: "bg-warning", ring: "ring-warning/40", label: "Erkannt" },
  calculated: { dot: "bg-danger", ring: "ring-danger/40", label: "Berechnet" },
  recommended: { dot: "bg-success", ring: "ring-success/40", label: "Empfohlen" },
};

export function DiagnosticPath({ nodes, title = "Belastungspfad" }: DiagnosticPathProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 p-5 text-white shadow-panel">
      <div className="absolute inset-0 bg-grid-dark bg-[size:28px_28px] opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-scanlines opacity-30" />
      <div className="relative space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-300">{title}</p>
        <p className="text-sm text-slate-400">
          So entsteht aus Auswahl, Treibern und Risiko die finale Empfehlung.
        </p>
      </div>

      <ol className="relative mt-5 space-y-3 reveal-stagger">
        {nodes.map((node, index) => {
          const style = statusStyles[node.status];
          const isLast = index === nodes.length - 1;

          return (
            <li key={`${node.stage}-${index}`} className="flex gap-4">
              <div className="relative flex flex-col items-center">
                <span
                  className={[
                    "relative flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white ring-2",
                    style.ring,
                  ].join(" ")}
                >
                  <span className={["h-2.5 w-2.5 rounded-full", style.dot].join(" ")} />
                  {!isLast ? (
                    <span className={["absolute -bottom-3 h-3 w-2.5 rounded-full opacity-40", style.dot].join(" ")} />
                  ) : null}
                </span>
                {!isLast ? (
                  <span className="mt-1 w-px flex-1 bg-gradient-to-b from-brand-400/60 to-white/5" />
                ) : null}
              </div>
              <div className="space-y-1 pb-2 pt-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{node.title}</p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                    {style.label}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-300">{node.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
