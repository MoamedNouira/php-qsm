import { Loader2, WifiOff, RefreshCw } from 'lucide-react';

interface StateScreenProps {
  variant: 'loading' | 'error';
  message?: string;
  onRetry?: () => void;
}

export function StateScreen({ variant, message, onRetry }: StateScreenProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-24 text-center animate-fade-in">
      {variant === 'loading' ? (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-brand-400" />
          <h2 className="mt-6 text-lg font-semibold text-white">
            Chargement des questions…
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Récupération du dataset depuis la base de données.
          </p>
        </>
      ) : (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-bad-500/30 bg-bad-500/10">
            <WifiOff className="h-8 w-8 text-bad-400" />
          </div>
          <h2 className="mt-6 text-lg font-semibold text-white">
            Impossible de charger les questions
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {message ?? 'Vérifiez votre connexion réseau puis réessayez.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-primary mt-6"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </button>
          )}
        </>
      )}
    </div>
  );
}
