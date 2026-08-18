import { useCallback, useEffect, useRef, useReducer } from 'react';
import type { AnswerRecord, Question, QuizResult } from '@/types';
import { buildResult } from '@/lib/quiz';
import { logger } from '@/lib/logger';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface QuizState {
  phase: 'config' | 'quiz' | 'result' | 'review';
  selectedCategory: string;
  quizQuestions: Question[];
  currentIdx: number;
  answers: AnswerRecord[];
  result: QuizResult | null;
  elapsedSec: number;
}

export type QuizAction =
  | { type: 'START'; questions: Question[]; category: string }
  | { type: 'ANSWER'; selectedKey: string }
  | { type: 'NEXT' }
  | { type: 'TICK' }
  | { type: 'QUIT' }
  | { type: 'REVIEW' }
  | { type: 'BACK' }
  | { type: 'HOME' };

const initialState: QuizState = {
  phase: 'config',
  selectedCategory: 'all',
  quizQuestions: [],
  currentIdx: 0,
  answers: [],
  result: null,
  elapsedSec: 0,
};

function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START': {
      const pool =
        action.category === 'all'
          ? action.questions
          : action.questions.filter((q) => q.category === action.category);
      if (pool.length === 0) return state;
      return {
        ...state,
        phase: 'quiz',
        selectedCategory: action.category,
        quizQuestions: shuffle(pool),
        currentIdx: 0,
        answers: [],
        result: null,
        elapsedSec: 0,
      };
    }
    case 'ANSWER': {
      const q = state.quizQuestions[state.currentIdx];
      if (!q) return state;
      const rec: AnswerRecord = {
        question: q,
        selectedKey: action.selectedKey,
        correct: action.selectedKey === q.correct_key,
      };
      const answers = [...state.answers];
      answers[state.currentIdx] = rec;
      return { ...state, answers };
    }
    case 'NEXT': {
      const nextIdx = state.currentIdx + 1;
      if (nextIdx >= state.quizQuestions.length) {
        const finalAnswers = state.answers.filter(Boolean);
        let correct = 0;
        let incorrect = 0;
        for (const a of finalAnswers) {
          if (a.correct) correct++;
          else incorrect++;
        }
        const skipped = state.quizQuestions.length - finalAnswers.length;
        const result = buildResult(
          state.quizQuestions.length,
          correct,
          incorrect,
          skipped,
          state.elapsedSec,
          finalAnswers
        );
        return { ...state, phase: 'result', result };
      }
      return { ...state, currentIdx: nextIdx };
    }
    case 'TICK':
      return { ...state, elapsedSec: state.elapsedSec + 1 };
    case 'QUIT':
      return { ...initialState };
    case 'REVIEW':
      return { ...state, phase: 'review' };
    case 'BACK':
      return { ...state, phase: 'result' };
    case 'HOME':
      return { ...initialState };
    default:
      return state;
  }
}

export function useQuizReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    dispatch({ type: 'TICK' });
    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(
    (questions: Question[], category: string) => {
      stopTimer();
      dispatch({ type: 'START', questions, category });
      startTimer();
      const count =
        category === 'all'
          ? questions.length
          : questions.filter((q) => q.category === category).length;
      logger.info('quiz_started', { category, questionCount: count });
    },
    [stopTimer, startTimer]
  );

  const answer = useCallback(
    (selectedKey: string) => {
      dispatch({ type: 'ANSWER', selectedKey });
    },
    []
  );

  const next = useCallback(() => {
    if (state.phase !== 'quiz') return;
    const isLast = state.currentIdx + 1 >= state.quizQuestions.length;
    if (isLast) {
      stopTimer();
      const finalAnswers = state.answers.filter(Boolean);
      let correct = 0;
      for (const a of finalAnswers) {
        if (a.correct) correct++;
      }
      const total = state.quizQuestions.length;
      const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
      logger.info('quiz_completed', {
        total,
        correct,
        incorrect: finalAnswers.length - correct,
        skipped: total - finalAnswers.length,
        percentage,
        elapsedSec: state.elapsedSec,
      });
    }
    dispatch({ type: 'NEXT' });
  }, [state, stopTimer]);

  const quit = useCallback(() => {
    stopTimer();
    dispatch({ type: 'QUIT' });
  }, [stopTimer]);

  const review = useCallback(() => dispatch({ type: 'REVIEW' }), []);
  const back = useCallback(() => dispatch({ type: 'BACK' }), []);
  const home = useCallback(() => {
    stopTimer();
    dispatch({ type: 'HOME' });
  }, [stopTimer]);

  const restart = useCallback(
    (questions: Question[], category: string) => {
      stopTimer();
      dispatch({ type: 'START', questions, category });
      startTimer();
    },
    [stopTimer, startTimer]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    state,
    actions: { start, answer, next, quit, review, back, home, restart },
  };
}
