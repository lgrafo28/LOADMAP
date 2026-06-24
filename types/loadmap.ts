export const ACTIVITY_IDS = [
  "lifting",
  "overhead",
  "standing",
  "bending",
  "repetitive",
  "pushing",
  "awkward",
] as const;

export type ActivityId = (typeof ACTIVITY_IDS)[number];

export const REGION_IDS = [
  "back",
  "neck",
  "shoulders",
  "knees",
  "wrists",
  "legsFeet",
] as const;

export type RegionId = (typeof REGION_IDS)[number];

export type QuestionValue = string | RegionId;

export type Severity = "green" | "yellow" | "red";

export type RegionMatchMode = "any" | "all";

export type PathStage = "task" | "region" | "factor" | "risk" | "technology";

export type ScoreContributionCategory =
  | "question"
  | "coverage"
  | "focus"
  | "activity";

export type QuestionCategory =
  | "frequency"
  | "force"
  | "distance"
  | "support"
  | "duration"
  | "recovery"
  | "environment"
  | "posture"
  | "pace"
  | "region";

export type QuestionId =
  | "liftFrequency"
  | "loadWeight"
  | "carryDistance"
  | "assistTools"
  | "overheadDuration"
  | "toolWeight"
  | "recoveryBreaks"
  | "armSupport"
  | "standingDuration"
  | "postureChange"
  | "floorCondition"
  | "seatOption"
  | "repeatRate"
  | "forceLevel"
  | "linePace"
  | "microBreaks"
  | "postureDuration"
  | "avoidablePosture"
  | "movementSpace"
  | "supportSetup"
  | "pushForce"
  | "routeCondition"
  | "transportDistance"
  | "focusRegion";

export type ActivityOption = {
  id: ActivityId;
  label: string;
  description: string;
  diagnosticLens: string;
  typicalDrivers: string[];
};

export type RegionOption = {
  id: RegionId;
  label: string;
  bodyZone: string;
  description: string;
};

export type QuestionOption = {
  value: QuestionValue;
  label: string;
  score: number;
  contributionLabel: string;
  explanation: string;
};

export type DecisionQuestion = {
  id: QuestionId;
  activityIds: ActivityId[];
  category: QuestionCategory;
  label: string;
  hint: string;
  relevance: string;
  options: QuestionOption[];
};

export type AssessmentAnswers = Partial<Record<QuestionId, QuestionValue>>;

export type RecommendationLevel = {
  title: string;
  items: string[];
};

export type TechnologyRecommendation = {
  id: string;
  label: string;
  category: string;
  rationale: string;
};

export type RecommendationProfile = {
  title: string;
  primaryStrain: string;
  strainDrivers: string[];
  summary: string;
  technologies: TechnologyRecommendation[];
  advisory: string;
  nextStep: string;
  immediate: RecommendationLevel;
  technical: RecommendationLevel;
  strategic: RecommendationLevel;
};

export type MatchingRule = {
  id: string;
  priority: number;
  activities: ActivityId[];
  regions: RegionId[];
  regionMatchMode: RegionMatchMode;
  answerFilters?: Partial<Record<QuestionId, QuestionValue[]>>;
  minScore?: number;
  profile: RecommendationProfile;
};

export type AssessmentState = {
  activityId: ActivityId | null;
  selectedRegions: RegionId[];
  answers: AssessmentAnswers;
};

export type ScoreContribution = {
  id: string;
  label: string;
  points: number;
  reason: string;
  category: ScoreContributionCategory;
  sourceQuestionId?: QuestionId;
};

export type RegionSeverity = {
  regionId: RegionId;
  severity: Severity;
  score: number;
  explanation: string;
};

export type LoadPathNode = {
  stage: PathStage;
  title: string;
  detail: string;
  status: "selected" | "detected" | "calculated" | "recommended";
};

export type AssessmentPreview = {
  activity: ActivityOption | null;
  activeQuestions: DecisionQuestion[];
  selectedRegions: RegionOption[];
  strongestRegion: RegionId;
  currentScore: number;
  currentSeverity: Severity;
  contributions: ScoreContribution[];
  answeredQuestions: number;
  totalQuestions: number;
  loadPath: LoadPathNode[];
};

export type AssessmentResult = {
  overallSeverity: Severity;
  matchedProfile: RecommendationProfile;
  activity: ActivityOption;
  selectedRegions: RegionOption[];
  activeQuestions: DecisionQuestion[];
  regionSeverities: RegionSeverity[];
  strongestRegion: RegionId;
  totalScore: number;
  contributions: ScoreContribution[];
  topContributions: ScoreContribution[];
  technologyMatches: TechnologyRecommendation[];
  loadPath: LoadPathNode[];
  matchedRuleId: string | null;
};
