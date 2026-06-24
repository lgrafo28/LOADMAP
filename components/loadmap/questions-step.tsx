import { ActivityOption, AssessmentAnswers, AssessmentPreview, DecisionQuestion, QuestionId } from "@/types/loadmap";

import { DiagnosticPath } from "./diagnostic-path";
import { ScoreBreakdown } from "./score-breakdown";
import { severityLabels, severityNarratives, severityStyles } from "./utils";

type QuestionsStepProps = {
  activity: ActivityOption | null;
  questions: DecisionQuestion[];
  answers: AssessmentAnswers;
  preview: AssessmentPreview;
  onAnswer: (questionId: QuestionId, value: AssessmentAnswers[QuestionId]) => void;
};

export function QuestionsStep({
  activity,
  questions,
  answers,
  preview,
  onAnswer,
}: QuestionsStepProps) {
  const progress = preview.totalQuestions > 0 ? preview.answeredQuestions / preview.totalQuestions : 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <div className="rounded-[26px] border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">
                {activity ? `Adaptive Diagnose für ${activity.label}` : "Adaptive Diagnose"}
              </p>
              <p className="mt-1 text-sm leading-6 text-ink-muted">
                {activity?.diagnosticLens ??
                  "Die Fragen passen sich an die gewählte Tätigkeit an und erklären die spätere Risikobewertung."}
              </p>
            </div>
            <span
              aria-live="polite"
              aria-atomic="true"
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-sm font-semibold text-ink"
            >
              {preview.answeredQuestions} von {preview.totalQuestions} beantwortet
            </span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-300 to-brand-500 transition-all duration-500"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>

        {questions.map((question) => (
          <div key={question.id} className="rounded-[26px] border border-white/[0.08] bg-surface-panel/60 p-5 shadow-soft">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tech-label rounded-full bg-brand-500/[0.1] px-3 py-1 text-[10px] text-brand-300 ring-1 ring-brand-300/25">
                  {question.category}
                </span>
                <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs font-medium text-ink-muted">
                  Warum relevant: {question.relevance}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-ink">{question.label}</h3>
              <p className="text-sm leading-6 text-ink-muted">{question.hint}</p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {question.options.map((option) => {
                const selected = answers[question.id] === option.value;

                return (
                  <button
                    key={`${question.id}-${option.value}`}
                    type="button"
                    onClick={() => onAnswer(question.id, option.value)}
                    aria-pressed={selected}
                    className={[
                      "rounded-2xl border px-4 py-4 text-left text-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-panel",
                      selected
                        ? "border-brand-300/50 bg-brand-500/[0.12] text-ink shadow-glow"
                        : "border-white/[0.08] bg-white/[0.02] text-ink-muted hover:-translate-y-0.5 hover:border-brand-300/30 hover:bg-white/[0.04] hover:text-ink",
                    ].join(" ")}
                  >
                    <p className="font-semibold text-ink">{option.label}</p>
                    <p className={["mt-2 leading-6", selected ? "text-ink-muted" : "text-ink-faint"].join(" ")}>
                      {option.explanation}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-surface-0 p-5 text-ink shadow-panel">
          <div className="pointer-events-none absolute inset-0 bg-glow-tr" />
          <div className="relative">
            <p className="tech-label text-[11px] text-brand-300">Live-Diagnose</p>
            <div aria-live="polite" aria-atomic="true" className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="display text-4xl text-ink">{preview.currentScore}</p>
                <p className="mt-1 text-sm text-ink-muted">Punkte aktuell</p>
              </div>
              <span className={["rounded-full px-3.5 py-1.5 text-sm font-semibold", severityStyles[preview.currentSeverity]].join(" ")}>
                {severityLabels[preview.currentSeverity]}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink-muted">
              {severityNarratives[preview.currentSeverity]}
            </p>
          </div>
        </div>

        <DiagnosticPath nodes={preview.loadPath} title="Entscheidungsbaum" />
        <ScoreBreakdown contributions={preview.contributions} />
      </div>
    </div>
  );
}
