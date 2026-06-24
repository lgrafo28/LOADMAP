import { RecommendationLevel } from "@/types/loadmap";

type RecommendationCardProps = {
  level: RecommendationLevel;
};

export function RecommendationCard({ level }: RecommendationCardProps) {
  return (
    <div className="rounded-[26px] border border-white/[0.08] bg-surface-panel/60 p-5">
      <p className="text-base font-semibold text-ink">{level.title}</p>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-muted">
        {level.items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
