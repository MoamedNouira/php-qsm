import { useState } from 'react';
import { Lightbulb, ChevronRight, AlertCircle } from 'lucide-react';
import type { Question } from '@/types';
import { CodeBlock } from './CodeBlock';
import { OptionButton } from './OptionButton';

interface QuestionViewProps {
  question: Question;
  index: number;
  total: number;
  onAnswer: (selectedKey: string) => void;
  onNext: () => void;
  isLast: boolean;
}

type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'disabled';

export function QuestionView({
  question,
  index,
  total,
  onAnswer,
  onNext,
  isLast,
}: QuestionViewProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (key: string) => {
    if (revealed) return;
    setSelectedKey(key);
    setRevealed(true);
    onAnswer(key);
  };

  const stateFor = (key: string): OptionState => {
    if (!revealed) return key === selectedKey ? 'selected' : 'idle';
    if (key === question.correct_key) return 'correct';
    if (key === selectedKey) return 'incorrect';
    return 'disabled';
  };

  const isCorrect = selectedKey === question.correct_key;
  const isSkipped = selectedKey === null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-6 sm:px-6 sm:pt-10">
      {/* Category tag + counter */}
      <div className="flex items-center gap-3 animate-fade-in">
        <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-300">
          {question.category}
        </span>
        <span className="font-mono text-xs text-slate-500">
          Question {index + 1} / {total}
        </span>
      </div>

      {/* Question text */}
      <h2 className="mt-4 text-xl font-bold leading-snug text-white animate-slide-up sm:text-2xl">
        {question.question}
      </h2>

      {/* Code snippet */}
      {question.code_snippet && (
        <div className="mt-5 animate-slide-up">
          <CodeBlock code={question.code_snippet} label="snippet" />
        </div>
      )}

      {/* Options */}
      <div className="mt-6 space-y-3">
        {question.options.map((opt, i) => (
          <div key={opt.key} className="animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
            <OptionButton
              option={opt}
              index={i}
              state={stateFor(opt.key)}
              onClick={() => handleSelect(opt.key)}
              disabled={revealed}
            />
          </div>
        ))}
      </div>

      {/* Feedback + explanation */}
      {revealed && (
        <div className="mt-6 animate-slide-up">
          <div
            className={`flex items-center gap-2 rounded-xl border p-3 ${
              isCorrect
                ? 'border-ok-500/40 bg-ok-500/10 text-ok-400'
                : 'border-bad-500/40 bg-bad-500/10 text-bad-400'
            }`}
          >
            {isCorrect ? (
              <>
                <Lightbulb className="h-5 w-5" />
                <span className="text-sm font-semibold">
                  Bonne réponse !
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-semibold">
                  {isSkipped
                    ? 'Temps écoulé — question non répondue.'
                    : `Réponse incorrecte. La bonne réponse est ${question.correct_key}.`}
                </span>
              </>
            )}
          </div>

          <div className="card mt-3 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-ink-700/60 bg-ink-900/40 px-4 py-2.5">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Explication Technique
              </span>
            </div>
            <p className="px-4 py-4 text-sm leading-relaxed text-slate-300">
              {question.explanation}
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                onNext();
                setSelectedKey(null);
                setRevealed(false);
              }}
              className="btn-primary"
            >
              {isLast ? 'Voir les résultats' : 'Question suivante'}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
