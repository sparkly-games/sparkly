import React, { useEffect, useRef, useState, useMemo, memo } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Image, useWindowDimensions, FlatList, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { GameWall } from '@/assets/components/GameWall';

export default function NotFoundScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isInIframe = window.top !== window.self; // Check if the app is running inside an iframe
  
  // Animation Values
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Background Loop Animation[cite: 1]
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -1500,
        duration: 40000,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* --- CONTENT SECTION --- */}
      <View style={[styles.mainContent, isDesktop && styles.desktopContent]}>
        <Text style={styles.errorCode}>404</Text>
        <Text style={styles.message}>MISSION FAILED</Text>
        <Text style={styles.subtitle}>
          The coordinates you entered do not exist in this sector.
        </Text>

        {!isInIframe && (
          <Pressable 
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]} 
            onPress={() => router.replace('/play')}
          >
            <Text style={styles.buttonText}>RETURN TO BASE</Text>
          </Pressable>
        )}
      </View>

      {/* --- GAME WALL SECTION --- */}
      {isDesktop && (
        <GameWall />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', //[cite: 1]
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    zIndex: 10,
  },
  desktopContent: {
    alignItems: 'flex-start',
    maxWidth: '50%',
  },
  errorCode: {
    fontSize: 120,
    fontWeight: '900',
    color: 'rgba(59, 130, 246, 0.3)', // Faint blue
    position: 'absolute',
    top: '20%',
  },
  message: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 32,
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#2563eb', //[cite: 1]
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  // Wall Styles
  wallContainer: {
    flex: 1,
    height: '100%',
    overflow: 'visible',
    borderLeftWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  wallGame: {
    width: 160,
    height: 100,
    borderRadius: 12,
    margin: 10,
    backgroundColor: '#1e293b',
  },
  wallOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.2)', // Darken the wall so text is readable
  },
});