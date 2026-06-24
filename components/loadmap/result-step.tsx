import { AssessmentResult } from "@/types/loadmap";

import { BodyLoadMap } from "./body-load-map";
import { CtaAction, CtaPanel } from "./cta-panel";
import { DiagnosticPath } from "./diagnostic-path";
import { RecommendationCard } from "./recommendation-card";
import { ScoreBreakdown } from "./score-breakdown";
import { TechnologyMatchList } from "./technology-match-list";
import { regionLabels, severityLabels, severityNarratives, severityStyles } from "./utils";

type ResultStepProps = {
  result: AssessmentResult;
};

const CONTACT_EMAIL = "beratung@neuroway.de";

const resultDisclaimer =
  "Diese Auswertung ist eine Orientierungshilfe und ersetzt keine medizinische Diagnose oder Gefährdungsbeurteilung.";

function buildCtas(result: AssessmentResult): CtaAction[] {
  const regionSummary = result.selectedRegions.map((region) => region.label).join(", ");
  const drivers = result.topContributions.map((entry) => `• ${entry.label} (+${entry.points})`).join("\n");
  const tech = result.technologyMatches.map((entry) => `• ${entry.label}`).join("\n");

  const subject = `LoadMap-Analyse: ${result.activity.label} – Risiko ${severityLabels[result.overallSeverity]}`;
  const body = [
    "Guten Tag,",
    "",
    "auf Basis der LoadMap-Analyse möchten wir das weitere Vorgehen besprechen.",
    "",
    `Tätigkeit: ${result.activity.label}`,
    `Betroffene Regionen: ${regionSummary}`,
    `Risikostufe: ${severityLabels[result.overallSeverity]} (${result.totalScore} Punkte)`,
    "",
    "Haupttreiber:",
    drivers,
    "",
    "Technologie-Match:",
    tech,
  ].join("\n");

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const testDay = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Testtag planen: ${result.activity.label}`,
  )}&body=${encodeURIComponent(
    `Guten Tag,\n\nwir möchten einen Vor-Ort-Testtag für die Tätigkeit "${result.activity.label}" planen.\nBetroffene Regionen: ${regionSummary}.\n\nBitte schlagen Sie passende Termine vor.`,
  )}`;

  return [
    {
      label: "Beratung anfragen",
      description: "Vorausgefüllte E-Mail mit Ihrem Profil",
      href: mailto,
      primary: true,
    },
    {
      label: "Testtag planen",
      description: "Vor-Ort-Evaluation terminieren",
      href: testDay,
    },
    {
      label: "PDF-Auswertung",
      description: "Load Passport drucken / als PDF sichern",
      print: true,
    },
  ];
}

export function ResultStep({ result }: ResultStepProps) {
  const regionSummary = result.selectedRegions.map((region) => region.label).join(", ");
  const ctas = buildCtas(result);

  return (
    <div className="space-y-6 reveal-stagger">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-surface-panel/70 p-6 shadow-panel">
          <div className="pointer-events-none absolute inset-0 bg-glow-tr" />
          <div className="relative flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="tech-label text-[11px] text-brand-300">Load Passport</p>
              <h3 className="display mt-2 max-w-[20ch] text-3xl text-ink">{result.matchedProfile.title}</h3>
            </div>
            <span className={["rounded-full px-4 py-2 text-sm font-semibold", severityStyles[result.overallSeverity]].join(" ")}>
              Risikostufe: {severityLabels[result.overallSeverity]}
            </span>
          </div>

          <div className="relative mt-6 grid gap-5 md:grid-cols-[0.7fr_1fr]">
            {/* Body heatmap */}
            <div className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-surface-0 p-4 text-ink">
              <div className="absolute inset-0 bg-grid-dark bg-[size:26px_26px] opacity-50" />
              <p className="relative tech-label text-[10px] text-brand-300">Body Heatmap</p>
              <div className="relative mx-auto mt-1 max-w-[200px]">
                <BodyLoadMap severities={result.regionSeverities} strongestRegion={result.strongestRegion} />
              </div>
              <div className="tech-label relative flex items-center justify-center gap-3 text-[9px] text-ink-muted">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" />Niedrig</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" />Relevant</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger" />Hoch</span>
              </div>
            </div>

            <div className="grid content-start gap-4">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="tech-label text-[10px] text-ink-faint">Tätigkeit</p>
                <p className="mt-2 text-base font-semibold text-ink">{result.activity.label}</p>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{result.activity.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="tech-label text-[10px] text-ink-faint">Körperregionen</p>
                  <p className="mt-2 text-base font-semibold text-ink">{regionSummary}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Schwerpunkt: {regionLabels[result.strongestRegion]}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="tech-label text-[10px] text-ink-faint">Risikoprofil</p>
                  <p className="mt-2 display text-3xl text-ink">{result.totalScore}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{severityNarratives[result.overallSeverity]}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-6 overflow-hidden rounded-[26px] border border-white/[0.08] bg-surface-0 p-5 text-ink">
            <div className="pointer-events-none absolute inset-0 bg-glow-tr" />
            <p className="relative tech-label text-[11px] text-brand-300">Warum dieses Ergebnis?</p>
            <h4 className="display relative mt-3 text-2xl text-ink">{result.matchedProfile.primaryStrain}</h4>
            <p className="relative mt-4 text-sm leading-7 text-ink-muted">{result.matchedProfile.summary}</p>
            <ul className="relative mt-5 space-y-3 text-sm leading-6 text-ink">
              {result.matchedProfile.strainDrivers.map((driver) => (
                <li key={driver} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-brand-300" />
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <DiagnosticPath nodes={result.loadPath} title="Belastungspfad" />
          <TechnologyMatchList technologies={result.technologyMatches} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ScoreBreakdown contributions={result.topContributions} title="Haupttreiber der Risikostufe" />

        <div className="rounded-[26px] border border-white/[0.08] bg-surface-panel/60 p-5 shadow-soft">
          <p className="tech-label text-[11px] text-brand-300">Beratungsempfehlung</p>
          <p className="mt-4 text-lg font-semibold text-ink">{result.matchedProfile.advisory}</p>
          <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-sm font-semibold text-ink">Nächster sinnvoller Schritt</p>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{result.matchedProfile.nextStep}</p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {result.regionSeverities.map((region) => (
              <div key={region.regionId} className="rounded-2xl border border-white/[0.08] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-ink">{regionLabels[region.regionId]}</p>
                  <span className={["rounded-full px-3 py-1 text-xs font-semibold", severityStyles[region.severity]].join(" ")}>
                    {severityLabels[region.severity]}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{region.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <RecommendationCard level={result.matchedProfile.immediate} />
        <RecommendationCard level={result.matchedProfile.technical} />
        <RecommendationCard level={result.matchedProfile.strategic} />
      </div>

      <CtaPanel ctas={ctas} disclaimer={resultDisclaimer} />
    </div>
  );
}
