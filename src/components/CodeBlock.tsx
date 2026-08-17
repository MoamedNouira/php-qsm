import { useMemo, useState } from 'react';
import { tokenize, TOKEN_CLASS } from '@/lib/highlight';
import { Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  label?: string;
}

export function CodeBlock({ code, label }: CodeBlockProps) {
  const tokens = useMemo(() => tokenize(code), [code]);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-ink-700 bg-[#0a0f1c]">
      <div className="flex items-center justify-between border-b border-ink-700/60 bg-ink-900/60 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          {label && (
            <span className="ml-3 font-mono text-[11px] uppercase tracking-wider text-slate-500">
              {label}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-slate-400 transition-colors hover:bg-ink-700/50 hover:text-slate-200"
          aria-label="Copier le code"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? 'Copié' : 'Copier'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>
          {tokens.map((t, idx) => (
            <span key={idx} className={TOKEN_CLASS[t.type]}>
              {t.value}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
