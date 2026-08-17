import { Clock } from 'lucide-react';
import { formatTime } from '@/lib/quiz';

interface ProgressHeaderProps {
  current: number; // 1-indexed
  total: number;
  elapsedSec: number;
  category: string;
  onQuit: () => void;
}

export function ProgressHeader({
  current,
  total,
  elapsedSec,
  category,
  onQuit,
}: ProgressHeaderProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="sticky top-0 z-30 border-b border-ink-700/60 bg-ink-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-lg font-bold text-white">
                {String(current).padStart(2, '0')}
              </span>
              <span className="font-mono text-sm text-slate-500">/ {total}</span>
            </div>
            <span className="hidden rounded-full border border-ink-700 bg-ink-850 px-2.5 py-0.5 text-[11px] font-medium text-slate-400 sm:inline">
              {category}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-sm tabular-nums text-slate-300">
              <Clock className="h-4 w-4 text-brand-400" />
              {formatTime(elapsedSec)}
            </div>
            <button
              onClick={onQuit}
              className="rounded-lg border border-ink-700 px-2.5 py-1 text-[11px] font-medium text-slate-400 transition-colors hover:border-bad-500/50 hover:text-bad-400"
            >
              Quitter
            </button>
          </div>
        </div>

        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
