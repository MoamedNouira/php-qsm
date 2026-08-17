import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fallbackQuestions } from '@/lib/fallbackQuestions';
import type { Question } from '@/types';

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; questions: Question[]; categories: string[] }
  | { status: 'error'; message: string };

export function useQuestions() {
  const [state, setState] = useState<FetchState>({ status: 'idle' });

  const fetchQuestions = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const hasSupabaseConfig =
        Boolean(import.meta.env.VITE_SUPABASE_URL) &&
        Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) &&
        import.meta.env.VITE_SUPABASE_ANON_KEY !== 'PASTE_YOUR_ANON_KEY_HERE';

      if (!hasSupabaseConfig || !supabase) {
        const categories = Array.from(
          new Set(fallbackQuestions.map((q) => q.category))
        ).sort((a, b) => a.localeCompare(b));

        setState({ status: 'success', questions: fallbackQuestions, categories });
        return;
      }

      const { data, error } = await supabase
        .from('questions')
        .select('id, category, question, code_snippet, options, correct_key, explanation')
        .order('id', { ascending: true });

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) {
        throw new Error('Aucune question disponible pour le moment.');
      }

      const questions = data as Question[];
      const categories = Array.from(
        new Set(questions.map((q) => q.category))
      ).sort((a, b) => a.localeCompare(b));

      setState({ status: 'success', questions, categories });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erreur réseau inconnue.';
      setState({ status: 'error', message });
    }
  }, []);

  useEffect(() => {
    void fetchQuestions();
  }, [fetchQuestions]);

  return { state, retry: fetchQuestions };
}
