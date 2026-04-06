import React, { useMemo } from 'react';
import { Image, ImageProps, ImageSourcePropType } from 'react-native';

type ChaosImageProps = ImageProps & {
  bazinga: boolean;
  source: ImageSourcePropType;
};

const CHAOS: ImageSourcePropType[] = [
  require('@/assets/images/chaos/1.jpg'),
  require('@/assets/images/chaos/2.jpg'),
  require('@/assets/images/chaos/3.jpg'),
  require('@/assets/images/chaos/4.jpg'),
  require('@/assets/images/chaos/5.webp'),
  require('@/assets/images/chaos/6.jpg'),
  require('@/assets/images/chaos/7.jpg'),
  require('@/assets/images/chaos/8.webp'),
];

const DOG = require('@/assets/images/dog.jpeg');
const BLUE = require('@/assets/images/blue.jpeg');

export const ChaosImage = ({ bazinga, source, ...rest }: ChaosImageProps) => {
  const finalSource = useMemo(() => {
    if (!bazinga) return source;

    if (Math.floor(Math.random() * 500) === 0) return DOG;
    if (Math.floor(Math.random() * 1000) === 0) return BLUE;

    const index = Math.floor(Math.random() * CHAOS.length);
    return CHAOS[index];
  }, [bazinga]);

  return <Image {...rest} source={finalSource} />;
};
