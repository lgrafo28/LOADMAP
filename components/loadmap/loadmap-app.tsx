"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getActivityById, getQuestionsForActivity } from "@/data/loadmap-data";
import { buildAssessmentPreview, evaluateAssessment } from "@/lib/loadmap-engine";
import { canContinue, getStepCopy, initialAssessmentState, LoadMapStep } from "@/lib/loadmap-flow";
import { AssessmentResult, AssessmentState, QuestionId, RegionId } from "@/types/loadmap";

import { ActivityStep } from "./activity-step";
import { ArrowRightIcon } from "./icons";
import { Hero } from "./hero";
import { RadarRegion } from "./load-radar";
import { ProgressBar } from "./progress-bar";
import { QuestionsStep } from "./questions-step";
import { RegionStep } from "./region-step";
import { ResultStep } from "./result-step";
import { SectionHeader } from "./section-header";
import { regionLabels } from "./utils";

export function LoadMapApp() {
  const [currentStep, setCurrentStep] = useState<LoadMapStep>(1);
  const [state, setState] = useState<AssessmentState>(initialAssessmentState);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const assessmentRef = useRef<HTMLElement>(null);
  const prevStepRef = useRef(currentStep);
  const activeQuestions = useMemo(
    () => getQuestionsForActivity(state.activityId, state.selectedRegions),
    [state.activityId, state.selectedRegions],
  );
  const activity = useMemo(() => getActivityById(state.activityId), [state.activityId]);
  const preview = buildAssessmentPreview(state);
  const stepCopy = getStepCopy(currentStep, state);

  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      prevStepRef.current = currentStep;
      assessmentRef.current?.focus({ preventScroll: true });
      assessmentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep]);

  // Feed the hero radar from REAL state: final result uses true per-region
  // severities; before that, plot the chosen regions (strongest one tinted by
  // the live preview severity once questions are answered). Never fake data.
  const radarRegions: RadarRegion[] = result
    ? (() => {
        const selectedIds = new Set(result.selectedRegions.map((region) => region.id));
        return result.regionSeverities
          .filter((entry) => selectedIds.has(entry.regionId))
          .map((entry) => ({ regionId: entry.regionId, severity: entry.severity }));
      })()
    : state.selectedRegions.map((regionId) => ({
        regionId,
        severity:
          regionId === preview.strongestRegion && preview.answeredQuestions > 0
            ? preview.currentSeverity
            : "green",
      }));

  const updateAnswer = (questionId: QuestionId, value: AssessmentState["answers"][QuestionId]) => {
    setState((previous) => ({
      ...previous,
      answers: {
        ...previous.answers,
        [questionId]: value,
      },
    }));
    setResult(null);
  };

  const nextStep = () => {
    if (currentStep === 3) {
      const nextResult = evaluateAssessment(state);
      setResult(nextResult);
      setCurrentStep(4);
      return;
    }

    setCurrentStep((previous) => {
      switch (previous) {
        case 1:
          return 2;
        case 2:
          return 3;
        default:
          return 4;
      }
    });
  };

  const prevStep = useCallback(() => {
    setCurrentStep((previous) => {
      if (previous === 4) setResult(null);
      switch (previous) {
        case 4:
          return 3;
        case 3:
          return 2;
        default:
          return 1;
      }
    });
  }, []);

  const reset = () => {
    setState(initialAssessmentState);
    setResult(null);
    setCurrentStep(1);
  };

  const restartAssessment = () => {
    reset();
    document.getElementById("assessment")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectActivity = (value: NonNullable<AssessmentState["activityId"]>) => {
    setState({
      activityId: value,
      selectedRegions: [],
      answers: {},
    });
    setResult(null);
  };

  const toggleRegion = (regionId: RegionId) => {
    setState((previous) => {
      const nextRegions = previous.selectedRegions.includes(regionId)
        ? previous.selectedRegions.filter((entry) => entry !== regionId)
        : [...previous.selectedRegions, regionId];

      // Auto-set focusRegion when exactly one region is selected
      const nextAnswers =
        nextRegions.length === 1 && !previous.answers.focusRegion
          ? { ...previous.answers, focusRegion: nextRegions[0] }
          : previous.answers;

      return { ...previous, selectedRegions: nextRegions, answers: nextAnswers };
    });
    setResult(null);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
      <Hero onStart={restartAssessment} radarRegions={radarRegions} />

      <section
        ref={assessmentRef}
        id="assessment"
        tabIndex={-1}
        className="relative space-y-6 overflow-hidden rounded-[36px] border border-white/[0.08] bg-surface-panel/80 p-6 shadow-panel backdrop-blur outline-none md:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-glow-tr" />
        <div className="relative space-y-6">
        <SectionHeader
          kicker={stepCopy.kicker}
          title={stepCopy.title}
          description={stepCopy.description}
        />
        <ProgressBar currentStep={currentStep} />

        <div className="space-y-6">
          {currentStep === 1 ? (
            <ActivityStep activityId={state.activityId} onSelect={selectActivity} />
          ) : null}

          {currentStep === 2 ? (
            <RegionStep selectedRegions={state.selectedRegions} onToggle={toggleRegion} />
          ) : null}

          {currentStep === 3 ? (
            <QuestionsStep
              activity={activity}
              questions={activeQuestions}
              answers={state.answers}
              preview={preview}
              onAnswer={updateAnswer}
            />
          ) : null}
          {currentStep === 4 && result ? <ResultStep result={result} /> : null}
        </div>

        <div data-print-hide className="flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md text-sm text-ink-faint">
            {currentStep < 4
              ? currentStep === 3
                ? "Die Risikostufe entsteht aus Tätigkeit, Körperregion, adaptiven Fragen und sichtbaren Score-Beiträgen."
                : "Die Auswertung dient als Orientierungshilfe und ersetzt keine medizinische Diagnose oder Gefährdungsbeurteilung."
              : `Stärkste Region im Profil: ${regionLabels[result?.strongestRegion ?? "back"]}`}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="rounded-full border border-white/[0.12] px-5 py-3 text-sm font-semibold text-ink-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-panel enabled:hover:border-white/25 enabled:hover:bg-white/[0.04] enabled:hover:text-ink disabled:cursor-not-allowed disabled:border-white/5 disabled:text-ink-faint/50"
            >
              Zurück
            </button>
            {currentStep === 4 ? (
              <button
                type="button"
                onClick={restartAssessment}
                className="rounded-full border border-white/[0.12] px-5 py-3 text-sm font-semibold text-ink-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-panel hover:border-white/25 hover:bg-white/[0.04] hover:text-ink"
              >
                Neue Analyse starten
              </button>
            ) : null}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canContinue(currentStep, state)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 px-6 py-3 text-sm font-semibold text-surface-0 shadow-mint transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-panel enabled:hover:-translate-y-0.5 enabled:hover:shadow-glow disabled:cursor-not-allowed disabled:from-white/10 disabled:to-white/10 disabled:text-ink-faint disabled:shadow-none"
              >
                {currentStep === 3 ? "Ergebnis anzeigen" : "Weiter"}
                <ArrowRightIcon />
              </button>
            ) : null}
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}
