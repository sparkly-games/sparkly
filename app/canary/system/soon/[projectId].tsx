import React, { useEffect, useRef, useState, useMemo, memo } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Image, useWindowDimensions, FlatList, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GameWall } from '@/assets/components/GameWall';
import { auth } from '@/assets/data/firebaseConfig';
import { admins } from '@/assets/data/admins';

export default function ComingSoon() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { projectId } = useLocalSearchParams();
    
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const user = auth.currentUser;

    if (admins.includes(user?.uid)) {
      setTimeout(() => {
        router.replace(`/system/projects/${projectId}/${user?.uid}`);
      }, 2000);
    }
  }, [projectId]);

  useEffect(() => {
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
      <View style={styles.mainContent}>
        <Text style={styles.errorCode}>403</Text>
        <Text style={styles.message}>COMING SOON</Text>
        <Text style={styles.subtitle}>
          The coordinates you entered are in a constructional void.
        </Text>

        <Pressable 
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]} 
          onPress={() => router.replace('/play')}
        >
          <Text style={styles.buttonText}>RETURN TO BASE</Text>
        </Pressable>
      </View>
      <View style={styles.wallContainer}>
        <GameWall />
        <View style={styles.wallOverlay} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', 
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    zIndex: 10,
  },
  errorCode: {
    fontSize: 120,
    fontWeight: '900',
    color: 'rgba(59, 130, 246, 0.3)',
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
    backgroundColor: '#2563eb', 
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
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
    backgroundColor: 'rgba(2, 6, 23, 0.2)'
  },
});