import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image as TintableImage } from 'expo-image';

import { gamesData } from '@/assets/constants/games';
import { styles, C, GENRE_FILTERS, VIBES } from '@/assets/constants/Theme';
import { FilterPill } from '@/assets/components/FilterPill';
import { HorizontalRow, SectionHeader, GameModal, FilteredGamesDisplay } from '@/assets/components/Wrappers';
import { Header } from '@/assets/components/Header';
import * as hooks from '@/assets/hooks';
import { StatChip, ControlIcon } from '@/assets/components/Wrappers';

interface GameType { title: { en: string }; img: string; url: string; popular?: boolean; horror?: boolean; broken?: boolean; pc?: boolean; genre: string; untested?: boolean; issue?: string; }

const verDisplay = `v8.8.1 · 2026`;

const isDev = typeof window !== 'undefined' && localStorage.getItem('sparkly_branch') === 'devpatch';
const isNodeDev = process.env.NODE_ENV === 'development';

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
  const trendingGames = useMemo(() => gamesData.filter(g => g.popular).slice(0, 12), []);

  const ListHeader = useMemo(() => (
    <>
      <View style={styles.headerContainer}>
        <View style={[styles.sectionHeader]}>
          <View style={styles.navRow}>
            <ControlIcon name="laptop-outline" active={showPC} color="#60a5fa" onPress={() => { setShowPC(!showPC) }} />
            <ControlIcon name="skull-outline" active={showHorror} color={C.hot} onPress={() => { setShowHorror(!showHorror) }} />
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statDivider} />
          <StatChip value={gamesData.length} label="games" />
          <View style={styles.statDivider} />
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
      <Header {...{ vibe, gamesData, favorites, recent, showPC, showHorror, setShowPC, setShowHorror, verDisplay }} />
      <FilteredGamesDisplay {...{ filteredGames, columns, itemWidth , ListHeader, favorites, toggleFavorite, handleSelectGame, isDev }} />
      <GameModal closeGame={handleCloseGame} {...{ modalGame, favorites, iframeRef, toggleFavorite, setGameLoading, gameLoading }} />
    </View>
  );
}