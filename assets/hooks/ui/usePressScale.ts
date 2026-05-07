import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

interface UsePressScaleOptions {
  pressedScale?: number;
  pressDuration?: number;
  releaseDuration?: number;
}

export function usePressScale(
  options: UsePressScaleOptions = {}
) {
  const {
    pressedScale = 0.94,
    pressDuration = 70,
    releaseDuration = 120,
  } = options;

  const scale = useRef(new Animated.Value(1)).current;

  const animatePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: pressedScale,
        duration: pressDuration,
        useNativeDriver: true,
      }),

      Animated.timing(scale, {
        toValue: 1,
        duration: releaseDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    scale,
    pressedScale,
    pressDuration,
    releaseDuration,
  ]);

  return {
    scale,
    animatePress,

    animatedStyle: {
      transform: [{ scale }],
    },
  };
}