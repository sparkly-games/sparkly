import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, useWindowDimensions, Linking, Modal, Platform,
  Animated, ActivityIndicator, Pressable
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import Ionicons from '@expo/vector-icons/Ionicons';

// Custom Components
import { GlitchText } from '@/assets/components/GlitchText';
import { Game } from '../../assets/components/Game';
import { gamesData } from './games';

// Configuration & Mock Data (Replace with your imports)
const STORAGE_KEYS = { FAVS: 'sparkly:favs', RECENT: 'sparkly:recent', FILTERS: 'sparkly:filters' };
const VER_INFO = { date: '6/4/26', text: '7.11.9' };

type GameType = {
  title: { en: string };
  img: string;
  url: string;
  popular?: boolean;
  horror?: boolean;
  broken?: boolean;
  pc?: boolean;
};

// --- MEMOIZED COMPONENTS FOR PERFORMANCE ---

const ControlIcon = memo(({ name, onPress, color = "white", size = 22, style = {} }: any) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.iconBtn, style]}>
    <Ionicons name={name} size={size} color={color} />
  </TouchableOpacity>
));

const GameWrapper = memo(({ game, width, onPress, banned }: any) => (
  <View style={{ width, padding: 6 }}>
    <Game
      name={game.title.en}
      imageSource={game.img}
      ban={banned}
      broken={game.broken}
      onPress={() => onPress(game)}
    />
  </View>
));

// --- MAIN COMPONENT ---

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const params = useLocalSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // State
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [showHorror, setShowHorror] = useState(false);
  const [showPC, setShowPC] = useState(false);
  const [modalGame, setModalGame] = useState<GameType | null>(null);
  const [gameLoading, setGameLoading] = useState(true);

  // 1. Grid Logic
  const columns = useMemo(() => {
    if (width < 480) return 2;
    if (width < 768) return 3;
    if (width < 1200) return 5;
    return 8;
  }, [width]);

  const itemWidth = useMemo(() => (width - 32) / columns, [width, columns]);

  // 2. Data Initialization & Persistence
  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT) || '[]');
      const filters = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILTERS) || '{}');
      setRecent(r);
      setShowPC(filters.showPC ?? false);
      setShowHorror(filters.showHorror ?? false);
    } catch (e) { console.error("Storage failed", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify({ showPC, showHorror }));
  }, [showPC, showHorror]);

  // 3. Game Selection Logic
  const handleSelectGame = useCallback((game: GameType) => {
    // Add to recent
    const updated = [game.title.en, ...recent.filter(r => r !== game.title.en)].slice(0, 15);
    setRecent(updated);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(updated));
    
    // Open Modal via URL Param (Good for SEO and Refreshing)
    router.setParams({ play: game.title.en });
    setModalGame(game);
    setGameLoading(true);
  }, [recent, router]);

  // Sync state with URL params
  useEffect(() => {
    if (params.play) {
      const g = gamesData.find(game => game.title.en === params.play);
      if (g) {
        setModalGame(g);
      }
    } else {
      setModalGame(null);
    }
  }, [params.play]);

  // 4. Filtering Logic (Memoized)
  const filteredGames = useMemo(() => {
    return gamesData
      .filter(g => (showHorror || !g.horror) && (showPC || !g.pc))
      .filter(g => g.title.en.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.title.en.localeCompare(b.title.en));
  }, [query, showHorror, showPC]);

  const popularGames = useMemo(() => 
    gamesData.filter(g => g.popular && (showHorror || !g.horror) && (showPC || !g.pc)), 
  [showHorror, showPC]);

  const recentGamesData = useMemo(() => 
    recent.map(name => gamesData.find(g => g.title.en === name)).filter(Boolean) as GameType[],
  [recent]);

  // 5. Modal Actions
  const closeModal = () => {
    router.setParams({ play: '' });
    setModalGame(null);
  };

  const playRandom = () => {
    const pool = filteredGames.length ? filteredGames : gamesData;
    const g = pool[Math.floor(Math.random() * pool.length)];
    handleSelectGame(g);
  };

  // --- RENDERING ---

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Hero Notice */}
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
            color={showPC ? '#60a5fa' : '#475569'} 
            onPress={() => setShowPC(!showPC)} 
          />
          <ControlIcon 
            name="skull-outline" 
            color={showHorror ? '#ef4444' : '#475569'} 
            onPress={() => setShowHorror(!showHorror)} 
          />
        </View>
      </View>

      {/* Search & Actions */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#475569" style={{marginLeft: 15}} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search 1,000+ games..."
            placeholderTextColor="#475569"
            style={styles.search}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color="#475569" style={{marginRight: 15}} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.randomBtn} onPress={playRandom}>
          <Text style={styles.randomBtnText}>🎲</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Recent Scroller */}
      {recentGamesData.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Your Hits 🔥</Text>
          <FlatList
            horizontal
            data={recentGamesData}
            keyExtractor={(item) => `recent-${item.title.en}`}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <GameWrapper game={item} width={160} onPress={handleSelectGame} />
            )}
          />
        </View>
      )}

      {/* Popular Section */}
      <Text style={styles.sectionTitle}>Trending Now 🌟</Text>
      <View style={styles.popularGrid}>
        {popularGames.map(game => (
          <GameWrapper key={`pop-${game.title.en}`} game={game} width={itemWidth} onPress={handleSelectGame} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Full Arcade</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Head>
        <title>Sparkly Hub | {modalGame ? `Playing ${modalGame.title.en}` : 'Unblocked Games'}</title>
        <link rel="icon" href='/favicon.ico' />
      </Head>

      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.title.en}
        numColumns={columns}
        key={columns} // Force re-render on orientation change
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <GameWrapper game={item} width={itemWidth} onPress={handleSelectGame} />
        )}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      {/* GAME PLAYER MODAL */}
      <Modal visible={!!modalGame} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                <Ionicons name="chevron-back" size={24} color="#fff" />
                <Text style={styles.closeBtnText}>Back to Hub</Text>
              </TouchableOpacity>
              
              <View style={styles.modalActions}>
                <ControlIcon name="refresh" onPress={() => setGameLoading(true)} color="#60a5fa" />
                <ControlIcon name="expand" onPress={() => iframeRef.current?.requestFullscreen()} />
              </View>
            </View>

            <View style={{ flex: 1, backgroundColor: '#000' }}>
              {gameLoading && (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" color="#60a5fa" />
                  <Text style={styles.loaderText}>Loading Experience...</Text>
                </View>
              )}
              {modalGame && (
                <iframe
                  ref={iframeRef}
                  src={modalGame.url}
                  style={{ flex: 1, border: 'none', opacity: gameLoading ? 0 : 1 }}
                  onLoad={() => setGameLoading(false)}
                  // Safety sandbox
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
  
  // Notice
  noticeBox: { padding: 24, borderRadius: 28, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', marginBottom: 24 },
  noticeTitle: { fontSize: 32, fontWeight: '900', textAlign: 'center' },
  noticeText: { color: '#64748b', textAlign: 'center', marginTop: 4, fontWeight: '700' },
  iconRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 15, marginTop: 20 },
  vPipe: { width: 1, height: 20, backgroundColor: '#334155' },

  // Search
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 25, alignItems: 'center' },
  searchContainer: { flex: 1, height: 55, backgroundColor: '#0f172a', borderRadius: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  search: { flex: 1, color: '#fff', fontSize: 16, paddingHorizontal: 10 },
  randomBtn: { width: 55, height: 55, backgroundColor: '#2563eb', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  randomBtnText: { fontSize: 24 },

  // Sections
  sectionTitle: { color: '#60a5fa', fontSize: 18, fontWeight: '800', marginBottom: 15, marginLeft: 5 },
  popularGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 30 },

  // Modal
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' },
  modalContent: { flex: 1, margin: Platform.OS === 'web' ? 20 : 0, borderRadius: 20, overflow: 'hidden', backgroundColor: '#0f172a' },
  modalTop: { height: 60, backgroundColor: '#1e293b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  closeBtn: { flexDirection: 'row', alignItems: 'center' },
  closeBtnText: { color: '#fff', fontWeight: '700', marginLeft: 5 },
  modalActions: { flexDirection: 'row', gap: 15 },
  
  // Utilities
  iconBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  loader: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617', zIndex: 5 },
  loaderText: { color: '#94a3b8', marginTop: 15, fontWeight: '600' }
});