"use client";

import { KeyboardEvent, useMemo } from "react";

import { RegionId, RegionSeverity, Severity } from "@/types/loadmap";

import { regionLabels, severityHex, severityLabels } from "./utils";

type Hotspot = { cx: number; cy: number; r: number };

/**
 * Hotspot geometry over a stylised front-facing silhouette (viewBox 0 0 240 480).
 * Bilateral regions render two hotspots that toggle the same region id.
 */
const regionHotspots: Record<RegionId, Hotspot[]> = {
  neck: [{ cx: 120, cy: 80, r: 13 }],
  shoulders: [
    { cx: 90, cy: 104, r: 16 },
    { cx: 150, cy: 104, r: 16 },
  ],
  back: [{ cx: 120, cy: 160, r: 28 }],
  wrists: [
    { cx: 66, cy: 224, r: 13 },
    { cx: 174, cy: 224, r: 13 },
  ],
  knees: [
    { cx: 104, cy: 338, r: 15 },
    { cx: 136, cy: 338, r: 15 },
  ],
  legsFeet: [
    { cx: 102, cy: 420, r: 17 },
    { cx: 138, cy: 420, r: 17 },
  ],
};

const regionOrder: RegionId[] = ["neck", "shoulders", "back", "wrists", "knees", "legsFeet"];


type BodyLoadMapProps = {
  selectedRegions?: RegionId[];
  onToggleRegion?: (region: RegionId) => void;
  severities?: RegionSeverity[];
  strongestRegion?: RegionId;
  className?: string;
};

export function BodyLoadMap({
  selectedRegions = [],
  onToggleRegion,
  severities,
  strongestRegion,
  className = "",
}: BodyLoadMapProps) {
  const interactive = typeof onToggleRegion === "function";
  const severityByRegion = useMemo(
    () => new Map<RegionId, Severity>((severities ?? []).map((entry) => [entry.regionId, entry.severity])),
    [severities],
  );

  const handleKey = (event: KeyboardEvent<SVGGElement>, region: RegionId) => {
    if (!interactive) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggleRegion?.(region);
    }
  };

  const colorForRegion = (region: RegionId): string => {
    const severity = severityByRegion.get(region);
    if (severity) {
      return severityHex[severity];
    }
    return severityHex.green;
  };

  return (
    <svg
      viewBox="0 0 240 480"
      role="group"
      aria-label="Körperkarte mit Belastungsregionen"
      className={["h-full w-full select-none", className].join(" ")}
    >
      <defs>
        <linearGradient id="body-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b2218" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0f2c20" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* Silhouette base */}
      <g stroke="#4cc38a" strokeOpacity="0.35" strokeWidth="2" fill="url(#body-fill)">
        <circle cx="120" cy="48" r="26" />
        <rect x="112" y="70" width="16" height="18" rx="6" />
        {/* torso */}
        <path d="M88 96 Q120 84 152 96 L150 150 Q148 196 134 214 L106 214 Q92 196 90 150 Z" />
        {/* left arm */}
        <path
          d="M90 104 Q70 110 64 150 Q60 190 66 222"
          fill="none"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* right arm */}
        <path
          d="M150 104 Q170 110 176 150 Q180 190 174 222"
          fill="none"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* left leg */}
        <path
          d="M110 214 Q104 300 102 420"
          fill="none"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* right leg */}
        <path
          d="M130 214 Q136 300 138 420"
          fill="none"
          strokeWidth="22"
          strokeLinecap="round"
        />
      </g>

      {/* Region hotspots */}
      {regionOrder.map((region) => {
        const hotspots = regionHotspots[region];
        const selected = selectedRegions.includes(region);
        const severity = severityByRegion.get(region);
        const active = selected || Boolean(severity);
        const color = colorForRegion(region);
        const isStrongest = strongestRegion === region;
        const anchor = hotspots[0];

        return (
          <g
            key={region}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-pressed={interactive ? selected : undefined}
            aria-label={
              interactive
                ? `Region ${regionLabels[region]} ${selected ? "ausgewählt" : "auswählen"}`
                : `${regionLabels[region]}${severity ? `: ${severityLabels[severity]}` : ""}`
            }
            onClick={interactive ? () => onToggleRegion?.(region) : undefined}
            onKeyDown={(event) => handleKey(event, region)}
            className={[
              "outline-none",
              interactive ? "cursor-pointer [&:focus-visible_.hit]:stroke-white" : "",
            ].join(" ")}
          >
            {hotspots.map((spot, index) => (
              <g key={index}>
                {active ? (
                  <circle
                    cx={spot.cx}
                    cy={spot.cy}
                    r={spot.r + 6}
                    fill={color}
                    fillOpacity="0.18"
                    className={severity === "red" || isStrongest ? "animate-load-pulse" : ""}
                    style={{ transformOrigin: `${spot.cx}px ${spot.cy}px` }}
                  />
                ) : null}
                <circle
                  cx={spot.cx}
                  cy={spot.cy}
                  r={spot.r}
                  fill={active ? color : "#0f2c20"}
                  fillOpacity={active ? 0.85 : 0.5}
                  stroke={active ? color : "#4cc38a"}
                  strokeOpacity={active ? 0.9 : 0.4}
                  strokeWidth="2"
                />
                {/* generous, invisible hit target */}
                <circle
                  className="hit"
                  cx={spot.cx}
                  cy={spot.cy}
                  r={spot.r + 10}
                  fill="transparent"
                  stroke="transparent"
                  strokeWidth="2"
                />
              </g>
            ))}
            {active ? (
              <text
                x={anchor.cx}
                y={anchor.cy - anchor.r - 8}
                textAnchor="middle"
                className="fill-white text-[10px] font-semibold uppercase tracking-[0.12em]"
              >
                {regionLabels[region]}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
