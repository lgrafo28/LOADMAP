import { RegionId, Severity } from "@/types/loadmap";

import { regionLabels, severityHex } from "./utils";

export type RadarRegion = {
  regionId: RegionId;
  severity: Severity;
};

type LoadRadarProps = {
  /** Regions to plot. Empty array renders an honest empty state (no fake hits). */
  regions?: RadarRegion[];
};

/** Fixed angle per region so the plot is stable across renders (0 = up, clockwise). */
const regionAngle: Record<RegionId, number> = {
  neck: 0,
  shoulders: 60,
  back: 300,
  wrists: 120,
  knees: 240,
  legsFeet: 180,
};

/** Higher severity sits further out on the radar. */
const severityRadius: Record<Severity, number> = {
  red: 0.84,
  yellow: 0.58,
  green: 0.34,
};

const polar = (angle: number, radius: number, scale = 80) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: 100 + Math.cos(rad) * radius * scale,
    y: 100 + Math.sin(rad) * radius * scale,
  };
};

export function LoadRadar({ regions = [] }: LoadRadarProps) {
  const hasData = regions.length > 0;

  return (
    <div className="relative">
      <svg
        viewBox="0 0 200 200"
        className="w-full"
        role="img"
        aria-label={
          hasData
            ? `Load Radar mit ${regions.length} erfassten Belastungspunkten`
            : "Load Radar, noch keine Region erfasst"
        }
      >
        <defs>
          <radialGradient id="radar-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d3327" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#061e15" stopOpacity="0.95" />
          </radialGradient>
          <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5dcaa5" stopOpacity="0" />
            <stop offset="100%" stopColor="#5dcaa5" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r="88" fill="url(#radar-bg)" stroke="#5dcaa5" strokeOpacity="0.25" />
        {[28, 52, 76].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#5dcaa5" strokeOpacity="0.16" />
        ))}
        <line x1="100" y1="12" x2="100" y2="188" stroke="#5dcaa5" strokeOpacity="0.12" />
        <line x1="12" y1="100" x2="188" y2="100" stroke="#5dcaa5" strokeOpacity="0.12" />

        {/* rotating sweep only runs once there is something to scan */}
        {hasData ? (
          <g className="origin-center animate-radar-sweep" style={{ transformOrigin: "100px 100px" }}>
            <path d="M100 100 L100 14 A86 86 0 0 1 161 39 Z" fill="url(#sweep)" />
          </g>
        ) : null}

        {/* plotted load points from the real assessment state */}
        {regions.map((region) => {
          const angle = regionAngle[region.regionId];
          const radius = severityRadius[region.severity];
          const { x, y } = polar(angle, radius);
          const color = severityHex[region.severity];
          return (
            <g key={region.regionId}>
              <circle
                cx={x}
                cy={y}
                r="9"
                fill={color}
                fillOpacity="0.18"
                className="animate-ping-soft"
                style={{ transformOrigin: `${x}px ${y}px` }}
              />
              <circle cx={x} cy={y} r="4" fill={color} />
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                className="fill-white/80 text-[8px] font-semibold uppercase tracking-[0.1em]"
              >
                {regionLabels[region.regionId]}
              </text>
            </g>
          );
        })}
        <circle cx="100" cy="100" r="3" fill="#5dcaa5" />

        {/* honest empty state */}
        {!hasData ? (
          <text
            x="100"
            y="104"
            textAnchor="middle"
            className="fill-white/45 text-[9px] font-medium uppercase tracking-[0.18em]"
          >
            Bereit
          </text>
        ) : null}
      </svg>
    </div>
  );
}
