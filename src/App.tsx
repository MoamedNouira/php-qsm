import { useMemo } from 'react';
import type { Phase } from '@/types';
import { useQuestions } from '@/hooks/useQuestions';
import { useQuizReducer } from '@/hooks/useQuizReducer';
import { ConfigScreen } from '@/components/ConfigScreen';
import { StateScreen } from '@/components/StateScreen';
import { QuestionView } from '@/components/QuestionView';
import { ProgressHeader } from '@/components/ProgressHeader';
import { ResultScreen } from '@/components/ResultScreen';
import { ReviewScreen } from '@/components/ReviewScreen';

export default function App() {
  const { state: fetchState, retry } = useQuestions();
  const { state: quiz, actions } = useQuizReducer();

  const handleStart = useMemo(() => {
    if (fetchState.status !== 'success') return undefined;
    return (category: string) =>
      actions.start(fetchState.questions, category);
  }, [fetchState, actions]);

  const handleRestart = useMemo(() => {
    if (fetchState.status !== 'success') return undefined;
    return () => actions.restart(fetchState.questions, quiz.selectedCategory);
  }, [fetchState, actions, quiz.selectedCategory]);

  const showHeader = quiz.phase === 'quiz';
  const mappedPhase: Phase =
    fetchState.status === 'loading' || fetchState.status === 'idle'
      ? 'loading'
      : fetchState.status === 'error'
        ? 'error'
        : quiz.phase;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundDecor />

      {showHeader && (
        <ProgressHeader
          current={quiz.currentIdx + 1}
          total={quiz.quizQuestions.length}
          elapsedSec={quiz.elapsedSec}
          category={
            quiz.selectedCategory === 'all'
              ? 'Tous les sujets'
              : quiz.selectedCategory
          }
          onQuit={actions.quit}
        />
      )}

      <main className="relative z-10">
        {mappedPhase === 'config' && (
          <>
            {(fetchState.status === 'idle' || fetchState.status === 'loading') && (
              <StateScreen variant="loading" />
            )}
            {fetchState.status === 'error' && (
              <StateScreen
                variant="error"
                message={fetchState.message}
                onRetry={retry}
              />
            )}
            {fetchState.status === 'success' && handleStart && (
              <ConfigScreen
                categories={fetchState.categories}
                onStart={handleStart}
                totalQuestions={fetchState.questions.length}
              />
            )}
          </>
        )}

        {mappedPhase === 'loading' && fetchState.status === 'loading' && (
          <StateScreen variant="loading" />
        )}

        {mappedPhase === 'error' && fetchState.status === 'error' && (
          <StateScreen
            variant="error"
            message={fetchState.message}
            onRetry={retry}
          />
        )}

        {quiz.phase === 'quiz' && quiz.quizQuestions.length > 0 && (
          <QuestionView
            key={quiz.quizQuestions[quiz.currentIdx].id}
            question={quiz.quizQuestions[quiz.currentIdx]}
            index={quiz.currentIdx}
            total={quiz.quizQuestions.length}
            onAnswer={actions.answer}
            onNext={actions.next}
            isLast={quiz.currentIdx + 1 === quiz.quizQuestions.length}
          />
        )}

        {quiz.phase === 'result' && quiz.result && (
          <ResultScreen
            result={quiz.result}
            onReview={actions.review}
            onRestart={handleRestart ?? (() => {})}
            onHome={actions.home}
          />
        )}

        {quiz.phase === 'review' && quiz.result && (
          <ReviewScreen
            answers={quiz.result.answers}
            onBack={actions.back}
            onHome={actions.home}
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
