import React, { memo, useEffect, useMemo, useRef } from 'react';
import { View, Image, FlatList, Animated, useWindowDimensions, Platform, StyleSheet } from 'react-native';
import { gameIcons as icons } from '@/assets/data/GameIcons';
import ENV_VARS from '../data/env';

const GameItem = memo(({ iconName }: { iconName: string }) => {
  const source = `https://res.cloudinary.com/${ENV_VARS.CLOUDINARY_CLOUD_NAME}/image/upload/v1779133665/${iconName}`;
  if (!source) return null;
  return <Image source={source} style={styles.wallGame} />;
});

export function GameWall() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const HERO_GAMES = useMemo(() => Object.keys(icons).sort(() => Math.random() - 0.5), []);
  const LOOP_GAMES = useMemo(
    () => [...HERO_GAMES, ...HERO_GAMES, ...HERO_GAMES],
    [HERO_GAMES]
  );

  const wallOpacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.12],
  });

  useEffect(() => {
    if (!isDesktop) return;

    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -1500,
        duration: 40000,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, isDesktop, scrollAnim]);

  if (!isDesktop) return null;

  return (
    <View style={styles.wallContainer}>
      <Animated.View style={[styles.wallContent, { transform: [{ translateY: scrollAnim }], opacity: wallOpacity }]}> 
        <FlatList
          data={LOOP_GAMES}
          keyExtractor={(item, index) => `game-wall-${item}-${index}`}
          renderItem={({ item }) => <GameItem iconName={item} />}
          numColumns={5}
          scrollEnabled={false}
          removeClippedSubviews={Platform.OS !== 'web'}
        />
      </Animated.View>
      <View style={[styles.wallOverlay]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wallContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'visible',
    borderLeftWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    zIndex: -1, // Ensure it's behind other content
  },
  wallContent: {
    opacity: 0.12,
  },
  wallGame: {
    width: 160,
    height: 100,
    borderRadius: 12,
    margin: 10,
    backgroundColor: '#1e293b',
  },
  wallOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.2)',
  },
});
