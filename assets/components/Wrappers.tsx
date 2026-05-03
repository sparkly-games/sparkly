import React, { memo, useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, C } from '@/assets/constants/Theme';
import { Game } from './Game';

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

export { HorizontalRow, ControlIcon, SectionHeader, GameWrapper, FavButton, TrendingBadge, StatChip };