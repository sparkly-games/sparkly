import {
  useEffect,
  useRef,
  useState,
} from 'react';

interface UseGlitchOptions {
  chance?: number;
  interval?: number;
  duration?: number;
}

export function useGlitch(
  options: UseGlitchOptions = {}
) {
  const {
    chance = 0.06,
    interval = 400,
    duration = 120,
  } = options;

  const [glitch, setGlitch] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() < chance) {
        setGlitch(true);

        timeoutRef.current = setTimeout(() => {
          setGlitch(false);
        }, duration);
      }
    }, interval);

    return () => {
      clearInterval(timer);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    chance,
    interval,
    duration,
  ]);

  return {
    glitch,
  };
}