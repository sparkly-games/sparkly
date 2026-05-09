import { GlitchText } from "./GlitchText";
import React from "react";
import { styles, C } from "../constants/Theme"; // Import C for dynamic logic
import { View, Text } from "react-native";

const Header = ({ vibe, VER_INFO }: any) => {
  // Logic for the version string
  const isDev = typeof window !== 'undefined' && localStorage.getItem('sparkly_branch') === 'devpatch';
  const verDisplay = `v${VER_INFO.text} · ${isDev ? VER_INFO.patch : VER_INFO.date}`;

  return (
    <View style={styles.hero}>
      {/* Background Elements */}
      <View style={styles.heroBgGlow} />
      <View style={styles.heroGrid} />

      {/* Status Badge */}
      <View style={styles.heroBadge}>
        <Text style={styles.heroBadgeText}>● LIVE</Text>
      </View>

      {/* Main Branding */}
      <View style={styles.titleWrap}>
        {/* Glow sits behind the text */}
        <View style={[styles.heroGlow, { opacity: 0.4 }]} />
        <GlitchText style={styles.heroTitle}>SPARKLY</GlitchText>
      </View>

      {/* Vibe & Versioning */}
      <Text style={styles.heroVibe}>{vibe.toLowerCase()}</Text>

      <View style={styles.statsRow}>
        <View style={styles.vPipe} />
        <Text style={styles.verText}>{verDisplay}</Text>
        <View style={styles.vPipe} />
      </View>
    </View>
  );
};

export { Header };