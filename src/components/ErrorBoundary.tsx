import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('uncaught_react_error', {
      message: error.message,
      stack: info.componentStack?.slice(0, 500),
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-bad-500/30 bg-bad-500/10">
            <AlertTriangle className="h-8 w-8 text-bad-400" />
          </div>
          <h1 className="mt-6 text-xl font-bold text-white">
            Une erreur inattendue s'est produite
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            {this.state.error?.message ?? 'Erreur inconnue'}
          </p>
          <button onClick={this.handleReset} className="btn-primary mt-6">
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
