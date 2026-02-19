import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface FlipDigitProps {
  value: number;
}

export const FlipDigit: React.FC<FlipDigitProps> = ({ value }) => {
  const [prev, setPrev] = useState(value);
  const [anim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (prev !== value) {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start(() => setPrev(value));
    }
  }, [value]);

  const rotateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.digitBackground}>
        <Text style={styles.digit}>{prev}</Text>
      </View>
      <Animated.View style={[styles.flip, { transform: [{ rotateX }] }]}>
        <Text style={styles.digit}>{value}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 60, height: 90, margin: 2, perspective: 1000 },
  digitBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flip: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digit: {
    fontSize: 64,
    fontWeight: '900',
    color: '#60a5fa',
  },
});
