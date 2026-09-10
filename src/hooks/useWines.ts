import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { NewWine, Wine } from '../types/models';

export function useWines() {
  const { user } = useAuth();
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setWines([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setWines(data as Wine[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addWine = useCallback(
    async (wine: NewWine) => {
      if (!user) return { error: 'No hay sesión activa' };
      const { data, error } = await supabase
        .from('wines')
        .insert({ ...wine, user_id: user.id })
        .select()
        .single();
      if (!error) await refresh();
      return { data: data as Wine | null, error: error?.message ?? null };
    },
    [user, refresh]
  );

  const updateWine = useCallback(
    async (id: string, patch: Partial<Wine>) => {
      const { error } = await supabase.from('wines').update(patch).eq('id', id);
      if (!error) await refresh();
      return { error: error?.message ?? null };
    },
    [refresh]
  );

  const toggleFavorite = useCallback(
    async (id: string, favorito: boolean) => {
      // optimistic update so the heart flips instantly
      setWines((prev) => prev.map((w) => (w.id === id ? { ...w, favorito } : w)));
      const { error } = await supabase.from('wines').update({ favorito }).eq('id', id);
      if (error) await refresh(); // revert on failure by refetching
      return { error: error?.message ?? null };
    },
    [refresh]
  );

  const removeWine = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('wines').delete().eq('id', id);
      if (!error) await refresh();
      return { error: error?.message ?? null };
    },
    [refresh]
  );

  return { wines, loading, error, refresh, addWine, updateWine, toggleFavorite, removeWine };
}
