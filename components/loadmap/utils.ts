import { RegionId, Severity } from "@/types/loadmap";

export const severityStyles: Record<Severity, string> = {
  green: "bg-success/12 text-success ring-1 ring-success/30",
  yellow: "bg-warning/12 text-warning ring-1 ring-warning/30",
  red: "bg-danger/12 text-danger ring-1 ring-danger/30",
};

export const severityHex: Record<Severity, string> = {
  green: "#4cc38a",   // = Tailwind success token
  yellow: "#e2b23c",  // = Tailwind warning token
  red: "#e0596a",     // = Tailwind danger token
};

export const severityLabels: Record<Severity, string> = {
  green: "Niedrig",
  yellow: "Relevant",
  red: "Hoch",
};

export const severityNarratives: Record<Severity, string> = {
  green: "Der Belastungsdruck wirkt aktuell eher begrenzt, sollte aber beobachtet werden.",
  yellow: "Die Belastung ist relevant und sollte gezielt mit Technik oder Ablaufmaßnahmen entschärft werden.",
  red: "Die Belastung ist hoch und spricht für priorisierte technische und organisatorische Entlastung.",
};

export const regionLabels: Record<RegionId, string> = {
  back: "Rücken",
  neck: "Nacken",
  shoulders: "Schulter",
  knees: "Knie",
  wrists: "Handgelenke",
  legsFeet: "Beine/Füße",
};

export const formatPoints = (points: number) => `+${points}`;
