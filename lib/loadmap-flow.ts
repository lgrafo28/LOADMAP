import { getActivityById, getQuestionsForActivity } from "@/data/loadmap-data";
import { AssessmentState } from "@/types/loadmap";

export const initialAssessmentState: AssessmentState = {
  activityId: null,
  selectedRegions: [],
  answers: {},
};

export const stepTitles = [
  "Tätigkeit auswählen",
  "Körperregion markieren",
  "Belastung diagnostizieren",
  "Load Passport",
] as const;

export type LoadMapStep = 1 | 2 | 3 | 4;

export const getStepCopy = (step: LoadMapStep, state: AssessmentState) => {
  const activity = getActivityById(state.activityId);

  switch (step) {
    case 1:
      return {
        kicker: "Schritt 1",
        title: "Welche Tätigkeit prägt die Belastung?",
        description:
          "Wählen Sie die dominante Tätigkeit. Daraus erzeugt die LoadMap im nächsten Schritt passende Diagnosefragen.",
      };
    case 2:
      return {
        kicker: "Schritt 2",
        title: "Wo zeigt sich die Belastung am Körper?",
        description:
          "Markieren Sie die betroffenen Körperregionen. Diese Auswahl schärft die spätere Risiko- und Technologieempfehlung.",
      };
    case 3:
      return {
        kicker: "Schritt 3",
        title: activity
          ? `Welche Faktoren treiben die Belastung bei ${activity.label}?`
          : "Welche Faktoren treiben die Belastung?",
        description: activity
          ? `${activity.diagnosticLens} Jede Antwort fließt als nachvollziehbarer Beitrag in die Risikobewertung ein.`
          : "Die Fragen passen sich an die gewählte Tätigkeit an und zeigen, warum eine Risikostufe entsteht.",
      };
    default:
      return {
        kicker: "Schritt 4",
        title: "Ihr Load Passport erklärt Risiko, Technologie und nächsten Schritt",
        description:
          "Das Ergebnis bündelt Tätigkeit, betroffene Körperregionen, Belastungstreiber und passende Entlastungsempfehlungen in einem nachvollziehbaren Profil.",
      };
  }
};

export const canContinue = (step: LoadMapStep, state: AssessmentState): boolean => {
  if (step === 1) {
    return Boolean(state.activityId);
  }

  if (step === 2) {
    return state.selectedRegions.length > 0;
  }

  if (step === 3) {
    return getQuestionsForActivity(state.activityId).every((question) => Boolean(state.answers[question.id]));
  }

  return true;
};
