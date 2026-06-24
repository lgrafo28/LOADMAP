import assert from "node:assert/strict";
import test from "node:test";

import { evaluateAssessment, buildAssessmentPreview } from "../lib/loadmap-engine";
import { questionCatalog, activities, bodyRegions, matchingRules } from "../data/loadmap-data";
import { AssessmentState, ACTIVITY_IDS, REGION_IDS } from "../types/loadmap";

test("Heben plus Ruecken und hohe Last fuehrt zu hohem Risiko und Rueckenmassnahme", () => {
  const state: AssessmentState = {
    activityId: "lifting",
    selectedRegions: ["back", "knees"],
    answers: {
      liftFrequency: "intense",
      loadWeight: "heavy",
      carryDistance: "long",
      assistTools: "none",
      focusRegion: "back",
    },
  };

  const result = evaluateAssessment(state);

  assert.equal(result.overallSeverity, "red");
  assert.ok(result.technologyMatches.some((technology) => technology.label === "Hebehilfe"));
  assert.ok(result.technologyMatches.some((technology) => technology.label === "Rücken-Exoskelett"));
  assert.ok(result.topContributions.some((entry) => entry.label === "hohes Lastgewicht"));
});

test("Stehen plus Beine/Fuesse fuehrt zu Stehhilfe oder Arbeitsplatzmassnahme", () => {
  const state: AssessmentState = {
    activityId: "standing",
    selectedRegions: ["legsFeet"],
    answers: {
      standingDuration: "constant",
      postureChange: "rare",
      floorCondition: "hard",
      seatOption: "missing",
      focusRegion: "legsFeet",
    },
  };

  const result = evaluateAssessment(state);

  assert.ok(["yellow", "red"].includes(result.overallSeverity));
  assert.ok(
    result.technologyMatches.some((technology) =>
      ["Stehhilfe", "Arbeitsplatzumbau"].includes(technology.label),
    ),
  );
  assert.equal(result.strongestRegion, "legsFeet");
});

test("Repetitive Bewegung plus Handgelenke fuehrt zu repetitivem Profil und ergonomischer oder organisatorischer Entlastung", () => {
  const state: AssessmentState = {
    activityId: "repetitive",
    selectedRegions: ["wrists"],
    answers: {
      repeatRate: "extreme",
      forceLevel: "high",
      linePace: "rigid",
      microBreaks: "missing",
      focusRegion: "wrists",
    },
  };

  const result = evaluateAssessment(state);

  assert.match(result.matchedProfile.title, /Repetitive Belastung/i);
  assert.ok(
    result.technologyMatches.some((technology) =>
      ["Ergonomische Werkzeuge", "Organisatorische Maßnahme"].includes(technology.label),
    ),
  );
  assert.ok(
    result.matchedProfile.technical.items.some((item) => item.includes("Ergonomische Werkzeuge")),
  );
});

test("Ueberkopf-Arbeit mit Schulter und Nacken fuehrt zu Schulter- oder Arm-Unterstuetzung", () => {
  const state: AssessmentState = {
    activityId: "overhead",
    selectedRegions: ["shoulders", "neck"],
    answers: {
      overheadDuration: "sustained",
      toolWeight: "heavy",
      recoveryBreaks: "poor",
      armSupport: "unsupported",
      focusRegion: "shoulders",
    },
  };

  const result = evaluateAssessment(state);

  assert.ok(["yellow", "red"].includes(result.overallSeverity));
  assert.ok(
    result.technologyMatches.some((technology) =>
      ["Schulter-/Arm-Unterstützung", "Werkzeugbalancer"].includes(technology.label),
    ),
  );
  assert.ok(result.topContributions.some((entry) => entry.label === "lange Überkopf-Dauer"));
});

// --- Edge case tests ---

test("empty state (no activity, no regions, no answers) returns green with fallback profile", () => {
  const state: AssessmentState = {
    activityId: null,
    selectedRegions: [],
    answers: {},
  };

  const result = evaluateAssessment(state);

  assert.equal(result.overallSeverity, "green");
  assert.equal(result.totalScore, 0);
  assert.equal(result.strongestRegion, "back");
  assert.ok(result.matchedProfile);
});

test("invalid focusRegion string is ignored safely", () => {
  const state: AssessmentState = {
    activityId: "lifting",
    selectedRegions: ["back"],
    answers: {
      focusRegion: "INVALID_REGION" as any,
      liftFrequency: "intense",
      loadWeight: "heavy",
      carryDistance: "long",
      assistTools: "none",
    },
  };

  const result = evaluateAssessment(state);

  assert.equal(result.strongestRegion, "back");
  assert.ok(result.totalScore > 0);
});

test("incomplete answers still produce a valid result", () => {
  const state: AssessmentState = {
    activityId: "lifting",
    selectedRegions: ["back"],
    answers: {
      liftFrequency: "intense",
    },
  };

  const result = evaluateAssessment(state);

  assert.ok(["green", "yellow", "red"].includes(result.overallSeverity));
  assert.ok(result.contributions.length >= 1);
});

test("region severities never produce negative scores", () => {
  const state: AssessmentState = {
    activityId: "standing",
    selectedRegions: [],
    answers: {},
  };

  const result = evaluateAssessment(state);

  for (const region of result.regionSeverities) {
    assert.ok(region.score >= 0, `Region ${region.regionId} has negative score: ${region.score}`);
  }
});

test("all region severities are valid severity values", () => {
  const state: AssessmentState = {
    activityId: "lifting",
    selectedRegions: ["back", "knees", "shoulders"],
    answers: {
      liftFrequency: "intense",
      loadWeight: "heavy",
      carryDistance: "long",
      assistTools: "none",
      focusRegion: "back",
    },
  };

  const result = evaluateAssessment(state);

  for (const region of result.regionSeverities) {
    assert.ok(
      ["green", "yellow", "red"].includes(region.severity),
      `Region ${region.regionId} has invalid severity: ${region.severity}`,
    );
  }
});

// --- Data integrity tests ---

test("all activity IDs in data match the ActivityId type", () => {
  const typeIds = new Set(ACTIVITY_IDS);
  for (const activity of activities) {
    assert.ok(typeIds.has(activity.id), `Activity "${activity.id}" is not a valid ActivityId`);
  }
});

test("all region IDs in data match the RegionId type", () => {
  const typeIds = new Set(REGION_IDS);
  for (const region of bodyRegions) {
    assert.ok(typeIds.has(region.id), `Region "${region.id}" is not a valid RegionId`);
  }
});

test("all question activityIds reference existing activities", () => {
  const activityIds = new Set(activities.map((a) => a.id));
  for (const question of questionCatalog) {
    for (const id of question.activityIds) {
      assert.ok(activityIds.has(id), `Question "${question.id}" references unknown activity "${id}"`);
    }
  }
});

test("all matching rule activities and regions reference valid IDs", () => {
  const activityIds = new Set(ACTIVITY_IDS);
  const regionIds = new Set(REGION_IDS);

  for (const rule of matchingRules) {
    for (const id of rule.activities) {
      assert.ok(activityIds.has(id), `Rule "${rule.id}" references unknown activity "${id}"`);
    }
    for (const id of rule.regions) {
      assert.ok(regionIds.has(id), `Rule "${rule.id}" references unknown region "${id}"`);
    }
  }
});

test("answerFilter question IDs in matching rules reference existing questions", () => {
  const questionIds = new Set(questionCatalog.map((q) => q.id));
  for (const rule of matchingRules) {
    if (!rule.answerFilters) continue;
    for (const qId of Object.keys(rule.answerFilters)) {
      assert.ok(questionIds.has(qId as any), `Rule "${rule.id}" filter references unknown question "${qId}"`);
    }
  }
});

test("answerFilter values in matching rules reference valid option values", () => {
  const optionsByQuestion = new Map<string, Set<string>>();
  for (const q of questionCatalog) {
    optionsByQuestion.set(q.id, new Set(q.options.map((o) => o.value)));
  }

  for (const rule of matchingRules) {
    if (!rule.answerFilters) continue;
    for (const [qId, acceptedValues] of Object.entries(rule.answerFilters)) {
      const validValues = optionsByQuestion.get(qId);
      if (!validValues) continue;
      for (const val of acceptedValues) {
        assert.ok(validValues.has(val), `Rule "${rule.id}" filter for "${qId}" references invalid value "${val}"`);
      }
    }
  }
});
