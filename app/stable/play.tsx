import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';

import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { gamesData } from '@/assets/constants/games';

import { styles, C, GENRE_FILTERS, VIBES } from '@/assets/constants/Theme';
import { FilterPill } from '@/assets/components/FilterPill';
import { HorizontalRow, SectionHeader, GameModal, FilteredGamesDisplay } from '@/assets/components/Wrappers';

import { Header } from '@/assets/components/Header';

import * as hooks from '@/assets/hooks';

// --- TYPES ---

interface GameType { title: { en: string }; img: string; url: string; popular?: boolean; horror?: boolean; broken?: boolean; pc?: boolean; genre?: string; }

// --- CONSTANTS ---

const VER_PATCHES = [
  '3xclrdun', '9xg4w9y5', '0p5ttso7', 'g16fpq2h', '1xf6zts0', 'iw74pgdl',
  'uq8xvm3i', 'lkqiftyy', 'rr8ihcet', 'jl9q9q04', 'pebrgtjq', 'wpvym99n', 
  '30flq6w1', 'sbte79gq', 'ss1ksqlb', 'o00wep4v', 'pb6cv93n', 'o1p01qc1', 
  'tqop6gez', 'wfbgx7ez', 'nkmptxv0', 'z6k98i0w', 'xjwj48ud', '53qx9jfl', 
  'g213gtyp', 'exrkqldd', '5gc3ymeh', 'oumntxws', '5rs46hkv', 'otg548fh'
];

const VER_INFO = {
  date: '7/5/26',
  text: '8.1.4',
  patch: VER_PATCHES[10],
};

// --- SCREEN ---

export default function HomeScreen() {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [vibe] = useState(() => VIBES[ Math.floor( Math.random() * VIBES.length ) ]);
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

  const trendingGames = useMemo(
    () =>
      gamesData
        .filter(g => g.popular)
        .slice(0, 12),
    []
  );

  // --- HEADER ---

  const ListHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        <Header {...{ vibe, gamesData, favorites, recent, showPC, showHorror, setShowPC, setShowHorror, VER_INFO }} />
        <View style={[ styles.searchRow, searchFocused && styles.searchRowFocused ]} >
          <View style={[ styles.searchBox, searchFocused && styles.searchBoxFocused ]} >
            <Ionicons name="search" size={18} color={ searchFocused ? C.accentLt : C.muted } style={{ marginLeft: 14 }} />
            <TextInput value={query} onChangeText={setQuery} onFocus={() => setSearchFocused(true) } onBlur={() => setSearchFocused(false) } placeholder="search games..." placeholderTextColor={ C.muted } style={styles.searchInput} />

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

        {/* GENRES */}

        <ScrollView horizontal showsHorizontalScrollIndicator={ false } style={styles.pillsScroll} contentContainerStyle={ styles.pillsContent } >
          {GENRE_FILTERS.map(item => (
            <FilterPill key={item.id} item={item} active={ activeGenre === item.id } onPress={setActiveGenre} />
          ))}
        </ScrollView>

        {/* TRENDING */}

        {trendingGames.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="🔥 Trending Now"
              collapsed={
                trendingCollapsed
              }
              onToggle={() =>
                setTrendingCollapsed(
                  prev => !prev
                )
              }
            />

            {!trendingCollapsed && (
              <HorizontalRow
                games={trendingGames}
                onPress={
                  handleSelectGame
                }
                favorites={favorites}
                onToggleFav={
                  toggleFavorite
                }
              />
            )}
          </View>
        )}

        {/* FAVORITES */}

        {favGamesData.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="❤️ Your Favorites"
              count={
                favGamesData.length
              }
              collapsed={
                favsCollapsed
              }
              onToggle={() =>
                setFavsCollapsed(
                  prev => !prev
                )
              }
            />

            {!favsCollapsed && (
              <HorizontalRow
                games={favGamesData}
                onPress={
                  handleSelectGame
                }
                favorites={favorites}
                onToggleFav={
                  toggleFavorite
                }
              />
            )}
          </View>
        )}

        {/* RECENT */}

        {recentGamesData.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="⚡ Recently Played" count={ recentGamesData.length } collapsed={ recentCollapsed } onToggle={() => setRecentCollapsed( prev => !prev )} />
            {!recentCollapsed && (
              <HorizontalRow games={recentGamesData} onPress={ handleSelectGame } favorites={favorites} onToggleFav={ toggleFavorite } />
            )}
          </View>
        )}
        <SectionHeader title="🎮 Library" count={filteredGames.length} />
      </View>
    ),

    [ vibe, favorites, recent, showPC, showHorror, query, searchFocused, activeGenre, filteredGames, favGamesData, recentGamesData, trendingGames, favsCollapsed, recentCollapsed, trendingCollapsed, handleSelectGame, toggleFavorite ]
  );

  // --- RENDER ---

  return (
    <View style={styles.container}>
      <FilteredGamesDisplay {...{ filteredGames, columns, itemWidth , ListHeader, favorites, toggleFavorite, handleSelectGame }} />
      <GameModal closeGame={handleCloseGame} {...{ modalGame, favorites, iframeRef, toggleFavorite, setGameLoading, gameLoading }} />
    </View>
  );
}