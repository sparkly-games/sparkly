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
import React, { useRef, useEffect } from 'react';
import { router } from 'expo-router';
import Head from 'expo-router/head';

// Pulling data from the external source
import { SELLING_POINTS } from '@/assets/data/selling';

export default function Home() {
  const { width } = useWindowDimensions();
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Responsive Breakpoints
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
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
  }, []);

  // Calculate card width based on screen size
  const getCardWidth = () => {
    if (isMobile) return '100%';
    if (isTablet) return '47%'; // 2 columns with gap
    return '31%'; // 3 columns with gap
  };

  return (
    <View style={styles.root}>
      <Head>
        <title>Sparkly Games</title>
      </Head>
      <StatusBar style="light" />

      {/* Sticky Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.brand}>
            <Image source={{ uri: '/favicon.ico' }} style={styles.logo} />
            <Text style={[styles.brandText, styles.gradientText]}>Sparkly</Text>
          </View>

          {!isMobile && (
            <View style={styles.nav}>
              <Text style={styles.navItemMuted} onPress={() => {window.location.href = '/docs'}}>Docs</Text>
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
            <Text style={styles.badgeText}>Version 7 out now!</Text>
          </Animated.View>

          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            ENDLESS BOREDOM{'\n'}
            <Text style={styles.gradientText}>STOPS HERE</Text>
          </Text>

          <Text style={styles.subtitle}>
            Experience the best, hand-picked web games, all in one place. 
            With no in-game ads, just pure, uninterrupted fun.
          </Text>

          <View style={[styles.heroButtons, isMobile && styles.heroButtonsMobile]}>
            <Pressable
              style={[styles.primaryButton, isMobile && styles.fullWidth]}
              onPress={() => router.push('/play')}
            >
              <Text style={styles.primaryText}>KILL THE BOREDOM →</Text>
            </Pressable>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.features}>
          {SELLING_POINTS.map((point, index) => (
            <View 
              key={index} 
              style={[
                styles.card, 
                { width: getCardWidth() }
              ]}
            >
              <View style={styles.cardGlow} />
              <View style={styles.iconCircle}>
                <Text style={styles.emoji}>{point.emoji}</Text>
              </View>
              <Text style={styles.cardTitle}>{point.title}</Text>
              <Text style={styles.cardText}>{point.text}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
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
  root: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scroll: {
    paddingTop: 100,
    paddingBottom: 60,
  },
  header: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    borderBottomWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    ...Platform.select({
      web: { backdropFilter: 'blur(20px)' } as any,
    }),
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
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 32,
    height: 32,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  gradientText: {
    color: '#60a5fa',
    ...Platform.select({
      web: {
        backgroundImage: 'linear-gradient(90deg, #60a5fa, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      } as any,
    }),
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  navItemMuted: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  navButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  navButtonText: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '800',
  },
  hero: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 60,
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    marginBottom: 32,
  },
  pingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  badgeText: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 72,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 78,
    letterSpacing: -2,
    marginBottom: 24,
  },
  titleMobile: {
    fontSize: 42,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 28,
    marginBottom: 48,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  heroButtonsMobile: {
    flexDirection: 'column',
    width: '100%',
  },
  fullWidth: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  secondaryText: {
    color: '#93c5fd',
    fontSize: 16,
    fontWeight: '700',
  },
  features: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    paddingHorizontal: 24,
    marginTop: 100,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    ...Platform.select({
      web: { filter: 'blur(40px)' } as any,
    }),
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
  },
  footer: {
    marginTop: 120,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    opacity: 0.5,
  },
  footerLogo: {
    width: 20,
    height: 20,
    tintColor: '#3b82f6',
  },
  footerLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  footerText: {
    color: '#475569',
    fontSize: 12,
  },
});