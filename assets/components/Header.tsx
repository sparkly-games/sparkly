import { GlitchText } from "./GlitchText";
import React from "react";
import { styles, C } from "../constants/Theme";
import { StatChip, ControlIcon } from "./Wrappers";
import { router } from "expo-router";
import { Linking, View, Text } from "react-native";

const Header = ({vibe, gamesData, favorites, recent, showPC, showHorror, setShowPC, setShowHorror, VER_INFO}: any) => {
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

      <View style={styles.statsRow}>
        <StatChip value={gamesData.length} label="games" />
        <View style={styles.statDivider} />
        <StatChip value={favorites.length} label="saved" />
        <View style={styles.statDivider} />
        <StatChip value={recent.length} label="played" />
      </View>

      {/* NAV ICONS */}
      <View style={[styles.sectionHeader]}>
        <Text style={styles.sectionLabel}>MEDIA</Text>
        <View style={styles.navRow}>
          <ControlIcon name="logo-youtube" onPress={() => router.push('/media/youtube')} label="Videos" />
          <ControlIcon name="logo-soundcloud" onPress={() => Linking.openURL('https://soundcloak.instatunnel.my')} label="Music" />
          <ControlIcon name="volume-high" onPress={() => Linking.openURL('/soundboard.htm')} label="Sounds" />
          <ControlIcon name="tv-outline" onPress={() => router.push('/system/soon/a9f3k2x8')} label="TV" />
        </View>
      </View>

      <View style={[styles.sectionHeader]}>
        <Text style={styles.sectionLabel}>FILTERS</Text>

        <View style={styles.navRow}>
          <ControlIcon name="desktop-outline" active={showPC} color="#60a5fa" onPress={() => setShowPC(p => !p)} label="PC" />
          <ControlIcon name="skull-outline" active={showHorror} color={C.hot} onPress={() => setShowHorror(p => !p)} label="Horror" />
        </View>
      </View>

      <Text style={styles.verText}>
        {`v${VER_INFO.text} · ${typeof window !== 'undefined' && localStorage.getItem('sparkly_branch') === 'devpatch' ? VER_INFO.patch : VER_INFO.date}`}
      </Text>
    </View>
  )
}

export { Header };