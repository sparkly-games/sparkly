import React, { useEffect, useState } from "react";
import {View,Text} from "react-native"

export const GlitchText = ({ children, style }) => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance to glitch
      if (Math.random() < 0.06) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 120); // glitch lasts 120ms
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  if (!glitch) return <Text style={style}>{children}</Text>;

  // When glitching, render 3 overlapping layers slightly offset
  return (
    <View style={{ position: 'relative', overflow: 'visible' }}>
      <Text
        style={[
          style,
          { position: 'absolute', left: -2, top: 0, color: '#f472b6', opacity: 0.7 },
        ]}
      >
        {children}
      </Text>
      <Text
        style={[
          style,
          { position: 'absolute', left: 3, top: 0, color: '#facc15', opacity: 0.7 },
        ]}
      >
        {children}
      </Text>
      <Text style={[style, { color: '#60a5fa' }]}>
        {children}
      </Text>
    </View>
  );
};