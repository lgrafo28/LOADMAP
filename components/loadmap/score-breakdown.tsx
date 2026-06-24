import { ScoreContribution } from "@/types/loadmap";

import { formatPoints } from "./utils";

type ScoreBreakdownProps = {
  contributions: ScoreContribution[];
  title?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ScoreBreakdown({
  contributions,
  title = "Score-Beiträge",
  emptyTitle = "Noch keine Score-Beiträge sichtbar",
  emptyDescription = "Sobald Antworten gewählt werden, zeigt die LoadMap hier nachvollziehbar, welche Faktoren die Risikostufe treiben.",
}: ScoreBreakdownProps) {
  const sortedContributions = contributions.slice().sort((left, right) => right.points - left.points);

  return (
    <div className="rounded-[26px] border border-white/[0.08] bg-surface-panel/60 p-5">
      <div className="space-y-1">
        <p className="tech-label text-[11px] text-brand-300">{title}</p>
        <p className="text-sm text-ink-muted">
          Jede relevante Antwort wird als erklärbarer Beitrag in die Risikostufe übernommen.
        </p>
      </div>

      {sortedContributions.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-sm font-semibold text-ink">{emptyTitle}</p>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{emptyDescription}</p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {sortedContributions.map((entry) => (
            <li key={entry.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{entry.label}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">{entry.reason}</p>
                </div>
                <span className="rounded-full bg-brand-500/[0.1] px-3 py-1 text-sm font-semibold text-brand-300 ring-1 ring-brand-300/25">
                  {formatPoints(entry.points)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
