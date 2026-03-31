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
} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { router } from 'expo-router';
import Head from 'expo-router/head';

import { SELLING_POINTS } from '@/assets/data/selling';
import { gameIcons as icons } from '@/assets/data/GameIcons';

// Helper: shuffle array
const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5);

export default function Home() {
  const HERO_GAMES = React.useMemo(() => shuffle(Object.keys(icons())), []);
  const LOOP_GAMES = [...HERO_GAMES, ...HERO_GAMES];

  const { width } = useWindowDimensions();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  useEffect(() => {
    // floating badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // smooth looping scroll
    Animated.loop(
      Animated.sequence([
        Animated.timing(scrollAnim, {
          toValue: -1200,
          duration: 25000,
          useNativeDriver: true,
        }),
        Animated.timing(scrollAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const getCardWidth = () => {
    if (isMobile) return '100%';
    if (isTablet) return '47%';
    return '31%';
  };

  return (
    <View style={styles.root}>
      <Head>
        <title>Sparkly Games</title>
      </Head>

      <StatusBar style="light" />

      {/* Background Glow */}
      <View style={styles.backgroundGlow1} />
      <View style={styles.backgroundGlow2} />

      {/* Background Scroller */}
      <View style={styles.heroBackground}>
        <Animated.View
          style={[
            styles.gameScroller,
            { transform: [{ translateY: scrollAnim }] },
          ]}
        >
          <View style={styles.grid}>
            {LOOP_GAMES.map((img, i) => {
              const source = icons()[img];
              if (!source) return null;
              return <Image key={i} source={source} style={styles.heroGame} />;
            })}
          </View>
        </Animated.View>
        <View style={styles.heroFade} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.brand}>
            <Image source={{ uri: '/favicon.ico' }} style={styles.logo} />
            <Text style={[styles.brandText, styles.gradientText]}>
              Sparkly
            </Text>
          </View>

          {!isMobile && (
            <View style={styles.nav}>
              <Text
                style={styles.navItemMuted}
                onPress={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/docs';
                  }
                }}
              >
                Docs
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Animated.View
            style={[
              styles.versionBadge,
              { transform: [{ translateY: floatAnim }] },
            ]}
          >
            <View style={styles.pingDot} />
            <Text style={styles.badgeText}>v7 is live!</Text>
          </Animated.View>

          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            <Text style={styles.gradientText}>Game Here</Text>{'\n'}
            Anytime, Anywhere
          </Text>

          <Text style={styles.subtitle}>
            Dive into the ultimate collection of unblocked web games.
            No ads, no downloads—just instant fun.
          </Text>

          <View style={[styles.heroButtons, isMobile && styles.heroButtonsMobile]}>
            <Pressable
              style={[styles.primaryButton, isMobile && styles.fullWidth]}
              onPress={() => router.push('/play')}
            >
              <Text style={styles.primaryText}>Play Now →</Text>
            </Pressable>
          </View>
        </View>

        {/* Features Section */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.features}>
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

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <View style={styles.footerBrand}>
            <Image source={{ uri: '/favicon.ico' }} style={styles.footerLogo} />
            <Text style={styles.footerLabel}>SPARKLY ECOSYSTEM</Text>
          </View>
          <Text style={styles.footerText}>
            Open Source © 2026 Sparkly Games. Keep shining.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scroll: { paddingTop: 100, paddingBottom: 60 },

  backgroundGlow1: {
    position: 'absolute',
    top: -200,
    left: -150,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    ...(Platform.OS === 'web' && { filter: 'blur(160px)' }),
  },
  backgroundGlow2: {
    position: 'absolute',
    bottom: -200,
    right: -150,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    ...(Platform.OS === 'web' && { filter: 'blur(160px)' }),
  },

  heroBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    opacity: 0.75,
    zIndex: -1,
  },
  gameScroller: { flexDirection: 'column', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  heroGame: {
    width: '18vh',
    height: '10vh',
    aspectRatio: 1.6,
    borderRadius: 16,
    margin: 8,
    opacity: 1,
    ...(Platform.OS === 'web' && { filter: 'blur(2px)' }),
  },
  heroFade: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(2, 6, 23, 0.75)',
  },

  header: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    borderBottomWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(20px)' }),
  },
  headerInner: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 32, height: 32, marginRight: 12 },
  brandText: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  gradientText: {
    color: '#60a5fa',
    ...(Platform.OS === 'web' && {
      backgroundImage: 'linear-gradient(90deg, #60a5fa, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }),
  },
  nav: { flexDirection: 'row' },
  navItemMuted: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  hero: { paddingHorizontal: 24, alignItems: 'center', marginTop: 60 },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    marginBottom: 32,
  },
  pingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3b82f6', marginRight: 8 },
  badgeText: { color: '#93c5fd', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },

  title: { fontSize: 80, fontWeight: '900', color: '#fff', textAlign: 'center', lineHeight: 86, letterSpacing: -3, marginBottom: 24 },
  titleMobile: { fontSize: 42, lineHeight: 48 },
  subtitle: { fontSize: 18, color: '#94a3b8', textAlign: 'center', maxWidth: 600, lineHeight: 28, marginBottom: 48 },

  heroButtons: { flexDirection: 'row' },
  heroButtonsMobile: { flexDirection: 'column', width: '100%' },
  fullWidth: { width: '100%', alignItems: 'center' },
  primaryButton: { backgroundColor: '#2563eb', paddingHorizontal: 32, paddingVertical: 18, borderRadius: 20 },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  features: { maxWidth: 1200, alignSelf: 'center', width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 100 },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.4)', borderRadius: 32, padding: 32, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.1)', margin: 10, overflow: 'hidden' },
  cardHover: { transform: [{ translateY: -6 }], borderColor: 'rgba(96, 165, 250, 0.5)' },
  cardGlow: { position: 'absolute', top: -50, right: -50, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(37, 99, 235, 0.1)', ...(Platform.OS === 'web' && { filter: 'blur(40px)' }) },
  iconCircle: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(37, 99, 235, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emoji: { fontSize: 24 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 12 },
  cardText: { fontSize: 15, color: '#94a3b8', lineHeight: 22 },

  footer: { marginTop: 120, alignItems: 'center', paddingHorizontal: 24 },
  footerDivider: { width: 200, height: 1, backgroundColor: 'rgba(59, 130, 246, 0.2)', marginBottom: 30 },
  footerBrand: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, opacity: 0.5 },
  footerLogo: { width: 20, height: 20, tintColor: '#3b82f6', marginRight: 12 },
  footerLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  footerText: { color: '#475569', fontSize: 12 },
});