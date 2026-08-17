import { useState } from 'react';
import {
  Brain,
  Code2,
  Database,
  ShieldCheck,
  TestTube,
  Layers,
  Rocket,
  ChevronRight,
} from 'lucide-react';

interface ConfigScreenProps {
  categories: string[];
  onStart: (category: string) => void;
  totalQuestions: number;
}

const CATEGORY_ICONS: Record<string, typeof Code2> = {
  'PHP / OO': Code2,
  'Symfony': Layers,
  'SQL & Bases de données': Database,
  'HTML5 & Web APIs': ShieldCheck,
  'Testing & Qualité': TestTube,
  'Software Architecture': Rocket,
};

const CATEGORY_DESC: Record<string, string> = {
  'PHP / OO': 'PHP 8+, readonly, enums, fibers, attributes, WeakMap',
  'Symfony': 'DI, CompilerPass, Messenger, Workflow, Security',
  'SQL & Bases de données': 'Indexing, MVCC, deadlocks, isolation, tuning',
  'HTML5 & Web APIs': 'CORS, XSS, WebSockets, SSE, HTTP/2-3',
  'Testing & Qualité': 'PHPUnit, mocks, PHPStan, couverture',
  'Software Architecture': 'Microservices, DDD, event-driven, API gateway',
};

export function ConfigScreen({
  categories,
  onStart,
  totalQuestions,
}: ConfigScreenProps) {
  const [selected, setSelected] = useState<string>('all');

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Hero */}
      <div className="animate-fade-in text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-500/30 bg-brand-500/10 shadow-glow">
          <Brain className="h-8 w-8 text-brand-400" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Quiz d'Entretien — <span className="text-brand-400">PHP Senior</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Préparez-vous aux entretiens techniques back-end : PHP 8+, Symfony,
          SQL avancé, architecture logicielle. Questions à choix multiples avec
          explications techniques approfondies.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px]">
          <Badge>{totalQuestions} questions</Badge>
          <Badge>5 choix par question</Badge>
          <Badge>Mode chronométré</Badge>
          <Badge>Explications détaillées</Badge>
        </div>
      </div>

      {/* Category selection */}
      <div className="mt-10 animate-slide-up">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
          <span className="h-4 w-1 rounded-full bg-brand-500" />
          Choisissez un sujet
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <CategoryCard
            active={selected === 'all'}
            onClick={() => setSelected('all')}
            icon={Brain}
            title="Tous les sujets"
            desc={`Évaluation complète sur les ${totalQuestions} questions`}
            count={totalQuestions}
          />
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] ?? Code2;
            return (
              <CategoryCard
                key={cat}
                active={selected === cat}
                onClick={() => setSelected(cat)}
                icon={Icon}
                title={cat}
                desc={CATEGORY_DESC[cat] ?? ''}
                count={null}
              />
            );
          })}
        </div>
      </div>

      {/* Start */}
      <div className="mt-10 flex flex-col items-center gap-3 animate-slide-up">
        <button
          onClick={() => onStart(selected)}
          className="btn-primary group w-full justify-center px-8 py-4 text-base sm:w-auto"
        >
          Démarrer l'évaluation
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>
        <p className="text-[11px] text-slate-500">
          Une seule réponse correcte par question. Le chrono démarre au lancement.
        </p>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-ink-700 bg-ink-850 px-3 py-1 font-medium text-slate-300">
      {children}
    </span>
  );
}

interface CategoryCardProps {
  active: boolean;
  onClick: () => void;
  icon: typeof Code2;
  title: string;
  desc: string;
  count: number | null;
}

function CategoryCard({
  active,
  onClick,
  icon: Icon,
  title,
  desc,
  count,
}: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
        active
          ? 'border-brand-500 bg-brand-500/10 shadow-glow'
          : 'border-ink-700 bg-ink-850/60 hover:border-ink-600 hover:bg-ink-800/70'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
          active
            ? 'border-brand-400/50 bg-brand-500/20 text-brand-300'
            : 'border-ink-700 bg-ink-800 text-slate-400 group-hover:text-slate-200'
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={`text-sm font-semibold ${
              active ? 'text-white' : 'text-slate-200'
            }`}
          >
            {title}
          </h3>
          {count !== null && (
            <span className="rounded-full bg-ink-700 px-2 py-0.5 font-mono text-[10px] text-slate-400">
              {count}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{desc}</p>
      </div>
      {active && (
        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white">
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      )}
    </button>
  );
}

