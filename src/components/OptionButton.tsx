import { Check, X } from 'lucide-react';
import type { QuestionOption } from '@/types';
import { CodeBlock } from './CodeBlock';

interface OptionButtonProps {
  option: QuestionOption;
  index: number;
  state: 'idle' | 'selected' | 'correct' | 'incorrect' | 'disabled';
  onClick: () => void;
  disabled: boolean;
}

const KEY_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function OptionButton({
  option,
  index,
  state,
  onClick,
  disabled,
}: OptionButtonProps) {
  const isCode = option.text.includes('\n') || /(^|\s)(class|function|public|SELECT|UPDATE|INSERT|<\w)/.test(option.text);

  const base =
    'group relative flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200';

  const styles: Record<OptionButtonProps['state'], string> = {
    idle: 'border-ink-700 bg-ink-850/60 hover:border-brand-500/50 hover:bg-ink-800/70 cursor-pointer',
    selected: 'border-brand-500 bg-brand-500/10 cursor-pointer',
    correct: 'border-ok-500/70 bg-ok-500/10 cursor-default',
    incorrect: 'border-bad-500/70 bg-bad-500/10 cursor-default',
    disabled: 'border-ink-700 bg-ink-850/40 opacity-70 cursor-default',
  };

  const keyBadgeStyles: Record<OptionButtonProps['state'], string> = {
    idle: 'border-ink-600 bg-ink-800 text-slate-300 group-hover:border-brand-400 group-hover:text-brand-200',
    selected: 'border-brand-400 bg-brand-500/20 text-brand-100',
    correct: 'border-ok-500 bg-ok-500/20 text-ok-400',
    incorrect: 'border-bad-500 bg-bad-500/20 text-bad-400',
    disabled: 'border-ink-600 bg-ink-800 text-slate-400',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[state]}`}
    >
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold ${keyBadgeStyles[state]}`}
      >
        {state === 'correct' ? (
          <Check className="h-4 w-4" />
        ) : state === 'incorrect' ? (
          <X className="h-4 w-4" />
        ) : (
          KEY_LABELS[index] ?? option.key
        )}
      </span>
      <span className="min-w-0 flex-1 text-sm leading-relaxed text-slate-200">
        {isCode && option.text.includes('\n') ? (
          <CodeBlock code={option.text} />
        ) : (
          option.text
        )}
      </span>
    </button>
  );
}
