import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'sparkly:recent';

export function useRecentGames() {
  const [recent, setRecent] =
    useLocalStorage<string[]>(STORAGE_KEY, []);

  const addRecentGame = useCallback((title: string) => {
    setRecent(prev =>
      [title, ...prev.filter(r => r !== title)].slice(0, 15)
    );
  }, []);

  return {
    recent,
    addRecentGame,
  };
}