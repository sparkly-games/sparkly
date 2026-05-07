import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'sparkly:favs';

export function useFavorites() {
  const [favorites, setFavorites] =
    useLocalStorage<string[]>(STORAGE_KEY, []);

  const toggleFavorite = useCallback((title: string) => {
    setFavorites(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [title, ...prev]
    );
  }, []);

  return {
    favorites,
    toggleFavorite,
  };
}