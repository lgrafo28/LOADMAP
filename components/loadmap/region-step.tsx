import { bodyRegions } from "@/data/loadmap-data";
import { RegionId } from "@/types/loadmap";

import { BodyLoadMap } from "./body-load-map";

type RegionStepProps = {
  selectedRegions: RegionId[];
  onToggle: (value: RegionId) => void;
};

export function RegionStep({ selectedRegions, onToggle }: RegionStepProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      {/* Interactive body map */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-surface-0 p-5 text-ink shadow-soft">
        <div className="absolute inset-0 bg-grid-dark bg-[size:30px_30px] opacity-60" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-scanlines opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-glow-tr" />
        <div className="relative">
          <p className="tech-label text-[11px] text-brand-300">Body Load Map</p>
          <p className="mt-2 text-sm text-ink-muted">
            Tippen Sie betroffene Regionen direkt an — Auswahl und Tastatur funktionieren gleichermaßen.
          </p>
          <div className="mx-auto mt-2 max-w-[260px]">
            <BodyLoadMap selectedRegions={selectedRegions} onToggleRegion={onToggle} />
          </div>
          <p className="text-center text-xs text-ink-faint">
            {selectedRegions.length > 0
              ? `${selectedRegions.length} Region${selectedRegions.length > 1 ? "en" : ""} markiert`
              : "Noch keine Region markiert"}
          </p>
        </div>
      </div>

      {/* Region cards (mirror the map, keep full a11y) */}
      <div className="grid gap-4 sm:grid-cols-2">
        {bodyRegions.map((region) => {
          const selected = selectedRegions.includes(region.id);

          return (
            <button
              key={region.id}
              type="button"
              onClick={() => onToggle(region.id)}
              aria-pressed={selected}
              className={[
                "group relative overflow-hidden rounded-[24px] border p-5 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-panel",
                selected
                  ? "border-brand-300/50 bg-brand-500/[0.07] shadow-glow"
                  : "border-white/[0.08] bg-white/[0.02] hover:-translate-y-1 hover:border-brand-300/30 hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <p className="tech-label text-[10px] text-ink-faint">{region.bodyZone}</p>
              <p className="mt-2 text-lg font-semibold text-ink">{region.label}</p>
              <p className="mt-3 text-sm leading-6 text-ink-muted">{region.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
