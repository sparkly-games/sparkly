import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Animated,
  useWindowDimensions,
  Platform,
  Linking,
  FlatList,
} from 'react-native';
import React, { useRef, useEffect, useState, useMemo, memo } from 'react';
import { router } from 'expo-router';
import Head from 'expo-router/head';

import { SELLING_POINTS } from '@/assets/data/selling';
import { gameIcons as icons } from '@/assets/data/GameIcons';

const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5);

// Memoized Game Item to prevent re-render lag during animation
const GameItem = memo(({ iconName }: { iconName: string }) => {
  const source = icons()[iconName];
  if (!source) return null;
  return <Image source={source} style={styles.heroGame} />;
});

export default function Home() {
  const { width } = useWindowDimensions();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Layout Constants
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  // Data Memoization
  const HERO_GAMES = useMemo(() => shuffle(Object.keys(icons())), []);
  const LOOP_GAMES = useMemo(() => [...HERO_GAMES, ...HERO_GAMES], [HERO_GAMES]);

  // Animations
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Floating Badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 2500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    ).start();

    // 2. Smooth Background Loop
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -1200,
        duration: 35000, // Slowed down slightly for better UX
        useNativeDriver: true,
      })
    ).start();

    // 3. Page Fade In
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const getCardWidth = () => {
    if (isMobile) return '100%';
    if (isTablet) return '46%';
    return '30%';
  };

  const openLink = (url: string) => Linking.openURL(url);

  return (
    <View style={styles.root}>
      <Head>
        <title>Sparkly Games | Play Unblocked</title>
      </Head>

      <StatusBar style="light" />

      {/* --- BACKGROUND LAYER --- */}
      <View style={styles.backgroundGlow1} />
      <View style={styles.backgroundGlow2} />

      <View style={styles.heroBackground}>
        <Animated.View style={{ transform: [{ translateY: scrollAnim }] }}>
          <FlatList
            data={LOOP_GAMES}
            keyExtractor={(item, index) => `game-${item}-${index}`}
            renderItem={({ item }) => <GameItem iconName={item} />}
            numColumns={isMobile ? 3 : 6}
            scrollEnabled={false}
            removeClippedSubviews={Platform.OS !== 'web'} // Optimization
          />
        </Animated.View>
        <View style={styles.heroFade} />
      </View>

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Pressable onPress={() => router.replace('/')} style={styles.brand}>
            <Image source={{ uri: '/favicon.ico' }} style={styles.logo} />
            <Text style={[styles.brandText, styles.gradientText]}>Sparkly</Text>
          </Pressable>

          {!isMobile && (
            <View style={styles.nav}>
              <Pressable onPress={() => openLink('/docs')}>
                <Text style={styles.navItemMuted}>Docs</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* --- HERO SECTION --- */}
        <View style={styles.hero}>
          <Animated.View style={[styles.versionBadge, { transform: [{ translateY: floatAnim }] }]}>
            <View style={styles.pingDot} />
            <Text style={styles.badgeText}>v7 is live!</Text>
          </Animated.View>

          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            <Text style={styles.gradientText}>Game Here</Text>
            {'\n'}Anytime, Anywhere
          </Text>

          <Text style={styles.subtitle}>
            Dive into the ultimate collection of unblocked web games.{'\n'}
            No ads, no downloads—just instant fun.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              isMobile && styles.fullWidth,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => router.push('/play')}
          >
            <Text style={styles.primaryText}>Play Now →</Text>
          </Pressable>
        </View>

        {/* --- FEATURES SECTION --- */}
        <Animated.View style={[styles.featuresContainer, { opacity: fadeAnim }]}>
          <View style={styles.featuresGrid}>
            {SELLING_POINTS.map((point, index) => (
              <Pressable
                key={index}
                onHoverIn={() => setHoveredIndex(index)}
                onHoverOut={() => setHoveredIndex(null)}
                style={[
                  styles.card,
                  { width: getCardWidth() },
                  hoveredIndex === index && styles.cardHover,
                ]}
              >
                <View style={styles.cardGlow} />
                <View style={styles.iconCircle}>
                  <Text style={styles.emoji}>{point.emoji}</Text>
                </View>
                <Text style={styles.cardTitle}>{point.title}</Text>
                <Text style={styles.cardText}>{point.text}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* --- FOOTER --- */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <View style={styles.footerBrand}>
            <Image source={{ uri: '/favicon.ico' }} style={styles.footerLogo} />
            <Text style={styles.footerLabel}>SPARKLY ECOSYSTEM</Text>
          </View>
          
          <View style={styles.footerLinks}>
            <Pressable onPress={() => openLink('/policies/privacy/index.htm')}>
              <Text style={styles.footerLinkText}>Privacy Policy</Text>
            </Pressable>
            <Text style={styles.footerText}> • </Text>
            <Pressable onPress={() => console.log('Show Preferences')}>
              <Text style={styles.footerLinkText}>Consent Preferences</Text>
            </Pressable>
          </View>

          <Text style={styles.footerText}>Open Source © 2026 Sparkly Games. Keep shining.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scroll: { paddingTop: 140, paddingBottom: 60 },

  // Background Visuals
  backgroundGlow1: {
    position: 'absolute',
    top: -200,
    left: -150,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    ...(Platform.OS === 'web' && { filter: 'blur(120px)' }),
  },
  backgroundGlow2: {
    position: 'absolute',
    bottom: -200,
    right: -150,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    ...(Platform.OS === 'web' && { filter: 'blur(120px)' }),
  },
  heroBackground: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    opacity: 0.4,
    zIndex: -1,
  },
  heroGame: {
    width: 140,
    height: 85,
    borderRadius: 12,
    margin: 8,
    backgroundColor: '#1e293b',
    ...(Platform.OS === 'web' && { filter: 'blur(1px)' }),
  },
  heroFade: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
  },

  // Header
  header: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    borderBottomWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(12px)' }),
  },
  headerInner: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 28, height: 28, marginRight: 10 },
  brandText: { fontSize: 22, fontWeight: '900' },
  gradientText: {
    color: '#60a5fa',
    ...(Platform.OS === 'web' && {
      backgroundImage: 'linear-gradient(90deg, #60a5fa, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }),
  },
  navItemMuted: { color: '#94a3b8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },

  // Hero
  hero: { paddingHorizontal: 24, alignItems: 'center' },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    marginBottom: 24,
  },
  pingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3b82f6', marginRight: 8 },
  badgeText: { color: '#93c5fd', fontSize: 11, fontWeight: '800' },
  title: { fontSize: 72, fontWeight: '900', color: '#fff', textAlign: 'center', lineHeight: 78, letterSpacing: -2, marginBottom: 20 },
  titleMobile: { fontSize: 42, lineHeight: 46 },
  subtitle: { fontSize: 18, color: '#94a3b8', textAlign: 'center', maxWidth: 550, lineHeight: 26, marginBottom: 40 },
  primaryButton: { backgroundColor: '#2563eb', paddingHorizontal: 40, paddingVertical: 18, borderRadius: 16, shadowColor: '#2563eb', shadowOpacity: 0.3, shadowRadius: 20 },
  primaryText: { color: '#fff', fontSize: 17, fontWeight: '900' },

  // Features
  featuresContainer: { marginTop: 80, width: '100%', alignItems: 'center' },
  featuresGrid: { maxWidth: 1200, width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 10 },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.3)', borderRadius: 24, padding: 28, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.08)', margin: 8, overflow: 'hidden' },
  cardHover: { transform: [{ translateY: -5 }], borderColor: 'rgba(96, 165, 250, 0.3)', backgroundColor: 'rgba(30, 41, 59, 0.5)' },
  cardGlow: { position: 'absolute', top: -40, right: -40, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(37, 99, 235, 0.05)', ...(Platform.OS === 'web' && { filter: 'blur(30px)' }) },
  iconCircle: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(37, 99, 235, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emoji: { fontSize: 20 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#94a3b8', lineHeight: 20 },

  // Footer
  footer: { marginTop: 100, alignItems: 'center', paddingBottom: 40 },
  footerDivider: { width: 100, height: 1, backgroundColor: 'rgba(59, 130, 246, 0.2)', marginBottom: 24 },
  footerBrand: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, opacity: 0.6 },
  footerLogo: { width: 18, height: 18, marginRight: 10, tintColor: '#3b82f6' },
  footerLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  footerLinks: { flexDirection: 'row', marginBottom: 12 },
  footerLinkText: { color: '#64748b', fontSize: 13 },
  footerText: { color: '#475569', fontSize: 12 },
  fullWidth: { width: '90%' },
});