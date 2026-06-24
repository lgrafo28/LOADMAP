import { TechnologyRecommendation } from "@/types/loadmap";

type TechnologyMatchListProps = {
  technologies: TechnologyRecommendation[];
};

export function TechnologyMatchList({ technologies }: TechnologyMatchListProps) {
  return (
    <div className="rounded-[26px] border border-white/[0.08] bg-surface-panel/60 p-5">
      <div className="space-y-1">
        <p className="tech-label text-[11px] text-brand-300">Technologie-Match</p>
        <p className="text-sm text-ink-muted">
          Diese Technologien passen zum erkannten Belastungsmuster und den identifizierten Treibern.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {technologies.map((technology) => (
          <div key={technology.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-ink">{technology.label}</p>
              <span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-ink-muted ring-1 ring-white/[0.08]">
                {technology.category}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{technology.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
