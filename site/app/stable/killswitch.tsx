import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Head from 'expo-router/head';
import { GlitchText } from '@/assets/components/GlitchText';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { app } from '@/assets/data/firebaseConfig';

export default function MaintenanceScreen() {
  const [canonical, setCanonical] = useState<string>('https://example.com');

  // DOM Manipulation (Web Only)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const modal = document.querySelector('#modal');
      if (modal) modal.remove();
    }
  }, []);

  // Firebase Remote Config
  useEffect(() => {
    const initRemoteConfig = async () => {
      try {
        const rc = getRemoteConfig(app);
        rc.settings = { minimumFetchIntervalMillis: 60000, fetchTimeoutMillis: 10000 };
        rc.defaultConfig = { canonicalURI: 'https://example.com' };
        
        await fetchAndActivate(rc);
        const canonicalValue = getValue(rc, 'canonicalURI').asString();
        if (canonicalValue) setCanonical(canonicalValue);
      } catch (err) {
        console.error('Remote Config failed:', err);
      }
    };

    initRemoteConfig();
  }, []);

  return (
    <View style={styles.container}>
      <Head>
        <title>Shutdown Notice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <View style={styles.centerWrap}>
        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>🚧</Text>

          <GlitchText style={styles.noticeText}>
            This Sparkly Games site has been permanently shut down.
          </GlitchText>

          <View style={styles.textBlock}>
            <Text style={styles.boldLabel}>What can you do?</Text>
            <Text style={styles.noticeSub}>• Check out the new link below.</Text>
            <Text style={styles.noticeSub}>• Check out the GitHub for updates.</Text>
            
            <TouchableOpacity 
              onPress={() => Linking.openURL(canonical)}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>{canonical}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconRow}>
            <ControlIcon
              name="logo-github"
              onPress={() => Linking.openURL('https://github.com/sparkly-games')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

// Separate Component for Icons
const ControlIcon = ({ name, onPress }: { name: any; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.iconBtn} activeOpacity={0.7}>
    <Ionicons name={name} size={22} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerWrap: {
    width: '90%',
    maxWidth: 600,
  },
  noticeBox: {
    padding: 32,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.8)', // Increased opacity as fallback for backdropFilter
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    // Note: backdropFilter only works on Web. For Native, you'd need @react-native-community/blur
    ...Platform.select({
      web: { backdropFilter: 'blur(10px)' } as any,
    }),
  },
  noticeTitle: {
    fontSize: 40,
    marginBottom: 10,
  },
  noticeText: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  textBlock: {
    marginTop: 24,
    alignItems: 'center',
  },
  boldLabel: {
    color: '#f8fafc',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  noticeSub: {
    color: '#64748b',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  linkContainer: {
    marginTop: 15,
  },
  linkText: {
    color: '#60a5fa',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 30,
  },
  iconBtn: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});