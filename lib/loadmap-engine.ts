import {
  bodyRegions,
  fallbackProfile,
  getActivityById,
  getQuestionsForActivity,
  getRegionById,
  matchingRules,
} from "@/data/loadmap-data";
import {
  ActivityId,
  AssessmentPreview,
  AssessmentResult,
  AssessmentState,
  DecisionQuestion,
  LoadPathNode,
  MatchingRule,
  QuestionId,
  QuestionValue,
  REGION_IDS,
  RegionId,
  RegionSeverity,
  ScoreContribution,
  Severity,
} from "@/types/loadmap";

const isValidRegionId = (value: unknown): value is RegionId =>
  typeof value === "string" && (REGION_IDS as readonly string[]).includes(value);

const OVERALL_RED_THRESHOLD = 13;
const OVERALL_YELLOW_THRESHOLD = 7;
const REGION_RED_THRESHOLD = 8;
const REGION_YELLOW_THRESHOLD = 4;
// Baseline offset: regions need at least one boost (selected/strongest/activity) to score above zero
const REGION_BASELINE_OFFSET = 2;

const activityPrimaryRegions: Record<ActivityId, RegionId[]> = {
  lifting: ["back", "knees"],
  overhead: ["shoulders", "neck"],
  standing: ["legsFeet", "knees"],
  bending: ["back", "neck"],
  repetitive: ["wrists", "shoulders"],
  pushing: ["back", "shoulders", "knees"],
  awkward: ["back", "neck", "shoulders"],
};

const severityFromScore = (score: number): Severity => {
  if (score >= OVERALL_RED_THRESHOLD) return "red";
  if (score >= OVERALL_YELLOW_THRESHOLD) return "yellow";
  return "green";
};

const regionSeverityFromScore = (score: number): Severity => {
  if (score >= REGION_RED_THRESHOLD) return "red";
  if (score >= REGION_YELLOW_THRESHOLD) return "yellow";
  return "green";
};

const getOptionForQuestion = (
  questions: DecisionQuestion[],
  questionId: QuestionId,
  value: QuestionValue | undefined,
) => {
  if (!value) {
    return null;
  }

  const question = questions.find((entry) => entry.id === questionId);
  return question?.options.find((option) => option.value === value) ?? null;
};

const collectAnswerContributions = (
  state: AssessmentState,
  questions: DecisionQuestion[],
): ScoreContribution[] => {
  const contributions: ScoreContribution[] = [];

  questions.forEach((question) => {
    const answer = state.answers[question.id];
    const option = getOptionForQuestion(questions, question.id, answer);

    if (!option || option.score <= 0 || question.id === "focusRegion") {
      return;
    }

    contributions.push({
      id: question.id,
      label: option.contributionLabel,
      points: option.score,
      reason: option.explanation,
      category: "question",
      sourceQuestionId: question.id,
    });
  });

  if (state.selectedRegions.length >= 3) {
    contributions.push({
      id: "multiple-regions",
      label: "mehrere betroffene Körperregionen",
      points: 2,
      reason: "Die Belastung zeigt sich gleichzeitig in mehreren Körperregionen.",
      category: "coverage",
    });
  } else if (state.selectedRegions.length === 2) {
    contributions.push({
      id: "two-regions",
      label: "mehr als eine betroffene Körperregion",
      points: 1,
      reason: "Die Belastung ist nicht nur lokal, sondern verteilt sich auf mehrere Zonen.",
      category: "coverage",
    });
  }

  const focusRegion = state.answers.focusRegion;
  if (state.activityId && isValidRegionId(focusRegion)) {
    const primaryRegions = activityPrimaryRegions[state.activityId] ?? [];

    if (primaryRegions.includes(focusRegion)) {
      contributions.push({
        id: "focus-region-fit",
        label: "typischer Belastungsschwerpunkt bestätigt",
        points: 1,
        reason: "Die gewählte Schwerpunktregion passt zum typischen Belastungsmuster der Tätigkeit.",
        category: "focus",
        sourceQuestionId: "focusRegion",
      });
    }
  }

  return contributions;
};

const ruleMatches = (
  rule: MatchingRule,
  state: AssessmentState,
  totalScore: number,
): boolean => {
  if (!state.activityId || !rule.activities.includes(state.activityId)) {
    return false;
  }

  if (rule.minScore && totalScore < rule.minScore) {
    return false;
  }

  const hasRegionMatch =
    rule.regionMatchMode === "all"
      ? rule.regions.every((region) => state.selectedRegions.includes(region))
      : state.selectedRegions.some((region) => rule.regions.includes(region));

  if (!hasRegionMatch) {
    return false;
  }

  if (!rule.answerFilters) {
    return true;
  }

  return Object.entries(rule.answerFilters).every(([questionId, acceptedValues]) => {
    const answer = state.answers[questionId as QuestionId];
    return answer ? acceptedValues.includes(answer) : false;
  });
};

const getStrongestRegion = (state: AssessmentState): RegionId => {
  const focusRegion = state.answers.focusRegion;

  if (isValidRegionId(focusRegion)) {
    return focusRegion;
  }

  if (state.selectedRegions.length > 0) {
    return state.selectedRegions[0];
  }

  if (state.activityId) {
    const primary = activityPrimaryRegions[state.activityId];
    if (primary && primary.length > 0) return primary[0];
  }

  return "back";
};

const computeRegionSeverities = (
  state: AssessmentState,
  totalScore: number,
  strongestRegion: RegionId,
): RegionSeverity[] => {
  const primaryRegions = state.activityId ? (activityPrimaryRegions[state.activityId] ?? []) : [];
  const scoreBase = Math.ceil(totalScore / 3);

  return bodyRegions.map((region) => {
    const selectedBoost = state.selectedRegions.includes(region.id) ? 2 : 0;
    const strongestBoost = strongestRegion === region.id ? 2 : 0;
    const activityBoost = primaryRegions.includes(region.id) ? 2 : 0;
    const score = Math.max(0, scoreBase + selectedBoost + strongestBoost + activityBoost - REGION_BASELINE_OFFSET);
    const severity = regionSeverityFromScore(score);

    let explanation = "Keine dominierende Belastung aus den gewählten Faktoren sichtbar.";
    if (severity === "red") {
      explanation = "Die Region ist direkt vom Tätigkeitstyp und mehreren Belastungstreibern betroffen.";
    } else if (severity === "yellow") {
      explanation = "Die Region ist beteiligt und sollte in der Maßnahmendiskussion mitbetrachtet werden.";
    }

    return {
      regionId: region.id,
      severity,
      score,
      explanation,
    };
  });
};

const buildLoadPath = (
  state: AssessmentState,
  score: number,
  severity: Severity,
  contributions: ScoreContribution[],
  technologyLabel?: string,
): LoadPathNode[] => {
  const activity = getActivityById(state.activityId);
  const selectedRegionLabels =
    state.selectedRegions.map((regionId) => getRegionById(regionId)?.label ?? regionId).join(", ") || "Noch offen";
  const dominantDrivers =
    contributions.length > 0
      ? contributions
          .slice()
          .sort((left, right) => right.points - left.points)
          .slice(0, 2)
          .map((entry) => entry.label)
          .join(", ")
      : "Noch keine Treiber bewertet";

  return [
    {
      stage: "task",
      title: "Tätigkeit gewählt",
      detail: activity?.label ?? "Noch keine Tätigkeit gewählt",
      status: "selected",
    },
    {
      stage: "region",
      title: "Körperregion gewählt",
      detail: selectedRegionLabels,
      status: "selected",
    },
    {
      stage: "factor",
      title: "Belastungsfaktor erkannt",
      detail: dominantDrivers,
      status: "detected",
    },
    {
      stage: "risk",
      title: "Risiko berechnet",
      detail: `${score} Punkte, Risikostufe ${severity}`,
      status: "calculated",
    },
    {
      stage: "technology",
      title: "Technologie empfohlen",
      detail: technologyLabel ?? "Wird mit vollständiger Auswertung priorisiert",
      status: "recommended",
    },
  ];
};

export const buildAssessmentPreview = (state: AssessmentState): AssessmentPreview => {
  const activity = getActivityById(state.activityId);
  const activeQuestions = getQuestionsForActivity(state.activityId);
  const selectedRegions = state.selectedRegions
    .map((regionId) => getRegionById(regionId))
    .filter((region): region is NonNullable<typeof region> => Boolean(region));
  const strongestRegion = getStrongestRegion(state);
  const contributions = collectAnswerContributions(state, activeQuestions);
  const currentScore = contributions.reduce((sum, entry) => sum + entry.points, 0);
  const currentSeverity = severityFromScore(currentScore);
  const answeredQuestions = activeQuestions.filter((question) => Boolean(state.answers[question.id])).length;
  const loadPath = buildLoadPath(state, currentScore, currentSeverity, contributions);

  return {
    activity,
    activeQuestions,
    selectedRegions,
    strongestRegion,
    currentScore,
    currentSeverity,
    contributions,
    answeredQuestions,
    totalQuestions: activeQuestions.length,
    loadPath,
  };
};

export const evaluateAssessment = (state: AssessmentState): AssessmentResult => {
  const preview = buildAssessmentPreview(state);
  const matchedRule =
    matchingRules
      .filter((rule) => ruleMatches(rule, state, preview.currentScore))
      .sort((left, right) => right.priority - left.priority)[0] ?? null;
  const matchedProfile = matchedRule?.profile ?? fallbackProfile;
  const activity = preview.activity ?? getActivityById("lifting");
  const strongestRegion = preview.strongestRegion;
  const regionSeverities = computeRegionSeverities(state, preview.currentScore, strongestRegion);
  const topContributions = preview.contributions
    .slice()
    .sort((left, right) => right.points - left.points)
    .slice(0, 4);
  const loadPath = buildLoadPath(
    state,
    preview.currentScore,
    preview.currentSeverity,
    preview.contributions,
    matchedProfile.technologies[0]?.label,
  );

  return {
    overallSeverity: preview.currentSeverity,
    matchedProfile,
    activity: activity ?? getActivityById("lifting")!,
    selectedRegions: preview.selectedRegions,
    activeQuestions: preview.activeQuestions,
    regionSeverities,
    strongestRegion,
    totalScore: preview.currentScore,
    contributions: preview.contributions,
    topContributions,
    technologyMatches: matchedProfile.technologies,
    loadPath,
    matchedRuleId: matchedRule?.id ?? null,
  };
};
