import { useMemo } from 'react';

export function useFilteredGames({
  games,
  query,
  showPC,
  showHorror,
  activeGenre,
}: any) {
  return useMemo(() => {
    const q = query?.trim().toLowerCase();

    return games
      .filter(g => (showHorror || !g.horror))
      .filter(g => (showPC || !g.pc))
      .filter(g => activeGenre === 'all' || g.genre === activeGenre)
      .filter(g => {
        if (!q) return true;
        return (g.title?.en ?? '').toLowerCase().includes(q);
      })
      .sort((a, b) =>
        (a.title?.en ?? '').localeCompare(b.title?.en ?? '')
      );
  }, [
    games,
    query,
    showPC,
    showHorror,
    activeGenre,
  ]);
}