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
  TextInput,
} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { router } from 'expo-router';
import Head from 'expo-router/head';
import { Ionicons } from '@expo/vector-icons';
import { GameWall } from '@/assets/components/GameWall';

import { auth } from '@/assets/data/firebaseConfig.js';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ResetPassword() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isDesktop = width >= 1024;

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      setSuccessMessage(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMessage('Password reset email sent. Check your inbox and spam folder.');
      setEmail('');
    } catch (error: any) {
      console.error('Password reset failed:', error);

      const errorMessages: Record<string, string> = {
        'auth/invalid-email': 'Invalid email address.',
        'auth/missing-email': 'Please enter your email address.',
        'auth/user-not-found': 'No account found for that email address.',
        'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
        'auth/network-request-failed': 'Network error. Check your connection.',
      };

      setErrorMessage(errorMessages[error.code] || `Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.root, isDesktop && styles.desktopContainer]}>
      <Head>
        <title>Reset Password | Sparkly Games</title>
      </Head>

      <StatusBar style="light" />

      <View style={styles.backgroundGlow1} />
      <View style={styles.backgroundGlow2} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.brandHeader}>
            <Image source={{ uri: '/favicon.ico' }} style={styles.logo} />
            <Text style={styles.brandText}>
              Sparkly <Text style={styles.gradientText}>Auth</Text>
            </Text>
          </View>

          <View style={[styles.card, isMobile && styles.cardMobile]}>
            <View style={styles.iconWrap}>
              <Ionicons name="mail-open-outline" size={28} color="#60a5fa" />
            </View>

            <Text style={styles.title}>Reset your password</Text>
            <Text style={styles.subtitle}>
              Enter the email linked to your account and we&apos;ll send you a reset link.
            </Text>

            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {successMessage && (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            )}

            <TextInput
              style={styles.emailInput}
              placeholder="Email"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Sending reset email...' : 'Send reset email'}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push('/login')}
              disabled={isLoading}
            >
              <Text style={styles.secondaryButtonText}>Back to login</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => router.push('/')}>
            <Text style={styles.backLink}>← Back to Home</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
      <GameWall />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617', position: 'relative' },
  desktopContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  container: { maxWidth: 450, width: '100%', alignSelf: 'center', alignItems: 'center' },

  backgroundGlow1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    ...(Platform.OS === 'web' && { filter: 'blur(100px)' }),
  },
  backgroundGlow2: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    ...(Platform.OS === 'web' && { filter: 'blur(100px)' }),
  },

  brandHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  logo: { width: 32, height: 32, marginRight: 12 },
  brandText: { fontSize: 28, fontWeight: '900', color: '#fff' },
  gradientText: { color: '#60a5fa' },

  card: {
    width: '100%',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 32,
    padding: 40,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(16px)' }),
  },
  cardMobile: { padding: 28 },
  iconWrap: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.24)',
  },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 24, lineHeight: 22 },

  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: 16,
  },
  errorText: { color: '#fca5a5', fontSize: 14, textAlign: 'center', fontWeight: '600' },
  successContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.24)',
    marginBottom: 16,
  },
  successText: { color: '#86efac', fontSize: 14, textAlign: 'center', fontWeight: '600' },
  emailInput: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    padding: 14,
    color: '#fff',
    fontSize: 16,
    marginBottom: 14,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.85)',
    marginTop: 4,
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 12,
  },
  buttonPressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryButtonText: { color: '#94a3b8', fontSize: 16, fontWeight: '600' },
  backLink: { marginTop: 32, color: '#94a3b8', fontSize: 14, fontWeight: '600' },
});
