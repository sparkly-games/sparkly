import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Animated } from 'react-native';

export function useImageFallback(
  primaryImage: string,
  fallbackImage?: string
) {
  const [img, setImg] = useState(primaryImage);
  const [loaded, setLoaded] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setImg(primaryImage);
    setLoaded(false);
    opacity.setValue(0);
  }, [primaryImage]);

  const handleLoad = useCallback(() => {
    setLoaded(true);

    Animated.timing(opacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const handleError = useCallback(() => {
    if (fallbackImage && img !== fallbackImage) {
      setImg(fallbackImage);
    }
  }, [fallbackImage, img]);

  return {
    img,
    loaded,
    handleLoad,
    handleError,

    fadeStyle: {
      opacity,
    },
  };
}