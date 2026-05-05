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
import { HorizontalRow, ControlIcon, SectionHeader, GameWrapper, StatChip, LoadingIndicator, ModalBar, GameModal, FilteredGamesDisplay } from '@/assets/components/Wrappers';
import { Header } from '@/assets/components/Header';

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
  const [trendingCollapsed, setTrendingCollapsed] = useState(false);

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
      <Header 
        vibe={vibe}
        gamesData={gamesData}
        favorites={favorites}
        recent={recent}
        showPC={showPC}
        showHorror={showHorror}
        setShowPC={setShowPC}
        setShowHorror={setShowHorror}
        VER_INFO={VER_INFO}
      />

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
          <SectionHeader 
            title="🔥 Trending Now"
            collapsed={trendingCollapsed}
            onToggle={() => setTrendingCollapsed(p => !p)}
          />
          {!trendingCollapsed && (
            <HorizontalRow
              games={trendingGames}
              onPress={handleSelectGame}
              favorites={favorites}
              onToggleFav={toggleFavorite}
            />
          )}
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
  ), [query, searchFocused, trendingCollapsed, activeGenre, favGamesData, recentGamesData, trendingGames, favorites, recent, showPC, showHorror, filteredGames, favsCollapsed, recentCollapsed]);

  return (
    <View style={styles.container}>
      <FilteredGamesDisplay
        filteredGames={filteredGames}
        columns={columns}
        ListHeader={ListHeader}
        itemWidth={itemWidth}
        handleSelectGame={handleSelectGame}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />

      <GameModal 
        modalGame={modalGame}
        closeGame={closeGame}
        favorites={favorites}
        iframeRef={iframeRef}
        toggleFavorite={toggleFavorite}
        setGameLoading={setGameLoading}
        gameLoading={gameLoading}
      />
    </View>
  );
}