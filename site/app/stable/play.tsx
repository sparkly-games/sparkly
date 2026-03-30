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
import { app } from '@/assets/data/firebaseConfig.js';
// @ts-ignore
import { getRemoteConfig, fetchAndActivate, getString } from 'firebase/remote-config';
import { Game } from '../../assets/components/Game';
import { gamesData } from './games';
import banList from '@/public/banlist.json';

type GameType = {
  title: { en: string };
  img: string;
  url: string;
  popular?: boolean;
  horror?: boolean;
  broken?: boolean;
  pc?: boolean;
};

const STORAGE_KEYS = { FAVS: 'sparkly:favs', RECENT: 'sparkly:recent', FILTERS: 'sparkly:filters' };
const ver = { date: '30/3/26', verText: '7.11.0' };

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
    const filters = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILTERS) || '{}');

    setFavs(f);
    setRecent(r);
    setShowPC(filters.showPC || false);
    setShowHorror(filters.showHorror || false);

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
      `;
      document.head.append(style);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify({ showPC, showHorror }));
  }, [showPC, showHorror]);

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
  }, [query, showHorror, showPC]);

  const columns = width < 420 ? 2 : width < 1200 ? 5 : 8;
  const itemWidth = (width - 32) / columns;

  const banned = useMemo(() => {
    const uid = localStorage.getItem('sparkly:uid');
    return uid ? banList.includes(uid) : false;
  }, []);

  const playRandom = () => {
    const pool = games.length ? games : gamesData;
    const g = pool[Math.floor(Math.random() * pool.length)];
    setModalGame(g);
    setGameLoading(true);
    setIframeKey(k => k + 1);
  };

  // MODAL BUTTON ACTIONS
  const reloadGame = () => {
    if (iframeRef.current) {
      setGameLoading(true);
      iframeRef.current.src = modalGame?.url || '';
    }
  };

  const fullscreenGame = () => {
    if (iframeRef.current && iframeRef.current.requestFullscreen) {
      iframeRef.current.requestFullscreen();
    }
  };

  const reportGame = () => {
    alert(`Reporting ${modalGame?.title.en}`);
  };

  return (
    <View style={styles.container}>
      <Head><link rel="icon" href='/favicon.ico' /></Head>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.noticeBox}>
          <GlitchText style={styles.noticeTitle}>✨ Sparkly ✨</GlitchText>
          <Text style={styles.noticeText}>{`v${ver.verText} | ${ver.date}`}</Text>

          <View style={styles.iconRow}>
            <ControlIcon name="logo-youtube" onPress={() => router.push('/vids')} />
            <ControlIcon name="barcode-outline" onPress={() => Linking.openURL('/soundboard.htm')} />
            <ControlIcon name="mic-outline" onPress={() => Linking.openURL('/tts.htm')} />
            <View style={styles.vPipe} />
            <ControlIcon
              name="desktop-outline"
              color={showPC ? '#60a5fa' : '#475569'}
              onPress={() => setShowPC(!showPC)}
            />
            <ControlIcon
              name="skull-outline"
              color={showHorror ? '#ef4444' : '#475569'}
              onPress={() => setShowHorror(!showHorror)}
            />
            <ControlIcon name="download-outline" onPress={() => router.push('/save_progress')} />
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={{ flexDirection: 'row', gap: 12, height: 80 }}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search games..."
            placeholderTextColor="#475569"
            style={styles.search}
          />
          {query.length > 0 && (
            <ControlIcon name="close" onPress={() => setQuery('')} />
          )}
          <TouchableOpacity onPress={playRandom}>
            <Text style={[styles.iconBtn, { fontSize: 36, padding: 10, height: 65, width: 65, textAlign: 'center' }]}>🎲</Text>
          </TouchableOpacity>
        </View>

        {/* RECENT */}
        {recent.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recently Played</Text>
            <View style={styles.grid}>
              {recent.map(name => {
                const game = gamesData.find(g => g.title.en === name);
                if (game?.horror && !showHorror) return null;
                if (game?.pc && !showPC) return null;
                if (!game) return null;
                return (
                  <View key={name} style={{ width: itemWidth, padding: 6 }}>
                    <Game
                      name={game.title.en}
                      imageSource={game.img}
                      ban={banned}
                      broken={game.broken}
                      onPress={() => {
                        setModalGame(game);
                        setGameLoading(true);
                        setIframeKey(k => k + 1);
                        addRecent(game.title.en);
                      }}
                    />
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* POPULAR */}
        <Text style={styles.sectionTitle}>Popular Games</Text>
        <View style={styles.grid}>
          {popularGames.map(game => (
            <View key={game.title.en} style={{ width: itemWidth * 0.8, padding: 6 }}>
              <Game
                name={game.title.en}
                imageSource={game.img}
                ban={banned}
                broken={game.broken}
                onPress={() => {
                  setModalGame(game);
                  setGameLoading(true);
                  setIframeKey(k => k + 1);
                  addRecent(game.title.en);
                }}
              />
            </View>
          ))}
        </View>

        {/* ALL GAMES */}
        <Text style={styles.sectionTitle}>All Games</Text>
        <View style={styles.grid}>
          {games.map(game => (
            <View key={game.title.en} style={{ width: itemWidth, padding: 6 }}>
              <Game
                name={game.title.en}
                broken={game.broken}
                imageSource={game.img}
                ban={banned}
                onPress={() => {
                  setModalGame(game);
                  setGameLoading(true);
                  setIframeKey(k => k + 1);
                  addRecent(game.title.en);
                }}
              />
            </View>
          ))}
        </View>

        {games.length === 0 && (
          <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 20 }}>
            No games found.
          </Text>
        )}
      </ScrollView>

      {/* MODAL */}
      <Modal visible={!!modalGame} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              {/* Left: close */}
              <ControlIcon
                name="close-circle"
                size={32}
                color="#f1f5f9"
                onPress={() => setModalGame(null)}
                style={{ backgroundColor: 'transparent' }}
              />
              {/* Right: buttons */}
              <View style={styles.modalTopRightOverlay}>
                <ControlIcon name="refresh" size={28} color="#60a5fa" onPress={reloadGame} />
                <ControlIcon name="expand" size={28} color="#60a5fa" onPress={fullscreenGame} />
                <ControlIcon name="alert-circle" size={28} color="#ef4444" onPress={reportGame} />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              {gameLoading && (
                <View style={styles.spinnerContainer}>
                  <Animated.View style={{ transform: [{ rotate }] }}>
                    <Ionicons name="game-controller" size={48} color="#60a5fa" />
                  </Animated.View>
                  <Text style={styles.loadingText}>Loading game...</Text>
                </View>
              )}
              {modalGame && (
                <iframe
                  ref={iframeRef}
                  key={iframeKey}
                  src={modalGame.url}
                  onLoad={() => setGameLoading(false)}
                  style={{ flex: 1, width: '100%', border: 'none', opacity: gameLoading ? 0 : 1 }}
                />
              )}
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
  sectionTitle: { color: '#60a5fa', fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  search: { flex: 1, padding: 16, borderRadius: 16, backgroundColor: '#0f172a', color: 'white', borderWidth: 1, borderColor: '#1e293b', fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  modalBg: { flex: 1, backgroundColor: 'rgba(2,6,23,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '95%', height: '90%', backgroundColor: '#0f172a', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  modalTop: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 14, backgroundColor: '#1e293b', position: 'relative' },
  modalTopRightOverlay: { position: 'absolute', right: 14, top: 14, flexDirection: 'row', gap: 12 },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
  noticeBox: { padding: 24, borderRadius: 24, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)', marginBottom: 20 },
  noticeTitle: { color: '#60a5fa', fontSize: 28, fontWeight: '900', textAlign: 'center', letterSpacing: -0.5 },
  noticeText: { color: '#94a3b8', textAlign: 'center', marginTop: 4, fontWeight: '600', fontSize: 13 },
  iconRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 16 },
  vPipe: { width: 1, height: 24, backgroundColor: '#1e293b' }
});