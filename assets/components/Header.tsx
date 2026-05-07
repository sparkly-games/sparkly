import { GlitchText } from "./GlitchText";
import React from "react";
import { styles } from "../constants/Theme";
import { View, Text } from "react-native";

const Header = ({vibe, VER_INFO}: any) => {
  return (
    <View style={styles.hero}>
      <View style={styles.heroBgGlow} />
      <View style={styles.heroGrid} />
      <View style={styles.heroBadge}>
        <Text style={styles.heroBadgeText}>LIVE</Text>
      </View>
      <View style={styles.titleWrap}>
        <GlitchText style={styles.heroTitle}>SPARKLY</GlitchText>
        <View style={styles.heroGlow} />
      </View>

      <Text style={styles.heroVibe}>{vibe}</Text>

      <Text style={styles.verText}>
        {`v${VER_INFO.text} · ${typeof window !== 'undefined' && localStorage.getItem('sparkly_branch') === 'devpatch' ? VER_INFO.patch : VER_INFO.date}`}
      </Text>
    </View>
  )
}

export { Header };