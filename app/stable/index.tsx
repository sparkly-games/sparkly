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
  ActivityIndicator,
} from 'react-native';
import React, { useRef, useEffect, useState, useMemo, memo } from 'react';
import { router } from 'expo-router';
import Head from 'expo-router/head';

import { SELLING_POINTS } from '@/assets/data/selling';
import { auth } from '@/assets/data/firebaseConfig.js';
import { signOut } from 'firebase/auth';
import { GameWall } from '@/assets/components/GameWall';

export default function Home() {
  const { width } = useWindowDimensions();

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Auth States
  const [loggedIn, setLoggedIn] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  const logoScroll = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(-80)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 2500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -1200,
        duration: 35000,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();

    // AUTH LISTENER
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.photoURL) {
        setLoggedIn(true);
        setProfilePicUrl(user.photoURL);
      } else if (user) {
        setLoggedIn(true);
        setProfilePicUrl('https://ui-avatars.com/api/?name=' + (user.displayName || 'User'));
      } else {
        setLoggedIn(false);
        setProfilePicUrl(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const heroFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heroFloat, {
          toValue: -6,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(heroFloat, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });

    toastAnim.setValue(-80);
    toastOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastAnim, {
          toValue: -80,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setToast(null));
    }, 2200);
  };

  const uid = auth.currentUser?.uid;

  return (
    <View style={styles.root}>
      {toast && (
        <Animated.View
          style={[
            styles.toast,
            toast.type === 'success' ? styles.toastSuccess : styles.toastError,
            {
              opacity: toastOpacity,
              transform: [{ translateY: toastAnim }],
            },
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
      <StatusBar style="light" />

      {/* --- BACKGROUND --- */}
      <View style={styles.backgroundGlow1} />
      <View style={styles.backgroundGlow2} />

      <GameWall />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Pressable onPress={() => router.replace('/')} style={styles.brand}>
            <Image source={{ uri: '/favicon.ico' }} style={styles.logo} />
            <Text style={[styles.brandText, styles.gradientText]}>Sparkly Games</Text>
          </Pressable>

          {!isMobile && (
            <View style={styles.nav}>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginRight: 12, fontWeight: 'bold', opacity: 0.6 }} onPress={() => Linking.openURL('https://sparkly.mintlify.app')}>DOCS</Text>
              {authLoading ? (
                <ActivityIndicator size="small" color="#3b82f6" />
              ) : !loggedIn ? (
                <Pressable 
                  onPress={() => router.push('/acc/login')} 
                  style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.7 }]}
                >
                  <Text style={styles.loginText}>LOGIN</Text>
                </Pressable>
              ) : (
                profilePicUrl && (
                  <Pressable 
                    onLongPress={() => {showToast("UID copied to clipboard!", "success"); navigator.clipboard.writeText(uid ? uid : "")}}
                    onPress={() => {
                      signOut(auth)
                        .then(() => {showToast("Signed out successfully!", "success")})
                        .catch(() => {showToast("Couldn't sign out.", "error")})
                    }}
                  >
                    <Image 
                      key={profilePicUrl} 
                      source={{ 
                          uri: profilePicUrl,
                          // Cross-Origin Resource Policy fix for Google/Firebase Auth images
                          // @ts-ignore
                          referrerPolicy: "no-referrer" 
                      }} 
                      style={styles.profilePic} 
                      // Log the error if the image fails to bind
                      onError={(e) => console.error("Image Load Error:", e.nativeEvent.error)}
                    />
                  </Pressable>
                )
              )}
            </View>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.hero, { transform: [{ translateY: heroFloat }] }]}>
          <Animated.View style={[styles.versionBadge, { transform: [{ translateY: floatAnim }] }]}>
            <View style={styles.pingDot} />
            <Text style={styles.badgeText}>v7 is live!</Text>
          </Animated.View>
          <Text style={styles.statusLine}>⚡ LIVE GAME HUB • NO BLOCKS • FAST LOAD</Text>
          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            <Text style={styles.gradientText}>Play Anything</Text>
            {'\n'}No Limits.
          </Text>

          <View style={styles.trendingBar}>
            <Text style={styles.trendingText}>🔥 Trending: Drive Mad, No Pain No Gain</Text>
          </View>

          <Text style={styles.subtitle}>
            Built for school breaks, boredom, and chaos.{'\n'}
            No installs. No restrictions. Just press play.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              isMobile && styles.fullWidth,
              pressed && { transform: [{ scale: 0.96 }], shadowOpacity: 0.4 }
            ]}
            onPress={() => router.push('/play')}
          >
            <Text style={styles.primaryText}>Play Now →</Text>
          </Pressable>
        </Animated.View>

        {/* FEATURES GRID */}
        <Animated.View style={[styles.featuresContainer, { opacity: fadeAnim }]}>
          <View style={styles.featuresGrid}>
            {SELLING_POINTS.map((point, index) => (
              <Pressable
                key={index}
                style={[styles.card, { width: isMobile ? '100%' : '30%' }, hoveredIndex === index && { transform: [{ scale: 1.04 }] }]}
                onHoverIn={() => setHoveredIndex(index)}
                onHoverOut={() => setHoveredIndex(null)}
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

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Pressable
            onPress={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/policies/privacy/index.htm';
              }
            }}
          >
            <Text style={styles.privacyLink}>Privacy Policy</Text>
          </Pressable>
          <Text style={styles.footerText}>Made with 💖 by the Sparkly Team.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scroll: { paddingTop: 140, paddingBottom: 60 },
  backgroundGlow1: { position: 'absolute', top: -200, left: -150, width: 500, height: 500, borderRadius: 250, backgroundColor: 'rgba(236, 72, 153, 0.18)', ...(Platform.OS === 'web' && { filter: 'blur(140px)' }) },
  backgroundGlow2: { position: 'absolute', bottom: -200, right: -150, width: 500, height: 500, borderRadius: 250, backgroundColor: 'rgba(99, 102, 241, 0.25)', ...(Platform.OS === 'web' && { filter: 'blur(140px)' }) }, 
  heroBackground: { position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.4, zIndex: -1 },
  heroGame: { width: 140, height: 85, borderRadius: 12, margin: 8, backgroundColor: '#1e293b' },
  heroFade: { position: 'absolute', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.85)' },
  header: { position: Platform.OS === 'web' ? 'fixed' : 'absolute', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: 'rgba(2, 6, 23, 0.85)', borderBottomWidth: 1, borderColor: 'rgba(59, 130, 246, 0.15)', ...(Platform.OS === 'web' && { backdropFilter: 'blur(16px)' }) }, 
  headerInner: { maxWidth: 1200, alignSelf: 'center', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14 },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 28, height: 28, marginRight: 10 },
  brandText: { fontSize: 22, fontWeight: '900' },
  gradientText: { color: '#60a5fa', ...(Platform.OS === 'web' && { backgroundImage: 'linear-gradient(90deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }) },
  nav: { flexDirection: 'row', alignItems: 'center' },
  loginBtn: { backgroundColor: '#3b82f6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  loginText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  profilePic: { width: 40, height: 40, borderRadius: 20, borderColor: '#3b82f6', borderWidth: 2, backgroundColor: 'transparent' },
  hero: { paddingHorizontal: 24, alignItems: 'center' },
  versionBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)', marginBottom: 24 },
  pingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3b82f6', marginRight: 8 },
  badgeText: { color: '#93c5fd', fontSize: 11, fontWeight: '800' },
  title: { fontSize: 78, fontWeight: '900', color: '#fff', textAlign: 'center', lineHeight: 82, letterSpacing: -2.5, marginBottom: 20 },
  titleMobile: { fontSize: 46, lineHeight: 50 }, 
  subtitle: { fontSize: 16, color: '#94a3b8', textAlign: 'center', maxWidth: 520, lineHeight: 24, opacity: 0.85, margin: 10 }, 
  primaryButton: { backgroundColor: '#2563eb', paddingHorizontal: 48, paddingVertical: 18, borderRadius: 999, shadowColor: '#2563eb', shadowOpacity: 0.8, shadowRadius: 25, elevation: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }, 
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  featuresContainer: { marginTop: 80, width: '100%', alignItems: 'center' },
  featuresGrid: { maxWidth: 1200, width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 10 },
  iconCircle: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(37, 99, 235, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emoji: { fontSize: 20 },
  footer: { marginTop: 100, alignItems: 'center', paddingBottom: 40 },
  footerDivider: { width: 100, height: 1, backgroundColor: 'rgba(59, 130, 246, 0.2)', marginBottom: 24 },
  footerText: { color: '#64748b', fontSize: 12, opacity: 0.7 },
  fullWidth: { width: '90%' },
  toast: { position: 'absolute', top: 60, alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, zIndex: 9999 },
  toastSuccess: { backgroundColor: '#16a34a' },
  toastError: { backgroundColor: '#dc2626' },
  toastText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  privacyLink: { marginTop: 12, color: '#60a5fa', fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: 'rgba(15, 23, 42, 0.85)', borderRadius: 28, padding: 28, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.18)', margin: 10, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 }, 
  cardTitle: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 10 },
  cardText: { fontSize: 15, color: '#94a3b8', lineHeight: 22 }, 
  cardGlow: { position: 'absolute', top: -60, right: -60, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(236, 72, 153, 0.08)' },
  statusLine: { color: '#22c55e', fontWeight: '800', fontSize: 12, letterSpacing: 2, marginBottom: 18, opacity: 0.9 },
  trendingBar: { marginTop: 20, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(99, 102, 241, 0.12)' },
  trendingText: { color: '#c7d2fe', fontSize: 12, fontWeight: '700' },
});