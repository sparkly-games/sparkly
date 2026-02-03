import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Animated,
} from 'react-native';
import React, { useRef, useEffect } from 'react';
import { router } from 'expo-router';
import Head from 'expo-router/head';

export default function Home() {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, []);

  return (
    <View style={styles.root}>
      <Head>
          <title>Sparkly Games</title>
      </Head>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.brand}>
            <Image source={{ uri: '/favicon.ico' }} style={styles.logo} />
            <Text style={[styles.brandText, styles.gradientText]}>
              Sparkly Games
            </Text>
          </View>

            <View style={{width: 15}} />

          <View style={styles.nav}>
            <Text style={[styles.navItem, styles.navMuted]} onPress={() => { if(window.location.hostname !== "localhost") window.location.href = '/docs'; else {window.location.href = 'http://localhost:3000/docs'} }}>Docs</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero */}
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

          <Text style={styles.title}>
            EMBRACE THE{'\n'}
            <Text style={styles.gradientText}>GAMER WITHIN</Text>
          </Text>

          <Text style={styles.subtitle}>
            Experience the next generation of social gaming. Built for creators,
            players, and dreamers alike. Dive into a universe where every game
            is a new adventure.
          </Text>

          <View style={styles.buttons}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push('/play')}
            >
              <Text style={styles.primaryText}>START PLAYING →</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => window.location.href = '/sparkly-dev'}
            >
              <Text style={styles.secondaryText}>sparkly.dev</Text>
            </Pressable>
          </View>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.card}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.cardTitle}>Pure Polish</Text>
            <Text style={styles.cardText}>
              Every frame and interaction is tuned for maximum satisfaction.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.emoji}>🚀</Text>
            <Text style={styles.cardTitle}>Fast Access</Text>
            <Text style={styles.cardText}>
              No downloads, no lag. Jump straight into Sparkly from your browser.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerBrand}>
            <Image
              source={{ uri: '/favicon.ico' }}
              style={styles.footerLogo}
            />
            <Text style={styles.footerLabel}>SPARKLY ECOSYSTEM</Text>
          </View>

          <Text style={styles.footerText}>
            © 2025 Sparkly Games. Keep shining.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* Styles — WEB ONLY */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#030712',
  },

  scroll: {
    paddingTop: 120,
    paddingBottom: 80,
  },

  /* Header */
  header: {
    position: 'fixed' as any,
    top: 0,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(3,7,18,0.6)',
    backdropFilter: 'blur(16px)',
    zIndex: 100,
  },

  headerInner: {
    maxWidth: 1280,
    marginHorizontal: 'auto' as any,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: '800',
    letterSpacing: -1,
  },

  nav: {
    flexDirection: 'row',
    gap: 32,
  },

  navItem: {
    color: '#e5e7eb',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 12,
  },

  navMuted: {
    color: '#9ca3af',
  },

  /* Gradient text (web only) */
  gradientText: {
    backgroundImage:
      'linear-gradient(90deg, #f6ec5c, #ecb848, #f6733b, #ec4899, #f65c5c)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  } as any,

  /* Hero */
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 32,
  },

  pingDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#ec4899',
  },

  badgeText: {
    fontSize: 12,
    color: '#cbd5f5',
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  title: {
    fontSize: 72,
    fontWeight: '900',
    textAlign: 'center',
    color: '#ffffff',
    lineHeight: 78,
    marginBottom: 24,
  },

  subtitle: {
    maxWidth: 640,
    textAlign: 'center',
    fontSize: 18,
    color: '#9ca3af',
    marginBottom: 48,
  },

  buttons: {
    flexDirection: 'row',
    gap: 24,
  },

  primaryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 16,
  },

  primaryText: {
    color: '#030712',
    fontSize: 18,
    fontWeight: '900',
  },

  secondaryButton: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  secondaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e5e7eb',
  },

  /* Features */
  features: {
    maxWidth: 1280,
    marginHorizontal: 'auto' as any,
    marginTop: 120,
    paddingHorizontal: 24,
    flexDirection: 'row',
    gap: 32,
  },

  card: {
    flex: 1,
    padding: 32,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  emoji: {
    fontSize: 32,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    color: '#ffffff',
  },

  cardText: {
    color: '#9ca3af',
    fontSize: 15,
  },

  /* Footer */
  footer: {
    marginTop: 120,
    alignItems: 'center',
  },

  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  footerLogo: {
    width: 20,
    height: 20,
    opacity: 0.5,
  },

  footerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#6b7280',
  },

  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export const screenOptions = {
  headerShown: false,
};