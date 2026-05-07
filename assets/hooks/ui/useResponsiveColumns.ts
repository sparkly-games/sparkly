import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export function useResponsiveColumns() {
  const { width } = useWindowDimensions();

  const columns = useMemo(() => {
    if (width < 480) return 2;
    if (width < 768) return 4;
    if (width < 1100) return 6;
    if (width < 1400) return 8;

    return 10;
  }, [width]);

  const itemWidth = useMemo(
    () => (width - 32) / columns,
    [width, columns]
  );

  return {
    width,
    columns,
    itemWidth,
  };
}