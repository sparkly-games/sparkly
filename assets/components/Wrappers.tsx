import React, { memo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, C } from '@/assets/constants/Theme';
import { Game } from './Game';
import { WithLocalSvg } from 'react-native-svg/css';
import { GameWall } from './GameWall';
import { analytics } from '../data/firebaseConfig';
import { logEvent } from 'firebase/analytics';

const reportGamePress = (game: GameType) => {
  if (ENV_VARS.USE_ANALYTICS && analytics) {
    logEvent(analytics, 'game', {
      game: game.title.en,
      genre: game.genre,
    });
  }
};

const refreshIframe = (iframeRef: React.RefObject<HTMLIFrameElement>, setGameLoading: (loading: boolean) => void) => {
  if (iframeRef.current) {
    setGameLoading(true);
    iframeRef.current.src = iframeRef.current.src;
  }
};

type GameType = {
  title: { en: string };
  img: string;
  url: string;
  genre: string;
  popular?: boolean;
  broken?: boolean;
  untested?: boolean;
  issue?: string;
};

type BaseProps = {
  onPress?: (game: GameType) => void;
  favorites?: string[];
  onToggleFav?: (name: string) => void;
  toggleFavorite?: (name: string) => void;
  isDev?: boolean;
};

const filterGames = (games: GameType[], isDev?: boolean) => {
  if (isDev) return games;

  return games.filter(game => game.untested !== true);
};

const TrendingBadge = memo(() => (
  <View style={styles.trendingBadge}>
    <Text style={styles.trendingText}>🔥</Text>
  </View>
));

const FavButton = memo(({ isFav, onToggle }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.favBadge}
      activeOpacity={0.8}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={isFav ? 'heart' : 'heart-outline'}
          size={15}
          color={isFav ? C.hot : '#fff'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
});

const GameWrapper = memo(
  ({ game, width, onPress, isFav, onToggleFav }: any) => {
    return (
      <View style={{ width, padding: 5 }}>
        <View style={styles.gameCard}>
          <Game
            name={game.title.en}
            imageSource={game.img}
            broken={game.broken}
            issueId={game.issue}
            untested={game.untested}
            fixed={game.fixed}
            leaving={game.leaving}
            onPress={() => onPress(game)}
          />

          {game.popular && <TrendingBadge />}

          <FavButton
            isFav={isFav}
            onToggle={() => onToggleFav(game.title.en)}
          />
        </View>
      </View>
    );
  }
);

import { ReactNode } from 'react';
import { StyleSheet, GestureResponderEvent } from 'react-native';
import ENV_VARS from '../data/env';

interface ControlIconProps {
  name?: keyof typeof Ionicons.glyphMap; // Provides autocomplete for your icon names
  onPress: (event: GestureResponderEvent) => void;
  color?: string;
  size?: number;
  active?: boolean;
  label?: string;
  svg?: ReactNode;
}

const ControlIcon = memo(({
  name,
  onPress,
  color = C.accentLt, // Ensure C.accentLt is a 6-digit hex like '#123456'
  size = 21,
  active = false,
  label,
  svg,
}: ControlIconProps) => {

  // Safeguard color manipulation
  const activeBg = color.startsWith('#') && color.length === 7 ? `${color}25` : 'transparent';
  const activeBorder = color.startsWith('#') && color.length === 7 ? `${color}80` : color;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.iconBtn,
        active && {
          backgroundColor: activeBg,
          borderColor: activeBorder,
        },
      ]}
    >
      {/* Render Ionicons ONLY if name is provided */}
      {name && (
        <Ionicons
          name={name}
          size={size}
          color={active ? color : C.muted}
        />
      )}

      {/* Render SVG if provided, removing the forced margin unless both exist */}
      {svg && (
        <View style={name ? { marginLeft: 8 } : null}>
          {typeof svg === 'number' ? (
            /* If a require() numeric ID is passed, render it dynamically */
            <WithLocalSvg asset={svg} width={size} height={size} />
          ) : (
            /* If a standard React element/JSX was passed */
            svg
          )}
        </View>
      )}

      {/* Render Label */}
      {label && (
        <Text style={[styles.iconLabel, active && { color }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
});

const StatChip = memo(({ value, label }: any) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    let start = 0;

    const duration = 700;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    const counter = setInterval(() => {
      start++;

      const progress = start / totalFrames;

      const eased = 1 - Math.pow(1 - progress, 3);

      const current = Math.round(eased * value);

      setDisplayValue(current);

      if (start >= totalFrames) {
        setDisplayValue(value);
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <View style={styles.statChip}>
      <Text style={styles.statValue}>{displayValue}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
});

const SectionHeader = memo(
  ({ title, count, collapsed, onToggle }: any) => {
    const rotate = useRef(
      new Animated.Value(collapsed ? 1 : 0)
    ).current;

    useEffect(() => {
      Animated.timing(rotate, {
        toValue: collapsed ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [collapsed]);

    const chevronRotate = rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-90deg'],
    });

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
          <Animated.View
            style={{
              marginLeft: 'auto',
              transform: [{ rotate: chevronRotate }],
            }}
          >
            <Ionicons
              name="chevron-down"
              size={18}
              color={C.muted}
            />
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  }
);

const HorizontalRow = ({
  games,
  onPress,
  favorites,
  onToggleFav,
  isDev,
}: BaseProps & { games: GameType[] }) => {
  const visibleGames = filterGames(games, isDev);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -16 }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 10,
      }}
    >
      {visibleGames.map(game => (
        <View key={game.title.en} style={styles.hCard}>
          <Game
            name={game.title.en}
            imageSource={game.img}
            broken={game.broken}
            untested={game.untested}
            issueId={game.issue}
            onPress={() => onPress?.(game)}
          />

          <FavButton
            isFav={favorites?.includes(game.title.en)}
            onToggle={() => onToggleFav?.(game.title.en)}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const LoadingIndicator = ({ modalGame }: any) => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={C.accent} />

      <Text style={styles.loaderText}>
        loading {modalGame.title.en}...
      </Text>

      <GameWall />
    </View>
  );
};

const ModalBar = ({
  closeGame,
  modalGame,
  favorites,
  iframeRef,
  toggleFavorite,
  setGameLoading,
}: any) => {
  return (
    <View style={styles.modalBar}>
      <TouchableOpacity
        onPress={closeGame}
        style={styles.closeBtn}
        activeOpacity={0.8}
      >
        <Ionicons
          name="chevron-down"
          size={24}
          color={C.text}
        />
      </TouchableOpacity>

      <View style={styles.modalMeta}>
        <Text style={styles.modalTitle} numberOfLines={1}>
          {modalGame?.title.en}
        </Text>

        <View style={{ flexDirection: 'row' }}>
          {modalGame?.popular && (
            <View style={styles.modalTrendChip}>
              <Text style={styles.modalTrendText}>
                🔥 trending
              </Text>
            </View>
          )}

          {modalGame?.broken && (
            <View style={styles.modalTrendChip}>
              <Text style={styles.modalTrendText}>
                ❌ broken
              </Text>
            </View>
          )}

          {modalGame?.untested && (
            <View style={styles.modalTrendChip}>
              <Text style={styles.modalTrendText}>
                🛠️ untested
              </Text>
            </View>
          )}

          {modalGame?.leaving && (
            <View style={styles.modalTrendChip}>
              <Text style={styles.modalTrendText}>
                🚧 leaving
              </Text>
            </View>
          )}

          {modalGame?.fixed && (
            <View style={styles.modalTrendChip}>
              <Text style={styles.modalTrendText}>
                ✔️ fixed
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.modalActions}>
        <TouchableOpacity
          style={[
            styles.modalIconBtn,
            favorites.includes(modalGame?.title.en || '') &&
            styles.modalIconActive,
          ]}
          onPress={() =>
            toggleFavorite(modalGame?.title.en || '')
          }
          activeOpacity={0.7}
        >
          <Ionicons
            name={
              favorites.includes(modalGame?.title.en || '')
                ? 'heart'
                : 'heart-outline'
            }
            size={20}
            color={
              favorites.includes(modalGame?.title.en || '')
                ? C.hot
                : C.textDim
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modalIconBtn}
          onPress={() => refreshIframe(iframeRef, setGameLoading)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="refresh"
            size={20}
            color={C.textDim}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modalIconBtn}
          onPress={() =>
            iframeRef.current?.requestFullscreen()
          }
          activeOpacity={0.7}
        >
          <Ionicons
            name="expand"
            size={20}
            color={C.textDim}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const GameModal = ({
  modalGame,
  closeGame,
  favorites,
  iframeRef,
  toggleFavorite,
  setGameLoading,
  gameLoading,
}: any) => {
  return (
    <Modal visible={!!modalGame} transparent animationType="slide">
      <View style={styles.modalBg}>
        <View style={styles.modalContent}>
          <ModalBar
            closeGame={closeGame}
            modalGame={modalGame}
            favorites={favorites}
            iframeRef={iframeRef}
            toggleFavorite={toggleFavorite}
            setGameLoading={setGameLoading}
          />

          <View style={{ flex: 1, backgroundColor: '#000' }}>
            {gameLoading && (
              <LoadingIndicator modalGame={modalGame} />
            )}

            {modalGame && (
              <iframe
                ref={iframeRef}
                src={modalGame.url}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  opacity: gameLoading ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                }}
                onLoad={() => setGameLoading(false)}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const FilteredGamesDisplay = ({
  filteredGames,
  columns,
  ListHeader,
  itemWidth,
  handleSelectGame,
  favorites,
  toggleFavorite,
  isDev,
}: any) => {
  const visibleGames = filterGames(filteredGames, isDev);

  return (
    <FlatList
      data={visibleGames}
      keyExtractor={item => item.title.en}
      numColumns={columns}
      key={columns}
      ListHeaderComponent={ListHeader}
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

          <Text style={styles.emptyTitle}>
            No games found
          </Text>

          <Text style={styles.emptySubtitle}>
            Try a different search or filter
          </Text>
        </View>
      }
    />
  );
};

export {
  HorizontalRow,
  ControlIcon,
  SectionHeader,
  GameWrapper,
  FavButton,
  TrendingBadge,
  StatChip,
  LoadingIndicator,
  ModalBar,
  GameModal,
  FilteredGamesDisplay,
};