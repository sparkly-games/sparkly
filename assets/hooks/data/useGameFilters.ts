import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'sparkly:filters';

export function useGameFilters() {
  const [filters, setFilters] = useLocalStorage(
    STORAGE_KEY,
    {
      showPC: false,
      showHorror: false,
      activeGenre: 'all',
    }
  );

  return {
    ...filters,

    setShowPC: (value: boolean) =>
      setFilters(prev => ({ ...prev, showPC: value })),

    setShowHorror: (value: boolean) =>
      setFilters(prev => ({ ...prev, showHorror: value })),

    setActiveGenre: (genre: string) =>
      setFilters(prev => ({ ...prev, activeGenre: genre })),
  };
}