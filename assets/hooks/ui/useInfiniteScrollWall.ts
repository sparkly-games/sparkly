import {
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { Animated, Easing } from 'react-native';

interface UseInfiniteScrollWallOptions {
  enabled?: boolean;
  duration?: number;
  distance?: number;
}

export function useInfiniteScrollWall({
  enabled = true,
  duration = 24000,
  distance = 1200,
}: UseInfiniteScrollWallOptions = {}) {
  const translateX = useRef(
    new Animated.Value(0)
  ).current;

  const opacity = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  useEffect(() => {
    if (!enabled) return;

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -distance,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    enabled,
    duration,
    distance,
    translateX,
  ]);

  const scrollStyle = useMemo(
    () => ({
      transform: [{ translateX }],
    }),
    [translateX]
  );

  const opacityStyle = useMemo(
    () => ({ opacity }),
    [opacity]
  );

  return {
    scrollStyle,
    opacityStyle,
  };
}