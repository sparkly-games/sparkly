import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  useWindowDimensions, Linking, Modal, Platform,
  ActivityIndicator, Animated, ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import Ionicons from '@expo/vector-icons/Ionicons';

import { GlitchText } from '@/assets/components/GlitchText';
import { Game } from '../../assets/components/Game';
import { gamesData } from '../../assets/constants/games';
import { GameWall } from '@/assets/components/GameWall';

import { styles, C, GENRE_FILTERS, VIBES } from '@/assets/constants/Theme';
import { FilterPill } from '@/assets/components/FilterPill';
import { HorizontalRow, ControlIcon, SectionHeader, GameWrapper, StatChip } from '@/assets/components/Wrappers';

// --- TYPES ---
interface GameType {
  title: { en: string };
  img: string;
  url: string;
  popular?: boolean;
  horror?: boolean;
  broken?: boolean;
  pc?: boolean;
  genre?: string;
}

// --- CONSTANTS ---
const STORAGE_KEYS = {
  FAVS: 'sparkly:favs',
  RECENT: 'sparkly:recent',
  FILTERS: 'sparkly:filters',
};

const VER_PATCHES = [
  "3xclrdun", "9xg4w9y5", "0p5ttso7", "g16fpq2h", "1xf6zts0",
  "iw74pgdl", "uq8xvm3i", "lkqiftyy", "rr8ihcet", "jl9q9q04",
  "pebrgtjq", "wpvym99n", "zdf6ts8x", "n69ldwh4", "30flq6w1",
  "sbte79gq", "ss1ksqlb", "o00wep4v", "pb6cv93n", "o1p01qc1",
  "tqop6gez", "wfbgx7ez", "nkmptxv0", "z6k98i0w", "xjwj48ud",
  "53qx9jfl", "g213gtyp", "exrkqldd", "5gc3ymeh", "oumntxws",
  "5rs46hkv", "otg548fh",
];
const VER_INFO = { date: '3/5/26', text: '8.1.3', patch: VER_PATCHES[9] };

// --- MAIN SCREEN ---
export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // STATE
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showHorror, setShowHorror] = useState(false);
  const [showPC, setShowPC] = useState(false);
  const [modalGame, setModalGame] = useState<GameType | null>(null);
  const [gameLoading, setGameLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('all');
  const [vibe] = useState(() => VIBES[Math.floor(Math.random() * VIBES.length)]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [favsCollapsed, setFavsCollapsed] = useState(false);
  const [recentCollapsed, setRecentCollapsed] = useState(false);

  // PERSISTENCE
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      setRecent(JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT) || '[]'));
      setFavorites(JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVS) || '[]'));
      const f = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILTERS) || '{}');
      setShowPC(f.showPC ?? false);
      setShowHorror(f.showHorror ?? false);
    } catch (e) { console.error('Load error', e); }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined')
      localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify({ showPC, showHorror }));
  }, [showPC, showHorror]);

  // HANDLERS
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

  const closeGame = useCallback(() => {
    router.setParams({ play: '' });
    setModalGame(null);
  }, [router]);

  // COMPUTED
  const columns = useMemo(() => {
    if (width < 480) return 2;
    if (width < 768) return 4;
    if (width < 1100) return 6;
    if (width < 1400) return 8;
    return 10;
  }, [width]);

  const itemWidth = useMemo(() => (width - 32) / columns, [width, columns]);

  const filteredGames = useMemo(() => {
    return gamesData
      .filter(g => (showHorror || !g.horror) && (showPC || !g.pc))
      .filter(g => activeGenre === 'all' || g.genre === activeGenre)
      .filter(g => g.title.en.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.title.en.localeCompare(b.title.en));
  }, [query, showHorror, showPC, activeGenre]);

  const favGamesData = useMemo(() =>
    favorites.map(n => gamesData.find(g => g.title.en === n)).filter(Boolean) as GameType[],
    [favorites]);

  const recentGamesData = useMemo(() =>
    recent.map(n => gamesData.find(g => g.title.en === n)).filter(Boolean) as GameType[],
    [recent]);

  const trendingGames = useMemo(() =>
    gamesData.filter(g => g.popular).slice(0, 12),
    []);

  // HEADER (memoised to avoid remount on every render)
  const ListHeader = useMemo(() => (
    <View style={styles.headerContainer}>
      {/* HERO */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>LIVE</Text>
        </View>
        <GlitchText style={styles.heroTitle}>SPARKLY</GlitchText>
        <Text style={styles.heroVibe}>{vibe}</Text>

        <View style={styles.statsRow}>
          <StatChip value={gamesData.length} label="games" />
          <View style={styles.statDivider} />
          <StatChip value={favorites.length} label="saved" />
          <View style={styles.statDivider} />
          <StatChip value={recent.length} label="played" />
        </View>

        {/* NAV ICONS */}
        <View style={styles.navRow}>
          <ControlIcon name="logo-youtube" onPress={() => router.push('/media/youtube')} label="Videos" />
          <ControlIcon name="logo-soundcloud" onPress={() => Linking.openURL('https://soundcloak.instatunnel.my')} label="Music" />
          <ControlIcon name="volume-high" onPress={() => Linking.openURL('/soundboard.htm')} label="Sounds" />
          <ControlIcon name="tv-outline" onPress={() => router.push('/system/soon/a9f3k2x8')} label="TV" />
          <View style={styles.vPipe} />
          <ControlIcon name="desktop-outline" active={showPC} color="#60a5fa" onPress={() => setShowPC(p => !p)} label="PC" />
          <ControlIcon name="skull-outline" active={showHorror} color={C.hot} onPress={() => setShowHorror(p => !p)} label="Horror" />
        </View>

        <Text style={styles.verText}>
          {`v${VER_INFO.text} · ${typeof window !== 'undefined' && localStorage.getItem('sparkly_branch') === 'devpatch' ? VER_INFO.patch : VER_INFO.date}`}
        </Text>
      </View>

      {/* SEARCH */}
      <View style={[styles.searchRow, searchFocused && styles.searchRowFocused]}>
        <View style={[styles.searchBox, searchFocused && styles.searchBoxFocused]}>
          <Ionicons name="search" size={18} color={searchFocused ? C.accentLt : C.muted} style={{ marginLeft: 14 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="search games..."
            placeholderTextColor={C.muted}
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={{ paddingRight: 14 }}>
              <Ionicons name="close-circle" size={18} color={C.muted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.randomBtn}
          onPress={() => handleSelectGame(filteredGames[Math.floor(Math.random() * filteredGames.length)])}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 22 }}>🎲</Text>
        </TouchableOpacity>
      </View>

      {/* GENRE PILLS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll} contentContainerStyle={styles.pillsContent}>
        {GENRE_FILTERS.map(item => (
          <FilterPill key={item.id} item={item} active={activeGenre === item.id} onPress={setActiveGenre} />
        ))}
      </ScrollView>

      {/* TRENDING */}
      {trendingGames.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="🔥 Trending Now" />
          <HorizontalRow
            games={trendingGames}
            onPress={handleSelectGame}
            favorites={favorites}
            onToggleFav={toggleFavorite}
          />
        </View>
      )}

      {/* FAVORITES */}
      {favGamesData.length > 0 && (
        <View style={styles.section}>
          <SectionHeader
            title="❤️ Your Favorites"
            count={favGamesData.length}
            collapsed={favsCollapsed}
            onToggle={() => setFavsCollapsed(p => !p)}
          />
          {!favsCollapsed && (
            <HorizontalRow
              games={favGamesData}
              onPress={handleSelectGame}
              favorites={favorites}
              onToggleFav={toggleFavorite}
            />
          )}
        </View>
      )}

      {/* RECENT */}
      {recentGamesData.length > 0 && (
        <View style={styles.section}>
          <SectionHeader
            title="⚡ Recently Played"
            count={recentGamesData.length}
            collapsed={recentCollapsed}
            onToggle={() => setRecentCollapsed(p => !p)}
          />
          {!recentCollapsed && (
            <HorizontalRow
              games={recentGamesData}
              onPress={handleSelectGame}
              favorites={favorites}
              onToggleFav={toggleFavorite}
            />
          )}
        </View>
      )}

      {/* LIBRARY HEADER */}
      <SectionHeader
        title="🎮 Library"
        count={filteredGames.length}
      />
    </View>
  ), [query, searchFocused, activeGenre, favGamesData, recentGamesData, trendingGames, favorites, recent, showPC, showHorror, filteredGames, favsCollapsed, recentCollapsed]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredGames}
        keyExtractor={item => item.title.en}
        numColumns={columns}
        key={columns}
        ListHeaderComponent={() => ListHeader}
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
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No games found</Text>
            <Text style={styles.emptySubtitle}>Try a different search or filter</Text>
          </View>
        }
      />

      {/* GAME MODAL */}
      <Modal visible={!!modalGame} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            {/* TOP BAR */}
            <View style={styles.modalBar}>
              <TouchableOpacity onPress={closeGame} style={styles.closeBtn} activeOpacity={0.8}>
                <Ionicons name="chevron-down" size={24} color={C.text} />
              </TouchableOpacity>

              <View style={styles.modalMeta}>
                <Text style={styles.modalTitle} numberOfLines={1}>{modalGame?.title.en}</Text>
                {modalGame?.popular && (
                  <View style={styles.modalTrendChip}>
                    <Text style={styles.modalTrendText}>🔥 trending</Text>
                  </View>
                )}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalIconBtn, favorites.includes(modalGame?.title.en || '') && styles.modalIconActive]}
                  onPress={() => toggleFavorite(modalGame?.title.en || '')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={favorites.includes(modalGame?.title.en || '') ? 'heart' : 'heart-outline'}
                    size={20}
                    color={favorites.includes(modalGame?.title.en || '') ? C.hot : C.textDim}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalIconBtn} onPress={() => setGameLoading(true)} activeOpacity={0.7}>
                  <Ionicons name="refresh" size={20} color={C.textDim} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalIconBtn} onPress={() => iframeRef.current?.requestFullscreen()} activeOpacity={0.7}>
                  <Ionicons name="expand" size={20} color={C.textDim} />
                </TouchableOpacity>
              </View>
            </View>

            {/* GAME FRAME */}
            <View style={{ flex: 1, backgroundColor: '#000' }}>
              {gameLoading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={C.accent} />
                  <Text style={styles.loaderText}>loading {modalGame?.title.en}...</Text>
                  <GameWall />
                </View>
              )}
              {modalGame && (
                <iframe
                  ref={iframeRef}
                  src={modalGame.url}
                  style={{ width: '100%', height: '100%', border: 'none', opacity: gameLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
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