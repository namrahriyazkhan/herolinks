import { GolfScore } from "@/types";

export interface ScoreValidationResult {
  valid: boolean;
  error?: string;
}

export const MIN_STABLEFORD_SCORE = 1;
export const MAX_STABLEFORD_SCORE = 45;
export const MAX_RETAINED_SCORES = 5;

/**
 * Validate a score submission according to PRD section § 05.
 * - Score range: 1–45 (Stableford format)
 * - Must include a date
 * - Only one score entry is permitted per date (duplicate dates rejected for new scores)
 */
export function validateGolfScoreInput(
  score: number,
  playedDate: string,
  existingScores: GolfScore[],
  editingScoreId?: string
): ScoreValidationResult {
  if (typeof score !== "number" || isNaN(score)) {
    return { valid: false, error: "Please enter a valid numeric score." };
  }

  if (score < MIN_STABLEFORD_SCORE || score > MAX_STABLEFORD_SCORE) {
    return {
      valid: false,
      error: `Stableford score must be between ${MIN_STABLEFORD_SCORE} and ${MAX_STABLEFORD_SCORE}.`,
    };
  }

  if (!playedDate || !playedDate.trim()) {
    return { valid: false, error: "Each score must include a date." };
  }

  // Prevent future dates beyond today
  const entryDate = new Date(playedDate);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (entryDate > today) {
    return { valid: false, error: "Score date cannot be in the future." };
  }

  // Duplicate date check: Only one score permitted per date
  const dateExists = existingScores.some(
    (s) => s.played_date === playedDate && s.id !== editingScoreId
  );

  if (dateExists) {
    return {
      valid: false,
      error:
        "Only one score entry is permitted per date. Duplicate scores for the same date are not allowed — please edit or delete the existing entry.",
    };
  }

  return { valid: true };
}

/**
 * Applies the PRD rolling 5-score logic:
 * - Sorts scores in reverse chronological order (most recent date first)
 * - Automatically retains only the latest 5 scores
 * - Drops older scores when a 6th is added
 */
export function applyRollingFiveScores(
  currentScores: GolfScore[],
  newOrUpdatedScore: GolfScore
): { updatedScores: GolfScore[]; droppedScore?: GolfScore } {
  // Check if updating existing
  const existingIndex = currentScores.findIndex((s) => s.id === newOrUpdatedScore.id);
  let updatedList: GolfScore[];

  if (existingIndex >= 0) {
    updatedList = [...currentScores];
    updatedList[existingIndex] = newOrUpdatedScore;
  } else {
    updatedList = [...currentScores, newOrUpdatedScore];
  }

  // Sort in reverse chronological order (most recent date first)
  updatedList.sort((a, b) => new Date(b.played_date).getTime() - new Date(a.played_date).getTime());

  let droppedScore: GolfScore | undefined;
  if (updatedList.length > MAX_RETAINED_SCORES) {
    // Keep only the first 5 (the most recent ones), the ones after index 4 are dropped
    droppedScore = updatedList[MAX_RETAINED_SCORES]; // the oldest of the newly ranked list
    updatedList = updatedList.slice(0, MAX_RETAINED_SCORES);
  }

  return { updatedScores: updatedList, droppedScore };
}

/**
 * Stableford score metrics summary
 */
export function calculateScoreMetrics(scores: GolfScore[]) {
  if (!scores.length) {
    return {
      average: 0,
      highest: 0,
      lowest: 0,
      count: 0,
      readiness: "0/5 scores logged",
      isDrawEligible: false,
    };
  }

  const numericScores = scores.map((s) => s.score);
  const sum = numericScores.reduce((acc, curr) => acc + curr, 0);
  const average = Math.round((sum / numericScores.length) * 10) / 10;
  const highest = Math.max(...numericScores);
  const lowest = Math.min(...numericScores);

  return {
    average,
    highest,
    lowest,
    count: scores.length,
    readiness: `${scores.length}/5 scores logged`,
    isDrawEligible: scores.length === 5,
  };
}
