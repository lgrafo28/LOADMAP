import { activities } from "@/data/loadmap-data";
import { ActivityId } from "@/types/loadmap";

type ActivityStepProps = {
  activityId: ActivityId | null;
  onSelect: (value: ActivityId) => void;
};

export function ActivityStep({ activityId, onSelect }: ActivityStepProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {activities.map((activity) => {
        const selected = activityId === activity.id;

        return (
          <button
            key={activity.id}
            type="button"
            onClick={() => onSelect(activity.id)}
            aria-pressed={selected}
            className={[
              "group relative flex w-full grow basis-[300px] flex-col overflow-hidden rounded-[26px] border p-5 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-panel sm:max-w-[360px]",
              selected
                ? "border-brand-300/50 bg-brand-500/[0.07] shadow-glow"
                : "border-white/[0.08] bg-white/[0.02] hover:-translate-y-1 hover:border-brand-300/30 hover:bg-white/[0.04]",
            ].join(" ")}
          >
            {selected ? (
              <span className="pointer-events-none absolute inset-0 bg-glow-tr" />
            ) : null}
            <span className="relative">
              <span className="block text-lg font-semibold text-ink">{activity.label}</span>
              <span className="mt-2 block text-sm leading-6 text-ink-muted">{activity.description}</span>
              <span className="mt-4 block text-sm font-medium text-brand-300">{activity.diagnosticLens}</span>
              <ul className="mt-4 space-y-2 text-sm text-ink-faint">
                {activity.typicalDrivers.map((driver) => (
                  <li key={driver} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-400" />
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </span>
          </button>
        );
      })}
    </div>
  );
}
