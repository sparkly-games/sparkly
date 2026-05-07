import { useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';

export function useTooltipAnimation() {
  const [visible, setVisible] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  const show = useCallback(() => {
    setVisible(true);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),

      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),

      Animated.timing(translateY, {
        toValue: 8,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setVisible(false);
      }
    });
  }, [opacity, translateY]);

  return {
    visible,
    show,
    hide,

    animatedStyle: {
      opacity,
      transform: [{ translateY }],
    },
  };
}