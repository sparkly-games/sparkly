import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, useWindowDimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ControlIcon } from '@/assets/components/Wrappers';
import Head from 'expo-router/head';
import { router } from 'expo-router';
import { GlitchText } from '@/assets/components/GlitchText';
import { GameWall } from '@/assets/components/GameWall';

export default function MaintenanceScreen() {
  const [showGame, setShowGame] = React.useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const refresh = () => {
    window.location.href = '/play';
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const modal = document.querySelector('#modal');
      if (modal) modal.remove();
    }
    else {
        console.error('Couldn\'t remove modal.')
    }
  }, []);

  const playBitlife = () => {
    setShowGame(p => !p);
  }

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      <GameWall />
      <Head>
        <title>Sparkly Games | Maintenance</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <View style={[styles.centerWrap, isDesktop && styles.mainContent]}>
        <View style={styles.noticeBox}>

          <Text style={styles.noticeTitle}>🚧</Text>

          <GlitchText style={styles.noticeText}>
            Sparkly Games is under essential maintenance to improve its services for everyone.
          </GlitchText>

          <Text style={styles.noticeSub}>
            <strong>{"\n\n"}What can you do?</strong>
            {"\n\n"}• Wait for the maintenance to be completed (soon!)
            {"\n\n"}• Check out the GitHub below for updates and news.
            {"\n\n"}• Continue with BitLife while you wait!
          </Text>

          <View style={styles.iconRow}>
            <ControlIcon name="refresh" onPress={refresh} />
            <ControlIcon name="game-controller" onPress={playBitlife} />
            <ControlIcon
              name="logo-github"
              onPress={() => Linking.openURL('https://github.com/sparkly-games')}
            />
          </View>

        </View>
      </View>
      {showGame && (
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <iframe
            title="BitLife"
            src="/bitlife"
            style={{ width: '100%', height: 500, border: 'none', borderRadius: 12 }}
          />
        </View>
      )}
    </View>
  );}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  centerWrap: {
    width: '90%',
    maxWidth: 600,
  },
  desktopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  mainContent: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
  },

  noticeBox: {
    padding: 32,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },

  noticeTitle: {
    color: '#60a5fa',
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
  },

  noticeText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },

  noticeSub: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    fontSize: 14,
  },

  iconRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 22,
  },

  iconBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});