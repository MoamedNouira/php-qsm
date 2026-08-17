import { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Check,
  X,
  Lightbulb,
} from 'lucide-react';
import type { AnswerRecord } from '@/types';
import { CodeBlock } from './CodeBlock';

interface ReviewScreenProps {
  answers: AnswerRecord[];
  onBack: () => void;
  onHome: () => void;
}

export function ReviewScreen({ answers, onBack, onHome }: ReviewScreenProps) {
  const errors = answers.filter((a) => !a.correct);
  const [expanded, setExpanded] = useState<number | null>(errors[0]?.question.id ?? null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex items-center justify-between animate-fade-in">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux résultats
        </button>
        <button
          onClick={onHome}
          className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          Accueil
        </button>
      </div>

      <div className="mt-6 animate-slide-up">
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
          Revoir mes erreurs
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {errors.length} question{errors.length > 1 ? 's' : ''} à revoir.
          Développez chaque question pour voir votre réponse, la bonne réponse
          et l'explication technique.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {errors.map((rec, idx) => {
          const q = rec.question;
          const isOpen = expanded === q.id;
          return (
            <div
              key={q.id}
              className="card overflow-hidden animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : q.id)}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-ink-800/40"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-bad-500/40 bg-bad-500/10 text-bad-400">
                  <X className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-brand-300">
                    {q.category}
                  </span>
                  <p className="mt-0.5 text-sm font-semibold text-slate-200">
                    {q.question}
                  </p>
                </div>
                <ChevronDown
                  className={`mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-ink-700/60 px-4 pb-4 pt-3">
                  {q.code_snippet && (
                    <div className="mb-4">
                      <CodeBlock code={q.code_snippet} label="snippet" />
                    </div>
                  )}

                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isCorrect = opt.key === q.correct_key;
                      const isUserWrong = opt.key === rec.selectedKey && !isCorrect;
                      const cls = isCorrect
                        ? 'border-ok-500/50 bg-ok-500/10'
                        : isUserWrong
                        ? 'border-bad-500/50 bg-bad-500/10'
                        : 'border-ink-700 bg-ink-850/40 opacity-60';
                      return (
                        <div
                          key={opt.key}
                          className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${cls}`}
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[11px] font-bold">
                            {isCorrect ? (
                              <Check className="h-3.5 w-3.5 text-ok-400" />
                            ) : isUserWrong ? (
                              <X className="h-3.5 w-3.5 text-bad-400" />
                            ) : (
                              <span className="text-slate-500">{opt.key}</span>
                            )}
                          </span>
                          <span className="text-slate-300">{opt.text}</span>
                          {isUserWrong && (
                            <span className="ml-auto whitespace-nowrap rounded bg-bad-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-bad-400">
                              Votre réponse
                            </span>
                          )}
                          {isCorrect && (
                            <span className="ml-auto whitespace-nowrap rounded bg-ok-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-ok-400">
                              Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-ink-700/60 bg-ink-900/40 p-3">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <p className="text-sm leading-relaxed text-slate-300">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
