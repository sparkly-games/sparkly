import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, useWindowDimensions, Linking, Modal, Platform,
  Animated
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { GlitchText } from '@/assets/components/GlitchText';
// @ts-ignore
import { app, analytics } from '@/assets/data/firebaseConfig.js';
// @ts-ignore
import { getRemoteConfig, fetchAndActivate, getString } from 'firebase/remote-config';
// @ts-ignore
import { logEvent } from 'firebase/analytics';
import { Game } from '../../assets/components/Game';
import { gamesData } from './games';
import banList from '@/public/banlist.json';

type GameType = {
  title: { en: string; };
  img: string;
  url: string;
  popular?: boolean;
  horror?: boolean;
  broken?: boolean;
  pc?: boolean;
};

const STORAGE_KEYS = { FAVS: 'sparkly:favs', RECENT: 'sparkly:recent' };
const ver = { date: '29/3/26', verText: '7.10.2' };

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [query, setQuery] = useState('');
  const [favs, setFavs] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [showHorror, setShowHorror] = useState(false);
  const [showPC, setShowPC] = useState(false);
  const [modalGame, setModalGame] = useState<GameType | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [remoteVerText, setRemoteVerText] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [gameLoading, setGameLoading] = useState(true);

  const popularGames = useMemo(() => gamesData.filter(g => g.popular), []);

  useEffect(() => {
    const f = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVS) || '[]');
    const r = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT) || '[]');
    setFavs(f);
    setRecent(r);

    const checkUpdate = async () => {
      try {
        const config = getRemoteConfig(app);
        config.settings.minimumFetchIntervalMillis = 3600000;
        await fetchAndActivate(config);
        const remoteVersion = getString(config, 'lastVer');
        if (remoteVersion && remoteVersion !== ver.verText) {
          setRemoteVerText(remoteVersion);
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Update check failed:', error);
      }
    };
    checkUpdate();

    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        ::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; background: #020617; }
        * { transition: background-color 0.3s ease, border-color 0.3s ease; }
      `;
      document.head.append(style);
    }
  }, []);

  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 2000, useNativeDriver: true })).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const addRecent = (name: string) => {
    const updated = [name, ...recent.filter(r => r !== name)].slice(0, 20);
    setRecent(updated);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(updated));
  };

  const games = useMemo(() => {
    let filtered = gamesData
      .filter(g => (showHorror || !g.horror) && (showPC || !g.pc))
      .filter(g => g.title.en.toLowerCase().includes(query.toLowerCase()));
    return filtered.sort((a, b) => a.title.en.localeCompare(b.title.en));
  }, [query, showHorror, showPC, favs, recent]);

  const columns = width < 420 ? 2 : width < 1200 ? 5 : 8;
  const itemWidth = (width - 32) / columns;
  const banned = useMemo(() => {
    const uid = localStorage.getItem('sparkly:uid');
    return uid ? banList.includes(uid) : false;
  }, []);

  const playRandom = () => {
    const g = gamesData[Math.floor(Math.random() * gamesData.length)];
    setModalGame(g);
    setGameLoading(true);
    setIframeKey(k => k + 1);
  };

  return (
    <View style={styles.container}>
      <Head><link rel="icon" href='/favicon.ico' /></Head>

      {showBanner && window.location.href !== "/stable/canary" && (
        <View style={styles.updateBanner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerIconBg}><Ionicons name="rocket-sharp" size={18} color="#fff" /></View>
            <View>
              <Text style={styles.bannerTitle}>New Update Available!</Text>
              <Text style={styles.bannerSub}>Version {remoteVerText} is ready.</Text>
            </View>
          </View>
          <ControlIcon name="close" size={20} color="#94a3b8" onPress={() => setShowBanner(false)} style={styles.bannerCloseBtn} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.noticeBox}>
          <GlitchText style={styles.noticeTitle}>✨ Sparkly ✨</GlitchText>
          <Text style={styles.noticeText}>{`v${ver.verText} | ${ver.date}`}</Text>

          <View style={styles.iconRow}>
            <ControlIcon name="logo-github" onPress={() => Linking.openURL('https://github.com/sparkly-games')} />
            <ControlIcon name="logo-youtube" onPress={() => router.push('/vids')} />
            <ControlIcon name="volume-high" onPress={() => Linking.openURL('/soundboard.htm')} />
            <View style={styles.vPipe} />
            <ControlIcon name="desktop-outline" color={showPC ? '#60a5fa' : '#475569'} onPress={() => setShowPC(!showPC)} />
            <ControlIcon name="skull-outline" color={showHorror ? '#ef4444' : '#475569'} onPress={() => setShowHorror(!showHorror)} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, height: 80 }}>
          <TextInput value={query} onChangeText={setQuery} placeholder="Search games..." placeholderTextColor="#475569" style={styles.search} />
          <TouchableOpacity onPress={playRandom}>
            <Text style={[styles.iconBtn, { fontSize: 36, padding: 10, height: 65, width: 65, textAlign: 'center' }]}>🎲</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Popular Games</Text>
        <View style={styles.grid}>
          {popularGames.map(game => (
            <View key={game.title.en} style={{ width: itemWidth * 0.8, padding: 6 }}>
              <Game name={game.title.en} imageSource={game.img} ban={banned} onPress={() => { if (!banned) { setModalGame(game); setGameLoading(true); setIframeKey(k => k + 1); addRecent(game.title.en); }}} />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>All Games</Text>
        <View style={styles.grid}>
          {games.map(game => (
            <View key={game.title.en} style={{ width: itemWidth, padding: 6 }}>
              <Game name={game.title.en} imageSource={game.img} ban={banned} onPress={() => { if (!banned) { setModalGame(game); setGameLoading(true); setIframeKey(k => k + 1); addRecent(game.title.en); }}} />
            </View>
          ))}
        </View>
        
        <View style={{ padding: 40, alignItems: 'center' }}><Text style={{ color: '#1e293b', fontSize: 10 }}>Sparkly Engine v{ver.verText}</Text></View>
      </ScrollView>

      <Modal visible={!!modalGame} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              <ControlIcon name="close-circle" size={32} color="#f1f5f9" onPress={() => setModalGame(null)} style={{ backgroundColor: 'transparent' }} />
              <View style={styles.modalRight}>
                <ControlIcon name="warning-outline" size={24} color="#f87171" onPress={() => alert('Reported!')} style={{ backgroundColor: 'transparent' }} />
                <ControlIcon name="refresh" size={24} color="#94a3b8" onPress={() => setIframeKey(k => k + 1)} style={{ backgroundColor: 'transparent' }} />
                <ControlIcon name="expand" size={24} color="#94a3b8" onPress={() => iframeRef.current?.requestFullscreen?.()} style={{ backgroundColor: 'transparent' }} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              {gameLoading && (
                <View style={styles.spinnerContainer}>
                  <Animated.View style={{ transform: [{ rotate }] }}><Ionicons name="game-controller" size={48} color="#60a5fa" /></Animated.View>
                  <Text style={styles.loadingText}>Loading game...</Text>
                </View>
              )}
              <iframe ref={iframeRef} key={iframeKey} src={modalGame?.url} onLoad={() => setGameLoading(false)} style={{ flex: 1, width: '100%', border: 'none', opacity: gameLoading ? 0 : 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ControlIcon = ({ name, onPress, color = "white", size = 22, style = {} }: any) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.iconBtn, style]}>
    <Ionicons name={name} size={size} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  spinnerContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', zIndex: 10 },
  loadingText: { color: '#94a3b8', marginTop: 12, fontSize: 14 },
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  noticeBox: { padding: 24, borderRadius: 24, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)', marginBottom: 20 },
  noticeTitle: { color: '#60a5fa', fontSize: 28, fontWeight: '900', textAlign: 'center', letterSpacing: -0.5 },
  noticeText: { color: '#94a3b8', textAlign: 'center', marginTop: 4, fontWeight: '600', fontSize: 13 },
  iconRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 16 },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
  vPipe: { width: 1, height: 24, backgroundColor: '#1e293b' },
  sectionTitle: { color: '#60a5fa', fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  updateBanner: { flexDirection: 'row', alignItems: 'center', margin: 24, justifyContent: 'space-between', backgroundColor: '#1e293b', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#3b82f6' },
  bannerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bannerIconBg: { backgroundColor: '#3b82f6', padding: 8, borderRadius: 10 },
  bannerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  bannerSub: { color: '#94a3b8', fontSize: 12 },
  bannerCloseBtn: { padding: 4, backgroundColor: 'transparent' },
  search: { flex: 1, padding: 16, borderRadius: 16, backgroundColor: '#0f172a', color: 'white', borderWidth: 1, borderColor: '#1e293b', fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  modalBg: { flex: 1, backgroundColor: 'rgba(2,6,23,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '95%', height: '90%', backgroundColor: '#0f172a', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  modalTop: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, alignItems: 'center', backgroundColor: '#1e293b' },
  modalRight: { flexDirection: 'row', gap: 10 },
});