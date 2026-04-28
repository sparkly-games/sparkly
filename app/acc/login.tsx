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
  Modal,
  TextInput,
} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { router } from 'expo-router';
import Head from 'expo-router/head';
import { GameWall } from '@/assets/components/GameWall';

// Firebase Imports
import { app } from '@/assets/data/firebaseConfig.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, FacebookAuthProvider } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isDesktop = width >= 1024;
  const auth = getAuth(app);

  // State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async (providerType: 'google' | 'github' | 'email' | 'facebook') => {
    if (providerType === 'email') {
      setShowEmailModal(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const provider = providerType === 'google' ? new GoogleAuthProvider() : providerType === 'github' ? new GithubAuthProvider() : providerType === 'facebook' ? new FacebookAuthProvider() : null;
      if (!provider) {
        setErrorMessage('Unsupported provider selected.');
        return;
      }
      await signInWithPopup(auth, provider);
      router.replace('/play'); // Redirect on success
    } catch (error: any) {
      console.error('Login failed:', error);
      
      const errorMessages: Record<string, string> = {
        'auth/popup-closed-by-user': 'Login cancelled by user.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/operation-not-supported-in-this-environment': 'Environment not supported.',
        'auth/unauthorized-domain': 'Unauthorized domain.',
        'auth/invalid-credential': 'Invalid credentials. Try again.',
        'auth/account-exists-with-different-credential': 'Email already linked to another login method.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'User not found.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'Email already in use.',
        'auth/operation-not-allowed': 'Login provider not enabled.',
      };

      setErrorMessage(errorMessages[error.code] || `Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowEmailModal(false);
      setEmail('');
      setPassword('');
      router.replace('/play');
    } catch (error: any) {
      console.error('Email login failed:', error);
      
      const errorMessages: Record<string, string> = {
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-not-found': 'User not found.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-disabled': 'This account has been disabled.',
      };

      setErrorMessage(errorMessages[error.code] || `Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.root, isDesktop && styles.desktopContainer]}>
      <Head>
        <title>Login | Sparkly Games</title>
      </Head>

      <StatusBar style="light" />

      {/* --- BACKGROUND VISUALS --- */}
      <View style={styles.backgroundGlow1} />
      <View style={styles.backgroundGlow2} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* --- BRANDING --- */}
          <View style={styles.brandHeader}>
             <Image source={{ uri: '/favicon.ico' }} style={styles.logo} />
             <Text style={styles.brandText}>Sparkly <Text style={styles.gradientText}>Auth</Text></Text>
          </View>

          {/* --- LOGIN CARD --- */}
          <View style={styles.loginCard}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Choose a provider to continue to your dashboard.</Text>
            <Text style={styles.subtitle}>Don't have an account? <Text style={styles.linkText} onPress={() => router.push('/acc/signup')}>Sign up</Text></Text>

            {/* Error Message Display */}
            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <View style={styles.buttonGap}>
              <Pressable
                style={({ pressed }) => [
                  styles.authButton,
                  { borderColor: 'rgba(255,255,255,0.1)', flexDirection: 'row' },
                  pressed && styles.buttonPressed
                ]}
                onPress={() => handleLogin('email')}
                disabled={isLoading}
              >
                <Ionicons name="mail" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Continue with Email</Text>
              </Pressable>


              <Pressable
                style={({ pressed }) => [
                  styles.authButton,
                  { borderColor: 'rgba(255,255,255,0.1)', flexDirection: 'row', backgroundColor: 'rgba(219, 68, 55, 0.8)' },
                  pressed && styles.buttonPressed
                ]}
                onPress={() => handleLogin('google')}
                disabled={isLoading}
              >
                <Ionicons name="logo-google" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Continue with Google</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.authButton,
                  { backgroundColor: '#24292f', borderWidth: 0, flexDirection: 'row' },
                  pressed && styles.buttonPressed
                ]}
                onPress={() => handleLogin('github')}
                disabled={isLoading}
              >
                <Ionicons name="logo-github" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Continue with GitHub</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.authButton,
                  { backgroundColor: '#0f468d', borderWidth: 0, flexDirection: 'row' },
                  pressed && styles.buttonPressed
                ]}
                onPress={() => handleLogin('facebook')}
                disabled={isLoading}
              >
                <Ionicons name="logo-facebook" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Continue with Facebook</Text>
              </Pressable>
            </View>

            <Text style={styles.footerNote}>
              By signing in, you agree to our Terms of Service.
            </Text>
          </View>

          <Pressable onPress={() => router.push('/')}>
            <Text style={styles.backLink}>← Back to Home</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* --- EMAIL LOGIN MODAL --- */}
      <Modal
        visible={showEmailModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEmailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sign In with Email</Text>
            
            <TextInput
              style={styles.emailInput}
              placeholder="Email"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.emailInput}
              placeholder="Password"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />

            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}
            <Text style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
              Forgot password? <Text style={styles.linkText} onPress={() => {
                setShowEmailModal(false);
                router.push('/reset-password');
              }}>Reset Password</Text>
            </Text>

            <Pressable
              style={({ pressed }) => [styles.modalButton, styles.signInButton, pressed && styles.buttonPressed]}
              onPress={handleEmailSignIn}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>{isLoading ? 'Signing in...' : 'Sign In'}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.modalButton, styles.cancelButton, pressed && styles.buttonPressed]}
              onPress={() => {
                setShowEmailModal(false);
                setEmail('');
                setPassword('');
                setErrorMessage(null);
              }}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <GameWall />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617', position: 'relative' },
  desktopContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  container: { maxWidth: 450, width: '100%', alignSelf: 'center', alignItems: 'center' },

  // Background Glows
  backgroundGlow1: {
    position: 'absolute', top: -100, left: -100, width: 400, height: 400,
    borderRadius: 200, backgroundColor: 'rgba(37, 99, 235, 0.15)',
    ...(Platform.OS === 'web' && { filter: 'blur(100px)' }),
  },
  backgroundGlow2: {
    position: 'absolute', bottom: -100, right: -100, width: 400, height: 400,
    borderRadius: 200, backgroundColor: 'rgba(96, 165, 250, 0.1)',
    ...(Platform.OS === 'web' && { filter: 'blur(100px)' }),
  },

  // Branding
  brandHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  logo: { width: 32, height: 32, marginRight: 12 },
  brandText: { fontSize: 28, fontWeight: '900', color: '#fff' },
  gradientText: { color: '#60a5fa' },

  // Card Styling
  loginCard: {
    width: '100%',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 32,
    padding: 40,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(16px)' }),
  },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 32, lineHeight: 22 },

  // Form Components
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: 24,
  },
  linkText: { color: '#60a5fa', fontWeight: '600' },
  errorText: { color: '#fca5a5', fontSize: 14, textAlign: 'center', fontWeight: '600' },
  buttonGap: { gap: 12 },
  authButton: {
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  buttonPressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  
  footerNote: { marginTop: 24, fontSize: 12, color: '#64748b', textAlign: 'center' },
  backLink: { marginTop: 32, color: '#94a3b8', fontSize: 14, fontWeight: '600' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(16px)' }),
  },
  modalTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 24, textAlign: 'center' },
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
  modalButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  signInButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: { color: '#94a3b8', fontSize: 16, fontWeight: '600' },
});