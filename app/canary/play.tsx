import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, useWindowDimensions, Linking, Modal, Platform,
  ActivityIndicator, Pressable
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import Ionicons from '@expo/vector-icons/Ionicons';

// Assuming these exist in your project
import { GlitchText } from '@/assets/components/GlitchText';
import { Game } from '../../assets/components/Game';
import { gamesData } from './games';

import { GameFrame } from '@/assets/components/GameFrame';

// --- TYPES ---
interface GameType {
  title: { en: string };
  img: string;
  url: string;
  popular?: boolean;
  horror?: boolean;
  broken?: boolean;
  pc?: boolean;
}

const STORAGE_KEYS = { 
  FAVS: 'sparkly:favs', 
  RECENT: 'sparkly:recent', 
  FILTERS: 'sparkly:filters' 
};

const VER_INFO = { date: '7/4/26', text: '7.12.0' };

// --- SHARED SUB-COMPONENTS ---

const ControlIcon = memo(({ name, onPress, color = "white", size = 22, active = false }: any) => (
  <TouchableOpacity 
    onPress={onPress} 
    activeOpacity={0.7} 
    style={[styles.iconBtn, active && { backgroundColor: color + '20', borderColor: color }]}
  >
    <Ionicons name={name} size={size} color={active ? color : "#94a3b8"} />
  </TouchableOpacity>
));

const GameWrapper = memo(({ game, width, onPress, isFav, onToggleFav }: any) => (
  <View style={{ width, padding: 6, position: 'relative' }}>
    <Game
      name={game.title.en}
      imageSource={game.img}
      broken={game.broken}
      onPress={() => onPress(game)}
    />
    <TouchableOpacity 
      style={styles.favBadge} 
      onPress={() => onToggleFav(game.title.en)}
    >
      <Ionicons 
        name={isFav ? "heart" : "heart-outline"} 
        size={16} 
        color={isFav ? "#ef4444" : "#fff"} 
      />
    </TouchableOpacity>
  </View>
));

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const params = useLocalSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // --- STATE ---
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showHorror, setShowHorror] = useState(false);
  const [showPC, setShowPC] = useState(false);
  const [modalGame, setModalGame] = useState<GameType | null>(null);
  const [gameLoading, setGameLoading] = useState(true);

  // --- PERSISTENCE LOGIC ---
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const r = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT) || '[]');
      const f = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVS) || '[]');
      const filters = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILTERS) || '{}');
      setRecent(r);
      setFavorites(f);
      setShowPC(filters.showPC ?? false);
      setShowHorror(filters.showHorror ?? false);
    } catch (e) { console.error("Load failed", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify({ showPC, showHorror }));
  }, [showPC, showHorror]);

  // --- HANDLERS ---
  const toggleFavorite = useCallback((title: string) => {
    setFavorites(prev => {
      const next = prev.includes(title) ? prev.filter(t => t !== title) : [title, ...prev];
      localStorage.setItem(STORAGE_KEYS.FAVS, JSON.stringify(next));
      return next;
    });
  }, []);

  const handleSelectGame = useCallback((game: GameType) => {
    const updated = [game.title.en, ...recent.filter(r => r !== game.title.en)].slice(0, 15);
    setRecent(updated);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(updated));
    
    router.setParams({ play: game.title.en });
    setModalGame(game);
    setGameLoading(true);
  }, [recent, router]);

  const closeGame = () => {
    router.setParams({ play: '' });
    setModalGame(null);
  };

  // --- COMPUTED DATA ---
  const columns = useMemo(() => {
    if (width < 480) return 2;
    if (width < 768) return 3;
    if (width < 1200) return 5;
    return 8;
  }, [width]);

  const itemWidth = useMemo(() => (width - 32) / columns, [width, columns]);

  const filteredGames = useMemo(() => {
    return gamesData
      .filter(g => (showHorror || !g.horror) && (showPC || !g.pc))
      .filter(g => g.title.en.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.title.en.localeCompare(b.title.en));
  }, [query, showHorror, showPC]);

  const favGamesData = useMemo(() => 
    favorites.map(name => gamesData.find(g => g.title.en === name)).filter(Boolean) as GameType[],
  [favorites]);

  const recentGamesData = useMemo(() => 
    recent.map(name => gamesData.find(g => g.title.en === name)).filter(Boolean) as GameType[],
  [recent]);

  // --- UI COMPONENTS ---
  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.noticeBox}>
        <GlitchText style={styles.noticeTitle}>✨ Sparkly Hub ✨</GlitchText>
        <Text style={styles.noticeText}>{`v${VER_INFO.text} | ${VER_INFO.date}`}</Text>

        <View style={styles.iconRow}>
          <ControlIcon name="logo-youtube" onPress={() => router.push('/vids')} />
          <ControlIcon name="barcode-outline" onPress={() => Linking.openURL('/soundboard.htm')} />
          <ControlIcon name="mic-outline" onPress={() => Linking.openURL('/tts.htm')} />
          <View style={styles.vPipe} />
          <ControlIcon 
            name="desktop-outline" 
            active={showPC}
            color="#60a5fa"
            onPress={() => setShowPC(!showPC)} 
          />
          <ControlIcon 
            name="skull-outline" 
            active={showHorror}
            color="#ef4444"
            onPress={() => setShowHorror(!showHorror)} 
          />
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#475569" style={{marginLeft: 15}} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search titles..."
            placeholderTextColor="#475569"
            style={styles.search}
          />
        </View>
        <TouchableOpacity style={styles.randomBtn} onPress={() => handleSelectGame(filteredGames[Math.floor(Math.random() * filteredGames.length)])}>
          <Text style={styles.randomBtnText}>🎲</Text>
        </TouchableOpacity>
      </View>

      {favGamesData.length > 0 && (
        <View style={{ marginBottom: 25 }}>
          <Text style={styles.sectionTitle}>Favorites ❤️</Text>
          <FlatList
            horizontal
            data={favGamesData}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <GameWrapper 
                game={item} 
                width={160} 
                onPress={handleSelectGame} 
                isFav={true}
                onToggleFav={toggleFavorite}
              />
            )}
          />
        </View>
      )}

      {recentGamesData.length > 0 && (
        <View style={{ marginBottom: 25 }}>
          <Text style={styles.sectionTitle}>Recent Hits 🔥</Text>
          <FlatList
            horizontal
            data={recentGamesData}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <GameWrapper 
                game={item} 
                width={140} 
                onPress={handleSelectGame} 
                isFav={favorites.includes(item.title.en)}
                onToggleFav={toggleFavorite}
              />
            )}
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>Library</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Head>
        <title>Sparkly Hub | {modalGame ? modalGame.title.en : 'Arcade'}</title>
      </Head>

      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.title.en}
        numColumns={columns}
        key={columns}
        ListHeaderComponent={Header}
        renderItem={({ item }) => (
          <GameWrapper 
            game={item} 
            width={itemWidth} 
            onPress={handleSelectGame} 
            isFav={favorites.includes(item.title.en)}
            onToggleFav={toggleFavorite}
          />
        )}
        contentContainerStyle={styles.listPadding}
      />

      <Modal visible={!!modalGame} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              <TouchableOpacity onPress={closeGame} style={styles.closeBtn}>
                <Ionicons name="close-circle" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.modalTitle} numberOfLines={1}>{modalGame?.title.en}</Text>
              <View style={styles.modalActions}>
                <ControlIcon name="heart" color="#ef4444" active={favorites.includes(modalGame?.title.en || '')} onPress={() => toggleFavorite(modalGame?.title.en || '')} />
                <ControlIcon name="refresh" onPress={() => setGameLoading(true)} />
                <ControlIcon name="expand" onPress={() => iframeRef.current?.requestFullscreen()} />
              </View>
            </View>
            <View style={{ flex: 1, backgroundColor: '#000' }}>
              {gameLoading && <ActivityIndicator size="large" color="#60a5fa" style={styles.loader} />}
              {modalGame && (
                <GameFrame
                  ref={iframeRef}
                  src={modalGame.url}
                  style={{ flex: 1, border: 'none', opacity: gameLoading ? 0 : 1 }}
                  onLoad={() => setGameLoading(false)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  listPadding: { padding: 16, paddingBottom: 100 },
  headerContainer: { marginBottom: 10 },
  
  // Notice / Hero
  noticeBox: { padding: 30, borderRadius: 32, backgroundColor: '#0f172a', borderWeight: 1, borderColor: '#1e293b', marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20 },
  noticeTitle: { fontSize: 36, fontWeight: '900', textAlign: 'center', letterSpacing: -1, color: '#60a5fa' },
  noticeText: { color: '#64748b', textAlign: 'center', marginTop: 4, fontWeight: '600', fontSize: 12 },
  iconRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24 },
  vPipe: { width: 1, height: 24, backgroundColor: '#334155', marginHorizontal: 8 },

  // Search
  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  searchContainer: { flex: 1, height: 55, backgroundColor: '#0f172a', borderRadius: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  search: { flex: 1, color: '#fff', fontSize: 16, paddingHorizontal: 15 },
  randomBtn: { width: 55, height: 55, backgroundColor: '#2563eb', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  randomBtnText: { fontSize: 24 },

  // List Sections
  sectionTitle: { color: '#f8fafc', fontSize: 20, fontWeight: '800', marginBottom: 15, marginLeft: 8 },
  favBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', padding: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },

  // Modal
  modalBg: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.95)' },
  modalContent: { flex: 1, margin: Platform.OS === 'web' ? 20 : 0, borderRadius: 24, overflow: 'hidden', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b' },
  modalTop: { height: 70, backgroundColor: '#1e293b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  modalTitle: { color: '#fff', fontWeight: '800', fontSize: 18, flex: 1, textAlign: 'center', marginHorizontal: 20 },
  closeBtn: { padding: 5 },
  modalActions: { flexDirection: 'row', gap: 10 },
  
  // Helpers
  iconBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  loader: { position: 'absolute', top: '50%', left: '50%', transform: [{translateX: -20}, {translateY: -20}] }
});