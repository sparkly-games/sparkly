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
      .filter((g: { horror: any; }) => (showHorror || !g.horror))
      .filter((g: { pc: any; }) => (showPC || !g.pc))
      .filter((g: { genre: any; }) => activeGenre === 'all' || g.genre === activeGenre)
      .filter((g: { title: { en: any; }; }) => {
        if (!q) return true;
        return (g.title?.en ?? '').toLowerCase().includes(q);
      })
      .sort((a: { title: { en: any; }; }, b: { title: { en: any; }; }) =>
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