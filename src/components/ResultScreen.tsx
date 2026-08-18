import {
  Trophy,
  Target,
  RotateCcw,
  Eye,
  Home,
  TrendingUp,
} from 'lucide-react';
import type { QuizResult } from '@/types';

interface ResultScreenProps {
  result: QuizResult;
  onReview: () => void;
  onRestart: () => void;
  onHome: () => void;
}

const SENIORITY_COLOR: Record<string, string> = {
  'Expert': 'from-accent-400 to-ok-500 text-accent-400',
  'Senior': 'from-brand-400 to-accent-400 text-brand-300',
  'Confirmé': 'from-brand-400 to-brand-600 text-brand-300',
  'Intermédiaire': 'from-amber-400 to-amber-600 text-amber-400',
  'Junior': 'from-rose-400 to-rose-600 text-rose-400',
};

export function ResultScreen({
  result,
  onReview,
  onRestart,
  onHome,
}: ResultScreenProps) {
  const percentage =
    result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
  const hasErrors = result.incorrect + result.skipped > 0;
  const seniorityStyle = SENIORITY_COLOR[result.seniority] ?? SENIORITY_COLOR['Confirmé'];

  // Donut math
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center animate-fade-in">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
          <Trophy className="h-8 w-8 text-amber-400" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Résultats de l'évaluation
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Analyse de votre performance et niveau de séniorité estimé.
        </p>
      </div>

      {/* Score donut */}
      <div className="mt-10 flex flex-col items-center animate-slide-up">
        <div className="relative h-36 w-36">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#16203a"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b66ff" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-white tabular-nums">
              {percentage}
              <span className="text-xl text-slate-400">%</span>
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-500">
              Score
            </span>
          </div>
        </div>

        {/* Seniority band */}
        <div className="mt-6 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">Niveau estimé :</span>
          <span
            className={`bg-gradient-to-r bg-clip-text text-base font-bold ${seniorityStyle.split(' ').slice(-1)[0]
              }`}
          >
            {result.seniority}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-8 grid grid-cols-2 gap-3 animate-slide-up sm:grid-cols-3">
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Correctes"
          value={String(result.correct)}
          tone="ok"
        />
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Incorrectes"
          value={String(result.incorrect)}
          tone="bad"
        />
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Ignorées"
          value={String(result.skipped)}
          tone="muted"
        />
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col gap-3 animate-slide-up sm:flex-row">
        {hasErrors && (
          <button onClick={onReview} className="btn-ghost flex-1">
            <Eye className="h-4 w-4" />
            Revoir mes erreurs
          </button>
        )}
        <button onClick={onRestart} className="btn-primary flex-1">
          <RotateCcw className="h-4 w-4" />
          Recommencer
        </button>
        <button onClick={onHome} className="btn-ghost">
          <Home className="h-4 w-4" />
          Accueil
        </button>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'ok' | 'bad' | 'muted' | 'brand';
}) {
  const tones = {
    ok: 'border-ok-500/30 bg-ok-500/5 text-ok-400',
    bad: 'border-bad-500/30 bg-bad-500/5 text-bad-400',
    muted: 'border-ink-700 bg-ink-850/40 text-slate-400',
    brand: 'border-brand-500/30 bg-brand-500/5 text-brand-300',
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider opacity-80">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 font-mono text-2xl font-bold text-white">
        {value}
      </div>
    </div>
  );
}
