import React, { memo, useRef } from "react";
import { Animated, TouchableOpacity, Text } from 'react-native';
import { styles } from "../constants/Theme";

// --- ANIMATED PILL ---
export const FilterPill = memo(({ item, active, onPress }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    onPress(item.id);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={[
          styles.pill,
          active && { backgroundColor: item.color + '22', borderColor: item.color },
        ]}
      >
        <Text style={[styles.pillText, active && { color: item.color }]}>{item.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});