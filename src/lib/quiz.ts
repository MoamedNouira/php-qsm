import type { QuizResult, SeniorityBand } from '@/types';

export function computeSeniority(percentage: number): SeniorityBand {
  if (percentage >= 90) return 'Expert';
  if (percentage >= 75) return 'Senior';
  if (percentage >= 55) return 'Confirmé';
  if (percentage >= 35) return 'Intermédiaire';
  return 'Junior';
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function buildResult(
  total: number,
  correct: number,
  incorrect: number,
  skipped: number,
  timeSpentSec: number,
  answers: QuizResult['answers']
): QuizResult {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  return {
    total,
    correct,
    incorrect,
    skipped,
    timeSpentSec,
    seniority: computeSeniority(percentage),
    answers,
  };
}
