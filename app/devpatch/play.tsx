import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image as TintableImage } from 'expo-image';

// ── IMPORT FIREBASE CORE & WEB SDK REMOTE CONFIG ────────────────────────────
import { app } from '@/assets/data/firebaseConfig'; 
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';

import { gamesData } from '@/assets/constants/games';
import { styles, C, GENRE_FILTERS, VIBES } from '@/assets/constants/Theme';
import { FilterPill } from '@/assets/components/FilterPill';
import { HorizontalRow, SectionHeader, GameModal, FilteredGamesDisplay } from '@/assets/components/Wrappers';
import { Header } from '@/assets/components/Header';
import * as hooks from '@/assets/hooks';
import { StatChip, ControlIcon } from '@/assets/components/Wrappers';

interface GameType { title: { en: string }; img: string; url: string; popular?: boolean; horror?: boolean; broken?: boolean; pc?: boolean; genre: string; untested?: boolean; issue?: string; }

const VER_PATCHES = [
  '3xclrdun', '9xg4w9y5', '0p5ttso7', 'g16fpq2h', '1xf6zts0', 'iw74pgdl',
  'uq8xvm3i', 'lkqiftyy', 'rr8ihcet', 'jl9q9q04', 'pebrgtjq', 'wpvym99n', 
  '30flq6w1', 'sbte79gq', 'ss1ksqlb', 'o00wep4v', 'pb6cv93n', 'o1p01qc1', 
  'tqop6gez', 'wfbgx7ez', 'nkmptxv0', 'z6k98i0w', 'xjwj48ud', '53qx9jfl', 
  'g213gtyp', 'exrkqldd', '5gc3ymeh', 'oumntxws', '5rs46hkv', 'otg548fh'
];

const VER_INFO = {
  date: '23/06/26',
  text: '8.5.44',
  patch: VER_PATCHES[4],
};

const isDev = typeof window !== 'undefined' && localStorage.getItem('sparkly_branch') === 'devpatch';
const isNodeDev = process.env.NODE_ENV === 'development';

export default function HomeScreen() {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [vibe] = useState(() => VIBES[ Math.floor( Math.random() * VIBES.length ) ]);
  let showOverridedToast = false;
  if (!isNodeDev && showOverridedToast){
    showOverridedToast = false;
  }
  
  // Dynamic toast state object
  const [toast, setToast] = useState<{ message: string; type: 'warn' | 'info' | string } | null>(null);

  // ── FIREBASE WEB SDK REMOTE CONFIG INSTANTIATION ────────────────────────────
  useEffect(() => {
    const fetchRemoteToast = async () => {
      try {
        // Initialize the Web SDK remote config client module using your provided app reference
        const config = getRemoteConfig(app);

        // Adjust synchronization throttle timing configurations for faster local development cycles
        config.settings.minimumFetchIntervalMillis = __DEV__ ? 0 : 3600000;

        // Pull network parameter data updates and force validation activation
        await fetchAndActivate(config);

        // Extract raw text parameter payload values mapped to your custom 'toast' schema key
        const rawToastJson = getValue(config, 'toast').asString();

        if (rawToastJson) {
          const parsedConfig = JSON.parse(rawToastJson);

          // Evaluate object keys matching your configuration pattern
          if (parsedConfig.showToast && parsedConfig.message) {
            setToast({
              message: parsedConfig.message,
              type: parsedConfig.type || 'info'
            });
          }
          const overrideData = {
            "showToast": "true",
            "message": "Your Tiny Fishing progress has been moved to the updated version!\nClick on \"Tiny Fishing\" to play the updated version with the original progress.\n\nPlanned removals (night of 17/06/26):\n• None!",
            "type": "info"
          }
          if (showOverridedToast || false){
            setToast({
              message: overrideData.message,
              type: overrideData.type || 'info'
            })
          }
        }
      } catch (error) {
        console.warn("Could not retrieve Remote Config variables securely:", error);
      }
    };

    fetchRemoteToast();
  }, []);
  // ────────────────────────────────────────────────────────────────────────────

  const { favorites, toggleFavorite } = hooks.useFavorites();
  const { recent, addRecentGame } = hooks.useRecentGames();
  const { showPC, showHorror, activeGenre, setShowPC, setShowHorror, setActiveGenre } = hooks.useGameFilters();
  const { columns, itemWidth } = hooks.useResponsiveColumns();
  const { modalGame, gameLoading, openGame, closeGame, setGameLoading } = hooks.useGameModal();
  const { favsCollapsed, recentCollapsed, trendingCollapsed, setFavsCollapsed, setRecentCollapsed, setTrendingCollapsed } = hooks.useCollapsedSections();
  const debouncedQuery = hooks.useDebounce(query, 180);
  const filteredGames = hooks.useFilteredGames({ games: gamesData, query: debouncedQuery, showPC, showHorror, activeGenre });
  const handleSelectGame = useCallback((game: GameType) => { addRecentGame(game.title.en); router.setParams({ play: game.title.en }); openGame(game); }, [ addRecentGame, router, openGame ]);
  const handleCloseGame = useCallback(() => { router.setParams({ play: '' }); closeGame(); }, [router, closeGame]);
  const favGamesData = useMemo(() => favorites.map( name => gamesData.find( g => g.title.en === name ) ).filter(Boolean) as GameType[], [favorites] );
  const recentGamesData = useMemo(() => recent.map( name => gamesData.find( g => g.title.en === name ) ).filter(Boolean) as GameType[], [recent] );
  const trendingGames = useMemo(() => gamesData.filter(g => g.popular).slice(0, 12), []);

  const ListHeader = useMemo(() => (
    <>
      <View style={styles.headerContainer}>
        <View style={[styles.sectionHeader]}>
          <Text style={styles.sectionLabel}>MEDIA</Text>
          <View style={styles.navRow}>
            <ControlIcon name="volume-high" onPress={() => Linking.openURL('/sounds/soundboard/')} label="Sounds" />
            <ControlIcon name="newspaper" onPress={() => Linking.openURL('https://sparkly.mintlify.app')} label="Docs" />
            <ControlIcon name="folder" onPress={() => Linking.openURL("https://cdn.jsdelivr.net/npm/ugs-singlefiles@1.0.6/mustard.svg")} label="UGS" />
          {
          //<ControlIcon name="logo-soundcloud" onPress={() => Linking.openURL('https://soundcloak.tijn.dev')} label="Music" />
          //<ControlIcon svg={ <TintableImage source={require("@/assets/images/netflix.svg")} style={{ width: 21, height: 21 }} tintColor={C.muted} /> } onPress={() => Linking.openURL('https://example.com')} label="Openflix" />
          //<ControlIcon name="flask" onPress={() => router.push('/acc/labs')} label="Labs" />
          //<ControlIcon name="logo-youtube" onPress={() => router.push('/media/youtube')} label="Videos" />
          //<ControlIcon svg={ <TintableImage source={require("@/assets/images/jellyfin.svg")} style={{ width: 21, height: 21 }} tintColor={C.muted} /> } onPress={() => router.push('/system/soon/jellyfin')} label="JellyFin" />
          }
          </View>
        </View>
        <View style={styles.statsRow}>
          <StatChip value={gamesData.length} label="games" />
          <View style={styles.statDivider} />
          <StatChip value={favorites.length} label="saved" />
          <View style={styles.statDivider} />
          <StatChip value={recent.length} label="played" />
        </View>
        <View style={[styles.sectionHeader]}>
          <Text style={styles.sectionLabel}>FILTERS</Text>
          <View style={styles.navRow}>
            <ControlIcon name="laptop-outline" active={showPC} color="#60a5fa" onPress={() => { setShowPC(!showPC) }} label="PC" />
            <ControlIcon name="skull-outline" active={showHorror} color={C.hot} onPress={() => { setShowHorror(!showHorror) }} label="Horror" />
          </View>
        </View>
        <View style={[ styles.searchRow, searchFocused && styles.searchRowFocused ]} >
          <View style={[ styles.searchBox, searchFocused && styles.searchBoxFocused ]} >
            <Ionicons name="search" size={18} color={ searchFocused ? C.accentLt : C.muted } style={{ marginLeft: 14 }} />
            <TextInput value={query} onChangeText={(text) => setQuery(text)} onFocus={() => setSearchFocused(true) } placeholder="search games..." placeholderTextColor={ C.muted } style={styles.searchInput} />

            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('') } style={{ paddingRight: 14 }} >
                <Ionicons name="close-circle" size={18} color={C.muted} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.randomBtn} activeOpacity={0.8} onPress={() => { const random = filteredGames[ Math.floor( Math.random() * filteredGames.length ) ]; if (random) { handleSelectGame(random); }}} >
            <Text style={{ fontSize: 22 }} > 🎲 </Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={ false } style={styles.pillsScroll} contentContainerStyle={ styles.pillsContent } >
          {GENRE_FILTERS.map(item => (
            <FilterPill key={item.id} item={item} active={ activeGenre === item.id } onPress={setActiveGenre} />
          ))}
        </ScrollView>

        {trendingGames.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="🔥 Trending Now" collapsed={trendingCollapsed} onToggle={() => setTrendingCollapsed(prev => !prev)} titleStyle={{ color: C.gold }} />
            {!trendingCollapsed && ( <HorizontalRow games={trendingGames} onPress={ handleSelectGame } favorites={favorites} onToggleFav={ toggleFavorite } /> )}
          </View>
        )}

        {favGamesData.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="❤️ Your Favorites" count={favGamesData.length} collapsed={favsCollapsed} onToggle={() => setFavsCollapsed(prev => !prev)} titleStyle={{ color: C.hot }} />
            {!favsCollapsed && ( <HorizontalRow games={favGamesData} onPress={ handleSelectGame } favorites={favorites} onToggleFav={ toggleFavorite } /> )}
          </View>
        )}

        {recentGamesData.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="⚡ Recently Played" count={recentGamesData.length} collapsed={recentCollapsed} onToggle={() => setRecentCollapsed(prev => !prev)} titleStyle={{ color: C.green }} />
            {!recentCollapsed && (
              <HorizontalRow games={recentGamesData} onPress={ handleSelectGame } favorites={favorites} onToggleFav={ toggleFavorite } />
            )}
          </View>
        )}
        <SectionHeader title="🎮 Library" count={filteredGames.length} titleStyle={{ color: C.gold }} />
      </View>
    </>
  ), [
  showPC,
  showHorror,
  activeGenre,
  favorites,
  recent,
  favsCollapsed,
  recentCollapsed,
  trendingCollapsed,
  setShowPC,
  setShowHorror,
  setActiveGenre,
] );

  return (
    <View style={styles.container}>
      {/* ── TOAST DISPLAY PANEL ────────────────────────────────────────────── */}
      {toast && (
        <View style={{ 
          flexDirection: 'row',
          position: 'absolute',
          top: 50, 
          right: 20,
          zIndex: 9999,
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: toast.type === 'warn' ? "#751616" : "#1e293b", 
          paddingVertical: 12, 
          paddingHorizontal: 16,
          borderRadius: 10, 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}>
          <Text style={{ 
            flex: 1,
            fontSize: 12, 
            fontWeight: "bold", 
            color: toast.type === 'warn' ? "#ffebeb" : C.text, 
            textAlign: 'left',
            lineHeight: 16,
          }}>
            {toast.message}
          </Text>
          <TouchableOpacity 
            onPress={() => setToast(null)} 
            style={{ marginLeft: 12, padding: 4 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={16} color={toast.type === 'warn' ? "#ffebeb" : C.muted} />
          </TouchableOpacity>
        </View>
      )}

      <Header {...{ vibe, gamesData, favorites, recent, showPC, showHorror, setShowPC, setShowHorror, VER_INFO }} />
      <FilteredGamesDisplay {...{ filteredGames, columns, itemWidth , ListHeader, favorites, toggleFavorite, handleSelectGame, isDev }} />
      <GameModal closeGame={handleCloseGame} {...{ modalGame, favorites, iframeRef, toggleFavorite, setGameLoading, gameLoading }} />
    </View>
  );
}