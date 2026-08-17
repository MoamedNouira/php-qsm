export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id: number;
  category: string;
  question: string;
  code_snippet: string | null;
  options: QuestionOption[];
  correct_key: string;
  explanation: string;
}

export interface QuizConfig {
  category: string; // 'all' or a specific category name
}

export interface AnswerRecord {
  question: Question;
  selectedKey: string | null; // null = skipped / time-out
  correct: boolean;
}

export type Phase = 'config' | 'loading' | 'quiz' | 'result' | 'review' | 'error';

export interface QuizResult {
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  timeSpentSec: number;
  seniority: SeniorityBand;
  answers: AnswerRecord[];
}

export type SeniorityBand = 'Junior' | 'Intermédiaire' | 'Confirmé' | 'Senior' | 'Expert';
