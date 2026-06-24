import { useMemo } from "react";

import { ArrowRightIcon } from "./icons";
import { LoadRadar, RadarRegion } from "./load-radar";
import { regionLabels, severityLabels, severityStyles } from "./utils";

type HeroProps = {
  onStart: () => void;
  /** Live regions from the real assessment state; empty before any input. */
  radarRegions?: RadarRegion[];
};

const chips = ["Herstellerunabhängig", "Ohne Login", "Praxisnah statt produktgetrieben"];

const flowHighlights = [
  "Tätigkeit wählen",
  "Körperregion markieren",
  "Adaptive Treiber bewerten",
  "Load Passport erhalten",
];

export function Hero({ onStart, radarRegions = [] }: HeroProps) {
  const hasData = radarRegions.length > 0;
  const readout = useMemo(
    () =>
      [...radarRegions].sort((a, b) => {
        const order = { red: 0, yellow: 1, green: 2 } as const;
        return order[a.severity] - order[b.severity];
      }),
    [radarRegions],
  );

  return (
    <section
      data-print-hide
      className="relative overflow-hidden rounded-[40px] border border-white/[0.08] bg-surface-1 px-6 py-10 text-ink shadow-panel md:px-12 md:py-14"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.20),transparent_38%),radial-gradient(circle_at_-10%_30%,rgba(110,168,196,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-grid-dark bg-[size:38px_38px] opacity-[0.5]" />
      <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-7">
          <div className="flex flex-wrap gap-2.5">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-brand-300/25 bg-brand-500/[0.06] px-3.5 py-1.5 text-xs text-brand-300"
              >
                {chip}
              </span>
            ))}
          </div>

          <h1 className="display max-w-[15ch] text-[44px] text-ink md:text-6xl">
            Belastung sichtbar machen.{" "}
            <span className="italic text-brand-300">Entlastung</span> belastbar entscheiden.
          </h1>

          <p className="max-w-[46ch] text-base leading-7 text-ink-muted md:text-lg">
            Erfassen Sie körperliche Belastungen am Arbeitsplatz, visualisieren Sie kritische
            Körperregionen und erhalten Sie einen Load Passport mit Sofortmaßnahmen, Technologie-Match
            und nächstem Beratungsschritt.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 px-7 py-3.5 text-sm font-semibold text-surface-0 shadow-mint transition hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1"
            >
              Belastung analysieren
              <ArrowRightIcon />
            </button>
            <span className="text-sm text-ink-faint">
              Orientierungshilfe für B2B-Teams · ohne externe APIs
            </span>
          </div>

          <ul className="grid gap-2.5 text-sm text-ink-muted sm:grid-cols-2">
            {flowHighlights.map((item, index) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="tech-label text-[10px] text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Analyse-Instrument */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-surface-panel/70 p-5 shadow-soft backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-glow-tr" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-scanlines opacity-25" />
          <div className="relative flex items-center justify-between">
            <p className="tech-label text-[11px] text-brand-300">Load Radar</p>
            <span className="tech-label flex items-center gap-1.5 text-[10px] text-ink-faint">
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  hasData ? "animate-load-pulse bg-brand-400" : "bg-ink-faint/60",
                ].join(" ")}
              />
              {hasData ? "Live-Scan" : "Bereit"}
            </span>
          </div>
          <div className="relative mx-auto mt-3 max-w-[250px]">
            <LoadRadar regions={radarRegions} />
          </div>
          <div className="relative mt-3 grid gap-2">
            {hasData ? (
              readout.map((region) => (
                <div
                  key={region.regionId}
                  className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-ink">{regionLabels[region.regionId]}</span>
                  <span className={["rounded-full px-3 py-1 text-xs font-semibold", severityStyles[region.severity]].join(" ")}>
                    {severityLabels[region.severity]}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] px-4 py-3 text-center text-xs text-ink-muted">
                Noch keine Region erfasst — das Radar füllt sich mit Ihren Eingaben.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
