import { useEffect, useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(key);

      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch (err) {
      console.error(`Failed to load ${key}`, err);
    }
  }, [key]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Failed to save ${key}`, err);
    }
  }, [key, value]);

  return [value, setValue] as const;
}