import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, 
  StyleSheet, useWindowDimensions, Linking, Modal, Platform 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';

// Components & Data
import { Game } from '../assets/components/Game';
import { gamesData } from '../assets/data/games';
import { analytics } from '@/assets/data/firebaseConfig.js';
import { logEvent } from 'firebase/analytics';
import { FlipClock } from '@/assets/components/FlipClock';
import banList from '@/public/banlist.json';

const STORAGE_KEYS = { FAVS: 'sparkly:favs', RECENT: 'sparkly:recent' };

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const iframeRef = useRef(null);

  // --- UI & Content State ---
  const [query, setQuery] = useState('');
  const [view, setView] = useState('all');
  const [favs, setFavs] = useState([]);
  const [recent, setRecent] = useState([]);
  const [showHorror, setShowHorror] = useState(false);
  const [showPC, setShowPC] = useState(false);
  const [modalGame, setModalGame] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [isStealth, setIsStealth] = useState(false);

  useEffect(() => {
    // Initial Load
    const f = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVS) || '[]');
    const r = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT) || '[]');
    setFavs(f);
    setRecent(r);

    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        ::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; background: #020617; }
        * { transition: background-color 0.3s ease, border-color 0.3s ease; }
      `;
      document.head.append(style);

      // PANIC KEY: Escape triggers stealth
      const handlePanic = (e) => { if (e.key === 'Escape') toggleStealth(); };
      window.addEventListener('keydown', handlePanic);
      return () => window.removeEventListener('keydown', handlePanic);
    }
  }, []);

  const toggleStealth = () => {
    setIsStealth(!isStealth);
    if (Platform.OS === 'web' && !isStealth) {
      window.history.replaceState({}, '', '/v7-research-notes-p9.pdf');
    }
  };

  const addRecent = (name) => {
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

  const columns = width < 420 ? 2 : width < 1200 ? 5 : 8;
  const itemWidth = (width - 32) / columns;
  const isBanned = () => banList.includes(localStorage.getItem('sparkly:uid'));

  return (
    <View style={[styles.container, isStealth && styles.stealthContainer]}>
      <Head>
        <title>{isStealth ? 'Research - Google Docs' : 'Sparkly Games'}</title>
        <link rel="icon" href={isStealth ? 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico' : '/favicon.ico'} />
      </Head>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!isStealth && (
          <FlipClock targetDate="2026-03-20T11:44:00" caption="the onlinegames12 anniversary" />
        )}

        {/* Dynamic Header */}
        <View style={[styles.noticeBox, isStealth && styles.stealthNoticeBox]}>
          <Text style={[styles.noticeTitle, isStealth && styles.stealthTextPrimary]}>
            {isStealth ? "Document 03/20: Final Notes" : "✨ Sparkly Games ✨"}
          </Text>
          <Text style={[styles.noticeText, isStealth && styles.stealthTextSecondary]}>
            {isStealth ? "Last edited 2 minutes ago" : "v7.9.5 | 8/3/26"}
          </Text>

          <View style={styles.iconRow}>
            {!isStealth && (
              <>
                <ControlIcon name="logo-github" onPress={() => Linking.openURL('https://github.com/sparkly-games')} />
                <ControlIcon name="logo-youtube" onPress={() => router.push('/vids')} />
                <ControlIcon name="volume-high" onPress={() => Linking.openURL('/soundboard.htm')} />
                <ControlIcon name="mic" onPress={() => Linking.openURL('/tts.htm')} />
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
                <ControlIcon name="eye-off-outline" onPress={toggleStealth} disabled />
              </>
            )}
          </View>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={isStealth ? "Search files..." : "Search games..."}
          placeholderTextColor={isStealth ? "#94a3b8" : "#475569"}
          style={[styles.search, isStealth && styles.stealthSearch]}
        />

        {/* Games Grid */}
        <View style={styles.grid}>
          {games.map(game => (
            <View key={game.title.en} style={{ width: itemWidth, padding: 6 }}>
              <Game
                name={isStealth ? `RESEARCH-${game.title.en.replace(/\s+/g, '').toUpperCase()}` : game.title.en}
                imageSource={isStealth ? "useDocOfficial_abc" : game.img}
                ban={isBanned(game)}
                onPress={() => {
                  if (isBanned(game)) return;
                  setModalGame(game);
                  setIframeKey(k => k + 1);
                  addRecent(game.title.en);
                  logEvent(analytics, 'play_game', { game_name: game.title.en });
                }}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modern Game Modal */}
      <Modal visible={!!modalGame} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={[styles.modalContent, isStealth && styles.stealthModal]}>
            <View style={[styles.modalTop, isStealth && styles.stealthModalTop]}>
              <TouchableOpacity onPress={() => setModalGame(null)}>
                <Ionicons name="close-circle" size={32} color={isStealth ? "#5f6368" : "#f1f5f9"} />
              </TouchableOpacity>
              <View style={styles.modalRight}>
                <TouchableOpacity onPress={() => setIframeKey(k => k + 1)}>
                  <Ionicons name="refresh" size={24} color={isStealth ? "#5f6368" : "#94a3b8"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => iframeRef.current?.requestFullscreen?.()}>
                  <Ionicons name="expand" size={24} color={isStealth ? "#5f6368" : "#94a3b8"} />
                </TouchableOpacity>
              </View>
            </View>
            <iframe
              ref={iframeRef}
              key={iframeKey}
              src={modalGame?.url}
              style={{ flex: 1, width: '100%', border: 'none' }}
              title="Game Content"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ControlIcon = ({ name, onPress, color = "white", disabled = false }) => (
  <TouchableOpacity 
    onPress={onPress} 
    activeOpacity={0.7} 
    disabled={disabled} // This stops the click event
    style={[
      styles.iconBtn, 
      disabled && { opacity: 0.3 } // This makes it look "greyed out"
    ]}
  >
    <Ionicons name={name} size={22} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  stealthContainer: { backgroundColor: '#ffffff' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  noticeBox: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    marginBottom: 20,
    backdropFilter: 'blur(10px)', // Web only
  },
  stealthNoticeBox: {
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    borderRadius: 4,
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 10,
  },
  noticeTitle: { color: '#60a5fa', fontSize: 28, fontWeight: '900', textAlign: 'center', letterSpacing: -0.5 },
  stealthTextPrimary: { color: '#202124', fontSize: 22, fontWeight: '400', textAlign: 'left', fontFamily: 'Arial' },
  noticeText: { color: '#94a3b8', textAlign: 'center', marginTop: 4, fontWeight: '600', fontSize: 13 },
  stealthTextSecondary: { color: '#5f6368', textAlign: 'left', marginTop: 2, fontSize: 12 },
  iconRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 16 },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
  vPipe: { width: 1, height: 24, backgroundColor: '#1e293b' },
  search: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    color: 'white',
    borderWidth: 1,
    borderColor: '#1e293b',
    fontSize: 16,
    marginBottom: 20,
  },
  stealthSearch: { backgroundColor: '#f1f3f4', color: '#000', borderColor: 'transparent', borderRadius: 8, height: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  modalBg: { flex: 1, backgroundColor: 'rgba(2,6,23,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '95%', height: '90%', backgroundColor: '#0f172a', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  stealthModal: { width: '100%', height: '100%', borderRadius: 0, backgroundColor: '#fff' },
  modalTop: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, alignItems: 'center', backgroundColor: '#1e293b' },
  stealthModalTop: { backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderColor: '#dadce0' },
  modalRight: { flexDirection: 'row', gap: 20 },
});