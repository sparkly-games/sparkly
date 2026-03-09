import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Head from 'expo-router/head';

export default function MaintenanceScreen() {

  const refresh = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <View style={styles.container}>
      <Head>
        <title>Sparkly Games | Maintenance</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <View style={styles.centerWrap}>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>🚧</Text>

          <Text style={styles.noticeText}>
            Sparkly Games is under essential maintainance to improve it's services for everyone.
          </Text>
          <Text style={styles.noticeSub}>
            {"\n\n"}
            <strong>What can you do?</strong>
            {"\n\n"}- Wait for the maintenance to be completed (soon!)
            {"\n\n"}- Check out the GitHub (below) for the latest updates and news.
          </Text>

          <View style={styles.iconRow}>
            <ControlIcon name="refresh" onPress={refresh} />
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

const ControlIcon = ({ name, onPress }) => (
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },

  noticeTitle: {
    color: '#60a5fa',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
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