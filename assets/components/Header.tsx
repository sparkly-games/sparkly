import { GlitchText } from "./GlitchText";
import React from "react";
import { styles } from "../constants/Theme"; // Import C for dynamic logic
import { View, Text } from "react-native";

const Header = ({ vibe, verDisplay }: any) => {
  // Logic for the version string
  const isDev = typeof window !== 'undefined' && localStorage.getItem('sparkly_branch') === 'devpatch';

  return (
    <View style={styles.hero}>

      {/* Status Badge */}
      <View style={styles.heroBadge}>
        <Text style={styles.heroBadgeText}>● {verDisplay} ●</Text>
      </View>

      {/* Main Branding */}
      <View style={styles.titleWrap}>
        {/* Glow sits behind the text */}
        <View style={[styles.heroGlow, { opacity: 0.4 }]} />
        <GlitchText style={styles.heroTitle}>sparkly</GlitchText>
      </View>
    </View>
  );
};

export { Header };