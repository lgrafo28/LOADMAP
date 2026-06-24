import { LoadMapStep, stepTitles } from "@/lib/loadmap-flow";

import { CheckCircleIcon } from "./icons";

type ProgressBarProps = {
  currentStep: LoadMapStep;
};

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div
      data-print-hide
      className="rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur"
      aria-label="Fortschritt der LoadMap"
    >
      <ol className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {stepTitles.map((title, index) => {
          const stepNumber = (index + 1) as LoadMapStep;
          const isActive = currentStep === stepNumber;
          const isComplete = currentStep > stepNumber;

          return (
            <li
              key={title}
              className="flex flex-1 items-center gap-3"
              aria-current={isActive ? "step" : undefined}
            >
              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition",
                  isComplete
                    ? "bg-gradient-to-br from-brand-300 to-brand-500 text-surface-0 shadow-mint"
                    : isActive
                      ? "bg-brand-500/15 text-brand-300 ring-1 ring-brand-300/50"
                      : "bg-white/[0.03] text-ink-faint ring-1 ring-white/[0.06]",
                ].join(" ")}
              >
                {isComplete ? <CheckCircleIcon className="h-5 w-5" /> : stepNumber}
              </div>
              <div className="min-w-0">
                <p className="tech-label text-[10px] text-ink-faint">Step {stepNumber}</p>
                <p
                  className={[
                    "truncate text-sm font-semibold transition",
                    isActive || isComplete ? "text-ink" : "text-ink-muted",
                  ].join(" ")}
                >
                  {title}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
