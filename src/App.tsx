import { useCallback, useEffect, useRef, useState } from 'react';
import type { AnswerRecord, Phase, Question, QuizResult } from '@/types';
import { useQuestions } from '@/hooks/useQuestions';
import { buildResult } from '@/lib/quiz';
import { ConfigScreen } from '@/components/ConfigScreen';
import { StateScreen } from '@/components/StateScreen';
import { QuestionView } from '@/components/QuestionView';
import { ProgressHeader } from '@/components/ProgressHeader';
import { ResultScreen } from '@/components/ResultScreen';
import { ReviewScreen } from '@/components/ReviewScreen';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const { state, retry } = useQuestions();

  const [phase, setPhase] = useState<Phase>('config');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Timer management
  useEffect(() => {
    if (phase === 'quiz') {
      timerRef.current = window.setInterval(() => {
        setElapsedSec((s) => s + 1);
      }, 1000);
      return () => {
        if (timerRef.current) window.clearInterval(timerRef.current);
      };
    }
    return;
  }, [phase]);

  const handleStart = useCallback(
    (category: string) => {
      if (state.status !== 'success') return;
      const pool =
        category === 'all'
          ? state.questions
          : state.questions.filter((q) => q.category === category);
      if (pool.length === 0) return;
      setSelectedCategory(category);
      setQuizQuestions(shuffle(pool));
      setCurrentIdx(0);
      setAnswers([]);
      setElapsedSec(0);
      setResult(null);
      setPhase('quiz');
    },
    [state]
  );

  const handleAnswer = useCallback(
    (selectedKey: string) => {
      const q = quizQuestions[currentIdx];
      if (!q) return;
      const rec: AnswerRecord = {
        question: q,
        selectedKey,
        correct: selectedKey === q.correct_key,
      };
      setAnswers((prev) => {
        const copy = [...prev];
        copy[currentIdx] = rec;
        return copy;
      });
    },
    [quizQuestions, currentIdx]
  );

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= quizQuestions.length) {
      // Compute final result
      const finalAnswers = answers.filter(Boolean);
      let correct = 0;
      let incorrect = 0;
      let skipped = 0;
      for (const a of finalAnswers) {
        if (a.correct) correct++;
        else incorrect++;
      }
      skipped = quizQuestions.length - finalAnswers.length;
      const res = buildResult(
        quizQuestions.length,
        correct,
        incorrect,
        skipped,
        elapsedSec,
        finalAnswers
      );
      setResult(res);
      setPhase('result');
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }, [currentIdx, quizQuestions, answers, elapsedSec]);

  const handleQuit = useCallback(() => {
    setPhase('config');
    setQuizQuestions([]);
    setAnswers([]);
    setResult(null);
    setElapsedSec(0);
  }, []);

  const handleRestart = useCallback(() => {
    handleStart(selectedCategory);
  }, [handleStart, selectedCategory]);

  const handleReview = useCallback(() => setPhase('review'), []);
  const handleBackToResult = useCallback(() => setPhase('result'), []);
  const handleHome = useCallback(() => {
    setPhase('config');
    setResult(null);
  }, []);

  // Render
  const showHeader = phase === 'quiz';

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundDecor />

      {showHeader && (
        <ProgressHeader
          current={currentIdx + 1}
          total={quizQuestions.length}
          elapsedSec={elapsedSec}
          category={
            selectedCategory === 'all'
              ? 'Tous les sujets'
              : selectedCategory
          }
          onQuit={handleQuit}
        />
      )}

      <main className="relative z-10">
        {phase === 'config' &&
          (state.status === 'idle' || state.status === 'loading' ? (
            <StateScreen variant="loading" />
          ) : state.status === 'error' ? (
            <StateScreen
              variant="error"
              message={state.message}
              onRetry={retry}
            />
          ) : (
            <ConfigScreen
              categories={state.categories}
              onStart={handleStart}
              totalQuestions={state.questions.length}
            />
          ))}

        {phase === 'quiz' && quizQuestions.length > 0 && (
          <QuestionView
            key={quizQuestions[currentIdx].id}
            question={quizQuestions[currentIdx]}
            index={currentIdx}
            total={quizQuestions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isLast={currentIdx + 1 === quizQuestions.length}
          />
        )}

        {phase === 'result' && result && (
          <ResultScreen
            result={result}
            onReview={handleReview}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}

        {phase === 'review' && result && (
          <ReviewScreen
            answers={result.answers}
            onBack={handleBackToResult}
            onHome={handleHome}
          />
        )}
      </main>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-brand-600/15 blur-[120px]" />
      <div className="absolute -top-20 right-0 h-[380px] w-[380px] rounded-full bg-accent-500/10 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-brand-500/10 blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
