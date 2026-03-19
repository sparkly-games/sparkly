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
import { Game } from '../assets/components/Game';
import { gamesData } from '../assets/data/games';
import { FlipClock } from '@/assets/components/FlipClock';
import banList from '@/public/banlist.json';

type GameType = {
  title: { en: string; tlh: string };
  img: string;
  url: string;
  popular?: boolean;
  horror?: boolean;
  broken?: boolean;
  pc?: boolean;
};

const STORAGE_KEYS = { FAVS: 'sparkly:favs', RECENT: 'sparkly:recent', EGGS: 'sparkly:eggs_found' };
const ver = { date: '19/3/26', verText: '7.10' };

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [query, setQuery] = useState('');
  const [view, setView] = useState('all');
  const [favs, setFavs] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [showHorror, setShowHorror] = useState(false);
  const [showPC, setShowPC] = useState(false);
  const [modalGame, setModalGame] = useState<GameType | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [isStealth, setIsStealth] = useState(false);
  const [remoteVerText, setRemoteVerText] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [gameLoading, setGameLoading] = useState(true);

  // --- Scavenger Hunt State ---
  const [foundEggs, setFoundEggs] = useState<string[]>([]);
  const [diceCount, setDiceCount] = useState(0);
  const diceAnim = useRef(new Animated.Value(0)).current;

  const popularGames = useMemo(() => gamesData.filter(g => g.popular), []);

  useEffect(() => {
    // Local Storage
    const f = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVS) || '[]');
    const r = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT) || '[]');
    const e = JSON.parse(localStorage.getItem(STORAGE_KEYS.EGGS) || '[]');
    setFavs(f);
    setRecent(r);
    setFoundEggs(e);

    // Firebase Remote Config
    const checkUpdate = async () => {
      try {
        const config = getRemoteConfig(app);
        config.settings.minimumFetchIntervalMillis = 0;
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

      const handlePanic = (e: KeyboardEvent) => { if (e.key === 'Escape') toggleStealth(); };
      window.addEventListener('keydown', handlePanic);
      return () => window.removeEventListener('keydown', handlePanic);
    }
  }, []);

  const triggerEgg = (id: string) => {
    if (!foundEggs.includes(id)) {
      const updated = [...foundEggs, id];
      setFoundEggs(updated);
      localStorage.setItem(STORAGE_KEYS.EGGS, JSON.stringify(updated));
      logEvent(analytics, 'egg_found', { egg_id: id });
    }
  };

  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 2000, useNativeDriver: true })).start();
  }, []);

  const toggleStealth = () => {
    setIsStealth(!isStealth);
    if (isStealth) triggerEgg('stealth_toggle'); // Egg 1: Exit Stealth
    if (Platform.OS === 'web' && !isStealth) {
      window.history.replaceState({}, '', '/v7-anniversary-report.pdf');
    }
  };

  const handleDice = () => {
    setDiceCount(c => c + 1);
    if (diceCount >= 2) {
      triggerEgg('dice_spam'); // Egg 2: Triple dice tap
      Animated.sequence([
        Animated.timing(diceAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(diceAnim, { toValue: 0, duration: 0, useNativeDriver: true })
      ]).start(playRandom);
    } else {
      playRandom();
    }
  };

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const diceRotation = diceAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] });

  const addRecent = (name: string) => {
    const updated = [name, ...recent.filter(r => r !== name)].slice(0, 20);
    setRecent(updated);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(updated));
  };

  const games = useMemo(() => {
    let filtered = gamesData
      .filter(g => (showHorror || !g.horror) && (showPC || !g.pc))
      .filter(g => g.title.en.toLowerCase().includes(query.toLowerCase()));
    if (view === 'favs') filtered = filtered.filter(g => favs.includes(g.title.en));
    if (view === 'recent') filtered = filtered.filter(g => recent.includes(g.title.en));
    return filtered.sort((a, b) => a.title.en.localeCompare(b.title.en));
  }, [query, showHorror, showPC, view, favs, recent]);

  // Original Box Math
  const columns = width < 420 ? 2 : width < 1200 ? 5 : 8;
  const itemWidth = (width - 32) / columns;

  const banned = useMemo(() => {
    const uid = localStorage.getItem('sparkly:uid');
    return uid ? banList.includes(uid) : false;
  }, []);

  const playRandom = () => {
    const g = gamesData[Math.floor(Math.random() * gamesData.length)];
    setModalGame(g);
  };

  return (
    <View style={[styles.container, isStealth && styles.stealthContainer]}>
      <Head>
        <title>{isStealth ? 'Research - Google Docs' : 'Sparkly Games'}</title>
        <link rel="icon" href={isStealth ? 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico' : '/favicon.ico'} />
      </Head>

      {/* Anniversary Tracker Banner */}
      <View style={[styles.updateBanner, { borderColor: '#fbbf24' }]}>
        <View style={styles.bannerContent}>
          <TouchableOpacity onPress={() => triggerEgg('medal_tap')} style={styles.bannerIconBg}>
            <Ionicons name="medal-sharp" size={18} color="#fff" />
          </TouchableOpacity>          
          <View>
            <Text style={[styles.bannerTitle, { color: '#fbbf24' }]}>One Year Unblocked!</Text>
            <Text style={styles.bannerSub} onPress={() => {localStorage.setItem(STORAGE_KEYS.EGGS, '[]'); setFoundEggs([])}} >Can you find the secrets? Found: {foundEggs.length}/10</Text>
          </View>
        </View>
      </View>

      {!isStealth && showBanner && (
        <TouchableOpacity activeOpacity={0.9} style={styles.updateBanner} onPress={() => window.location.href = '/play'}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerIconBg}><Ionicons name="rocket-sharp" size={18} color="#fff" /></View>
            <View>
              <Text style={styles.bannerTitle}>New Update Available!</Text>
              <Text style={styles.bannerSub}>Version {remoteVerText} is available.</Text>
            </View>
          </View>
          <View style={styles.buttonCornerBannerUpdate}>
            <TouchableOpacity onPress={() => Linking.openURL(`https://github.com/sparkly-games/sparkly/compare/v${ver.verText}..v${remoteVerText}`)} style={styles.ghReleasesButton}>
              View Release Notes
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowBanner(false)} style={styles.bannerCloseBtn}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!isStealth && <FlipClock targetDate="2026-03-19T19:12:00" />}

        <View style={[styles.noticeBox, isStealth && styles.stealthNoticeBox]}>
          <TouchableOpacity onPress={() => triggerEgg('title_tap')}>
            <Text style={[styles.noticeTitle, isStealth && styles.stealthTextPrimary]}>
              {isStealth ? "Document 03/20: Final Notes" : <GlitchText style={styles.noticeTitle}>✨ Sparkly ✨</GlitchText>}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => triggerEgg('ver_tap')}>
            <Text style={[styles.noticeText, isStealth && styles.stealthTextSecondary, foundEggs.includes('ver_tap') && {color: '#fbbf24'}]}>
              {isStealth ? "Last edited 2 minutes ago" : `v${ver.verText} | ${ver.date}`}
            </Text>
          </TouchableOpacity>

          <View style={styles.iconRow}>
            {!isStealth && (
              <>
                <ControlIcon name="logo-github" onPress={() => { Linking.openURL('https://github.com/sparkly-games'); triggerEgg('git_tap'); }} />
                <ControlIcon name="logo-youtube" onPress={() => router.push('/vids')} />
                <ControlIcon name="volume-high" onPress={() => Linking.openURL('/soundboard.htm')} />
                <TouchableOpacity onPress={() => triggerEgg('pipe_tap')} style={styles.vPipe} />
                <ControlIcon name="desktop-outline" color={showPC ? '#60a5fa' : '#475569'} onPress={() => setShowPC(!showPC)} />
                <TouchableOpacity onLongPress={() => triggerEgg('skull_hold')} onPress={() => setShowHorror(!showHorror)}>
                  <Ionicons name="skull-outline" size={22} color={showHorror ? '#ef4444' : '#475569'} style={{padding: 8}} />
                </TouchableOpacity>
                <ControlIcon name="eye-off-outline" onPress={toggleStealth} />
              </>
            )}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, height: 80 }}>
          <TextInput
            value={query}
            onChangeText={(t) => {
              setQuery(t);
              if (t.toLowerCase() === 'sparkly') triggerEgg('search_secret'); // Egg 8: Secret word
            }}
            placeholder={isStealth ? "Search files..." : "Search games..."}
            placeholderTextColor={isStealth ? "#94a3b8" : "#475569"}
            style={[styles.search, isStealth && styles.stealthSearch]}
          />
          <Animated.View style={{ transform: [{ rotate: diceRotation }] }}>
            <TouchableOpacity onPress={() => {isStealth ? toggleStealth() : handleDice;}}>
              <Text style={[styles.iconBtn, { fontSize: 36, padding: 10, height: 65, width: 65, textAlign: 'center' }]}>🎲</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={[styles.sectionTitle, isStealth && styles.stealthTextPrimary]}>Popular Games</Text>
        <View style={styles.grid}>
          {popularGames.map(game => (
            <View key={game.title.en} style={{ width: itemWidth * 0.8, padding: 6 }}>
              <Game
                name={isStealth ? `RESEARCH-${game.title.en.replace(/\s+/g, '').toUpperCase()}` : game.title.en}
                imageSource={isStealth ? "useDocOfficial_abc" : game.img}
                ban={banned}
                onPress={() => {
                  if (banned) return;
                  setModalGame(game);
                  setGameLoading(true);
                  setIframeKey(k => k + 1);
                  addRecent(game.title.en);
                }}
              />
            </View>
          ))}
        </View>

        <View style={styles.grid}>
          {games.map(game => (
            <View key={game.title.en} style={{ width: itemWidth, padding: 6 }}>
              <Game
                name={isStealth ? `RESEARCH-${game.title.en.replace(/\s+/g, '').toUpperCase()}` : game.title.en}
                imageSource={isStealth ? "useDocOfficial_abc" : game.img}
                ban={banned}
                onPress={() => {
                  if (banned) return;
                  setModalGame(game);
                  setGameLoading(true);
                  setIframeKey(k => k + 1);
                  addRecent(game.title.en);
                }}
              />
            </View>
          ))}
        </View>
        
        {!isStealth && (
          <TouchableOpacity onPress={() => triggerEgg('footer_tap')} style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: '#1e293b', fontSize: 10 }}>Sparkly Engine v{ver.verText}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal visible={!!modalGame} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={[styles.modalContent, isStealth && styles.stealthModal]}>
            <View style={[styles.modalTop, isStealth && styles.stealthModalTop]}>
              <TouchableOpacity onPress={() => setModalGame(null)}>
                <Ionicons name="close-circle" size={32} color={isStealth ? "#5f6368" : "#f1f5f9"} />
              </TouchableOpacity>
              <View style={styles.modalRight}>
                <TouchableOpacity onPress={() => { triggerEgg('warn_tap'); }}>
                  <Ionicons name="warning" size={24} color="#005eff11" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { alert('Reported!'); }}>
                  <Ionicons name="warning-outline" size={24} color="#f87171" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIframeKey(k => k + 1)}>
                  <Ionicons name="refresh" size={24} color={isStealth ? "#5f6368" : "#94a3b8"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { // @ts-ignore
                  iframeRef.current?.requestFullscreen?.();
                }}>
                  <Ionicons name="expand" size={24} color={isStealth ? "#5f6368" : "#94a3b8"} />
                </TouchableOpacity>
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
              <iframe
                ref={iframeRef}
                key={iframeKey}
                src={modalGame?.url}
                onLoad={() => setGameLoading(false)}
                style={{ flex: 1, width: '100%', border: 'none', opacity: gameLoading ? 0 : 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ControlIcon = ({ name, onPress, color = "white" }: any) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.iconBtn}>
    <Ionicons name={name} size={22} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  spinnerContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', zIndex: 10 },
  loadingText: { color: '#94a3b8', marginTop: 12, fontSize: 14 },
  ghReleasesButton: { backgroundColor: '#1717179d', padding: 10, borderRadius: 5, borderColor: '#8181816b', borderWidth: 2, opacity: 0.98, color: 'white', fontFamily: 'sans-serif' },
  buttonCornerBannerUpdate: { flexDirection: 'row', gap: 12 },
  container: { flex: 1, backgroundColor: '#020617' },
  stealthContainer: { backgroundColor: '#ffffff' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  noticeBox: { padding: 24, borderRadius: 24, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)', marginBottom: 20, backdropFilter: 'blur(10px)' },
  stealthNoticeBox: { backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: 4, borderWidth: 0, borderBottomWidth: 1, padding: 10 },
  noticeTitle: { color: '#60a5fa', fontSize: 28, fontWeight: '900', textAlign: 'center', letterSpacing: -0.5 },
  stealthTextPrimary: { color: '#202124', fontSize: 22, fontWeight: '400', textAlign: 'left', fontFamily: 'Arial' },
  noticeText: { color: '#94a3b8', textAlign: 'center', marginTop: 4, fontWeight: '600', fontSize: 13 },
  stealthTextSecondary: { color: '#5f6368', textAlign: 'left', marginTop: 2, fontSize: 12 },
  iconRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 16 },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
  vPipe: { width: 1, height: 24, backgroundColor: '#1e293b' },
  sectionTitle: { color: '#60a5fa', fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  updateBanner: { flexDirection: 'row', alignItems: 'center', margin: 24, justifyContent: 'space-between', backgroundColor: '#1e293b', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#3b82f6', marginBottom: 20 },
  bannerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bannerIconBg: { backgroundColor: '#3b82f6', padding: 8, borderRadius: 10 },
  bannerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  bannerSub: { color: '#94a3b8', fontSize: 12 },
  bannerCloseBtn: { padding: 4 },
  search: { flex: 1, padding: 16, borderRadius: 16, backgroundColor: '#0f172a', color: 'white', borderWidth: 1, borderColor: '#1e293b', fontSize: 16 },
  stealthSearch: { backgroundColor: '#f1f3f4', color: '#000', borderColor: 'transparent', borderRadius: 8, height: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  modalBg: { flex: 1, backgroundColor: 'rgba(2,6,23,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '95%', height: '90%', backgroundColor: '#0f172a', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  stealthModal: { width: '100%', height: '100%', borderRadius: 0, backgroundColor: '#fff' },
  modalTop: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, alignItems: 'center', backgroundColor: '#1e293b' },
  stealthModalTop: { backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderColor: '#dadce0' },
  modalRight: { flexDirection: 'row', gap: 20 },
});