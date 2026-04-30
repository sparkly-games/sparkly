import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, useWindowDimensions, Linking, Modal, Platform,
  ActivityIndicator, Animated, ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import Ionicons from '@expo/vector-icons/Ionicons';

import { GlitchText } from '@/assets/components/GlitchText';
import { Game } from '../../assets/components/Game';
import { gamesData } from './media/games';
import { GameWall } from '@/assets/components/GameWall';

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
const VER_INFO = { date: '30/4/26', text: '8.1.2', patch: VER_PATCHES[6] };

const GENRE_FILTERS = [
  { id: 'all', label: '✦ All', color: '#818cf8' },
  { id: 'action', label: '⚡ Action', color: '#f59e0b' },
  { id: 'racing', label: '🏎 Racing', color: '#f87171' },
  { id: 'sports', label: '🏆 Sports', color: '#fbbf24' },
  { id: 'puzzle', label: '🧩 Puzzle', color: '#34d399' },
  { id: 'survival', label: '💀 Survival', color: '#a78bfa' },
  { id: 'adventure', label: '🗺 Adventure', color: '#fb923c' },
  { id: 'clicker', label: '🖱 Clicker', color: '#e879f9' },
  { id: 'platformer', label: '🏷️ Platformer', color: '#ef4444' },
];

// 46 different "vibe" texts.
const VIBES = [
  "no teachers here 😈",
  "zero homework zone 🎮",
  "skill issue? skill issue.",
  "rage quit? never heard of it.",
  "built different, plays different",
  "lunch break? more like boss fight.",
  "loading infinite fun...",
  "attendance? never heard of her.",
  "your high score is someone else's tutorial.",
  "W only. no L's allowed.",
  "this is not a drill. this is a boss.",
  "we don't pause here.",
  "npc behaviour detected. not you though.",
  "undefeated since forever 🏆",
  "touch grass later.",
  "main character mode: activated.",
  "the game doesn't end. you do.",
  "lwk goated fr.",
  "no cap, this hits different.",
  "notifications off. game on.",
  "respawn incoming... just kidding, you're fine.",
  "teacher left the room 👀",
  "speedrun any%",
  "plot twist: you win.",
  "ctrl + z doesn't work in real life. here it does.",
  "silent but deadly at this game.",
  "not procrastinating. practising.",
  "the tutorial was optional. you're not.",
  "your focus just unlocked. use it.",
  "lag is a myth. you're just early.",
  "zero gravity on the leaderboard rn.",
  "certified banger alert 🔊",
  "play stupid games, win stupid prizes... jk you always win.",
  "wifi strong. excuses weak.",
  "one more level. always one more level.",
  "the grind doesn't stop, it just loads.",
  "nobody beats you here. facts.",
  "no homework was harmed in the making of this session.",
  "free period loading... complete ✅",
  "finals? we don't do that here.",
  "high score or high standards? both.",
  "living rent free in the leaderboard.",
  "they said it couldn't be done. they were wrong.",
  "game face: on. everything else: off.",
  "extra life acquired 🟢",
  "sleep is a checkpoint, not a game over.",
  "insert coin. wait, it's free. go wild.",
];

// --- PALETTE ---
const C = {
  bg: '#020617',
  surface: '#0a0f1e',
  card: '#0d1526',
  border: '#1a2744',
  accent: '#6366f1',
  accentLt: '#818cf8',
  hot: '#f43f5e',
  gold: '#fbbf24',
  muted: '#475569',
  mutedLt: '#64748b',
  text: '#f1f5f9',
  textDim: '#94a3b8',
  green: '#34d399',
};

// --- ANIMATED PILL ---
const FilterPill = memo(({ item, active, onPress }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    onPress(item.id);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={[
          styles.pill,
          active && { backgroundColor: item.color + '22', borderColor: item.color },
        ]}
      >
        <Text style={[styles.pillText, active && { color: item.color }]}>{item.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

// --- TRENDING BADGE ---
const TrendingBadge = memo(() => (
  <View style={styles.trendingBadge}>
    <Text style={styles.trendingText}>🔥</Text>
  </View>
));

// --- FAV BUTTON ---
const FavButton = memo(({ isFav, onToggle }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.4, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.favBadge} activeOpacity={0.8}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={15} color={isFav ? C.hot : '#fff'} />
      </Animated.View>
    </TouchableOpacity>
  );
});

// --- GAME CARD ---
const GameWrapper = memo(({ game, width, onPress, isFav, onToggleFav }: any) => {
  return (
    <View style={{ width, padding: 5 }}>
      <View style={styles.gameCard}>
        <Game
          name={game.title.en}
          imageSource={game.img}
          broken={game.broken}
          issueId={game.issue}
          onPress={() => onPress(game)}
        />
        {game.popular && <TrendingBadge />}
        <FavButton isFav={isFav} onToggle={() => onToggleFav(game.title.en)} />
      </View>
    </View>
  );
});

// --- ICON BUTTON ---
const ControlIcon = memo(({ name, onPress, color = C.accentLt, size = 21, active = false, label }: any) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.iconBtn, active && { backgroundColor: color + '25', borderColor: color + '80' }]}
  >
    <Ionicons name={name} size={size} color={active ? color : C.muted} />
    {label ? <Text style={[styles.iconLabel, active && { color }]}>{label}</Text> : null}
  </TouchableOpacity>
));

// --- STAT CHIP ---
const StatChip = memo(({ value, label }: any) => (
  <View style={styles.statChip}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
));

// --- SECTION HEADER (optionally collapsible) ---
const SectionHeader = memo(({ title, count, collapsed, onToggle }: any) => {
  const rotate = useRef(new Animated.Value(collapsed ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotate, {
      toValue: collapsed ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [collapsed]);

  const chevronRotate = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-90deg'] });

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={onToggle ? 0.7 : 1}
      style={styles.sectionRow}
      disabled={!onToggle}
    >
      <Text style={styles.sectionTitle}>{title}</Text>
      {count !== undefined && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      )}
      {onToggle && (
        <Animated.View style={{ marginLeft: 'auto', transform: [{ rotate: chevronRotate }] }}>
          <Ionicons name="chevron-down" size={18} color={C.muted} />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
});

// --- HORIZONTAL GAME ROW ---
const HorizontalRow = memo(({ games, onPress, favorites, onToggleFav }: any) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
    {games.map((game: GameType) => (
      <View key={game.title.en} style={styles.hCard}>
        <Game
          name={game.title.en}
          imageSource={game.img}
          broken={game.broken}
          onPress={() => onPress(game)}
        />
        <FavButton isFav={favorites.includes(game.title.en)} onToggle={() => onToggleFav(game.title.en)} />
      </View>
    ))}
  </ScrollView>
));

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
    if (width < 768) return 3;
    if (width < 1100) return 4;
    if (width < 1400) return 6;
    return 8;
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

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  listPadding: { padding: 16, paddingBottom: 120 },
  headerContainer: { marginBottom: 8 },

  // HERO
  hero: {
    padding: 28,
    borderRadius: 28,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 20,
    alignItems: 'center',
  },
  heroBadge: {
    backgroundColor: C.hot + '20',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: C.hot + '60',
    marginBottom: 14,
  },
  heroBadgeText: {
    color: C.hot,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: C.accentLt,
    letterSpacing: -1,
    textAlign: 'center',
  },
  heroVibe: {
    color: C.mutedLt,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 8,
  },
  statChip: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statValue: {
    color: C.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: C.border,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  iconBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    gap: 4,
    minWidth: 52,
  },
  iconLabel: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  vPipe: { width: 1, height: 32, backgroundColor: C.border },
  verText: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 16,
    letterSpacing: 0.5,
  },

  // SEARCH
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  searchRowFocused: {},
  searchBox: {
    flex: 1,
    height: 52,
    backgroundColor: C.surface,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  searchBoxFocused: {
    borderColor: C.accent + '80',
    backgroundColor: C.card,
  },
  searchInput: {
    flex: 1,
    color: C.text,
    fontSize: 15,
    paddingHorizontal: 12,
    fontWeight: '500',
  },
  randomBtn: {
    width: 52,
    height: 52,
    backgroundColor: C.accent,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // GENRE PILLS
  pillsScroll: { marginBottom: 20, marginHorizontal: -16 },
  pillsContent: { paddingHorizontal: 16, gap: 8, flexDirection: 'row' },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  pillText: {
    color: C.textDim,
    fontSize: 13,
    fontWeight: '600',
  },

  // SECTIONS
  section: { marginBottom: 24 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: C.accent + '25',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: C.accent + '50',
  },
  countText: {
    color: C.accentLt,
    fontSize: 12,
    fontWeight: '700',
  },

  // GAME CARD
  gameCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    position: 'relative',
  },
  trendingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: C.hot + '60',
  },
  trendingText: { fontSize: 12 },
  favBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  // HORIZONTAL CARD
  hCard: {
    width: 140,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    position: 'relative',
  },

  // EMPTY STATE
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: C.text, fontSize: 20, fontWeight: '800', marginBottom: 6 },
  emptySubtitle: { color: C.muted, fontSize: 14, fontWeight: '500' },

  // MODAL
  modalBg: { flex: 1, backgroundColor: 'rgba(2,6,23,0.97)' },
  modalContent: {
    flex: 1,
    margin: Platform.OS === 'web' ? 16 : 0,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  modalBar: {
    height: 64,
    backgroundColor: C.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  modalMeta: { flex: 1, gap: 3 },
  modalTitle: {
    color: C.text,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: -0.3,
  },
  modalTrendChip: {
    alignSelf: 'flex-start',
    backgroundColor: C.hot + '20',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: C.hot + '50',
  },
  modalTrendText: {
    color: C.hot,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalActions: { flexDirection: 'row', gap: 8 },
  modalIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  modalIconActive: {
    borderColor: C.hot + '60',
    backgroundColor: C.hot + '15',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: C.bg,
    gap: 12,
    zIndex: 10,
  },
  loaderText: {
    color: C.muted,
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});