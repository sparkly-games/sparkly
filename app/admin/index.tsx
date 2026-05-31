import React, { useEffect, useRef, useState, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Image,
  useWindowDimensions,
  FlatList,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '@/assets/data/firebaseConfig';
import { admins } from '@/assets/data/admins';
import ENV_VARS from '@/assets/data/env';
import { GameWall } from '@/assets/components/GameWall';

/* ------------------ Memo Game Item ------------------ */

/* ------------------ Screen ------------------ */

export default function NotFoundScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [uid, setUid] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'blocked' | 'guest'>('loading');

  const scrollAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /* ------------------ Animations ------------------ */

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -1500,
        duration: 40000,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  /* ------------------ AUTH LISTENER ------------------ */

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      const id = user?.uid ?? null;
      setUid(id);

      if (!user) {
        setStatus('guest');
      } else {
        setStatus('ok');
      }
    });

    return unsub;
  }, []);

  /* ------------------ ADMIN GATE ------------------ */

  useEffect(() => {
    if (status === 'loading') return;
    if (typeof window === 'undefined') return;
    if (!uid) return;

    let isAdmin = admins.includes(uid);
    if (process.env.NODE_ENV == "development") isAdmin = true;

    if (!isAdmin) {
      setStatus('blocked');

      const newBranch = 'stable';
      localStorage.setItem('sparkly_branch', newBranch);

      const path = window.location.pathname;
      const clean = path.replace(/^\/(stable|canary|devpatch)/, '');

      setTimeout(() => {
        router.replace(`/${newBranch}${clean === '/' ? '' : clean}`);
      }, 500);
    }
  }, [uid, status]);

  /* ------------------ BLOCKING UI STATES ------------------ */

  if (status === 'loading') {
    return <View style={styles.container} />;
  }

  if (status === 'guest' && process.env.NODE_ENV != "development") {
    return (
      <View style={styles.container}>
        <Text style={styles.blockText}>Please log in first.</Text>
      </View>
    );
  }

  if (status === 'blocked') {
    return (
      <View style={styles.container}>
        <Text style={styles.blockText}>
          You aint admin vro ✌️
        </Text>
      </View>
    );
  }

  /* ------------------ MAIN UI ------------------ */

  return (
    <View style={styles.container}>
      {/* CONTENT */}
      <View style={[styles.mainContent, isDesktop && styles.desktopContent]}>
        <Text style={styles.errorCode}>🫰</Text>
        <Text style={styles.message}>Admin Preview</Text>
        <Text style={styles.subtitle}>
          See the admin preview features!
        </Text>

        <View style={{ margin: 5 }} />
        {/* BUTTON TEMPLATE
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.buttonText}>no features</Text>
        </Pressable>
        */}

        <View style={{ margin: 5 }} />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            { backgroundColor: '#333333a6', borderWidth: 2, borderColor: '#111' }
          ]}
          onPress={() => { auth.signOut(); router.replace('/stable') }}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </Pressable>
      </View>

      {/* GAME WALL */}
      {isDesktop && (
        <GameWall />
      )}
    </View>
  );
}

/* ------------------ STYLES ------------------ */

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

  desktopContent: {
    alignItems: 'flex-start',
    maxWidth: '50%',
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
    backgroundColor: 'rgba(2, 6, 23, 0.2)',
  },

  blockText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});