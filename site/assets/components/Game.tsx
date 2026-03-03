import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  View,
  Animated,
} from 'react-native';
import { decorIcons } from '@/assets/images/DecorIcons';
import { gameIcons } from '@/assets/data/GameIcons';

type DecorEvent = 'halloween' | 'christmas' | 'new-year';

interface GameProps {
  name: string;
  imageSource: string;
  ban?: boolean;
  onPress: () => void;
  decor?: DecorEvent;
  newUntil?: number; // YYMMDDHH
  pcOnly?: boolean;
  legacy?: boolean;
  leaving?: string;
  bazinga?: boolean;
  broken?: boolean;
}

/* -------------------- Images -------------------- */

const PLACEHOLDER: ImageSourcePropType = {
  uri: 'https://placehold.co/200?text=?',
};

const DOG = require('@/assets/images/dog.jpeg');

const CHAOS: ImageSourcePropType[] = [
  require('@/assets/images/chaos/1.jpg'),
  require('@/assets/images/chaos/2.jpg'),
  require('@/assets/images/chaos/3.jpg'),
  require('@/assets/images/chaos/4.jpg'),
  require('@/assets/images/chaos/5.webp'),
];

export function Game({
  name,
  imageSource,
  onPress,
  decor,
  newUntil,
  pcOnly,
  legacy,
  leaving,
  bazinga = false,
  ban = false,
  broken = false,
}: GameProps) {
  /* -------------------- Icon resolution -------------------- */
  const baseIcon: ImageSourcePropType =
    gameIcons[imageSource] ?? PLACEHOLDER;

  /* -------------------- Awards -------------------- */
  const awards: Record<string, string> = {
    '6': '🥇 2025',
    '1': '🥉 2025',
    x: '🎖️ 2025',
    c: '🎖️ 2025',
    ag: '🎖️ 2025',
    p: '🎖️ 2025',
    '8': '🎖️ 2025',
    l: '🎖️ 2025',
  };

  const awardBadge = awards[imageSource] ?? null;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!awardBadge) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [awardBadge, pulseAnim]);

  /* -------------------- Decor -------------------- */
  let decorIcon: ImageSourcePropType | null = null;
  if (decor && decorIcons[decor]) {
    const options = decorIcons[decor];
    decorIcon = options[Math.floor(Math.random() * options.length)];
  }

  /* -------------------- Chaos / Bazinga -------------------- */
  const finalImage = useMemo<ImageSourcePropType>(() => {
    if (!bazinga) return baseIcon;

    if (Math.floor(Math.random() * 1000) === 0) {
      return DOG;
    }

    return CHAOS[Math.floor(Math.random() * CHAOS.length)];
  }, [bazinga, baseIcon]);

  /* -------------------- Runtime image fallback -------------------- */
  const [imgSource, setImgSource] =
    useState<ImageSourcePropType>(finalImage);

  useEffect(() => {
    setImgSource(finalImage);
  }, [finalImage]);

  /* -------------------- NEW badge logic -------------------- */
  const showNewBadge = (() => {
    if (!newUntil) return false;
    const year = 2000 + Math.floor(newUntil / 1000000);
    const month = Math.floor((newUntil % 1000000) / 10000) - 1;
    const day = Math.floor((newUntil % 10000) / 100);
    const hour = newUntil % 100;
    return Date.now() < new Date(year, month, day, hour).getTime();
  })();

  /* -------------------- Render -------------------- */
  return (
    <View style={{ position: 'relative', margin: 5 }}>
      {decorIcon && <Image source={decorIcon} style={styles.decor} />}

      {ban && <Text style={styles.ban}>🔒</Text>}

      <TouchableOpacity
        onPress={onPress}
        style={[styles.card, { opacity: ban ? 0.6 : 1 }]}
        disabled={ban}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={imgSource}
            style={styles.image}
            onError={() => setImgSource(PLACEHOLDER)}
          />
        </View>

        {showNewBadge && <Text style={styles.newBadge}>NEW</Text>}
        {pcOnly && <Text style={styles.pcBadge}>PC</Text>}
        {broken && <Text style={styles.brokenBadge}>BUGGED</Text>}

        {!legacy && awardBadge && (
          <Animated.View
            style={[styles.awardBadge, { transform: [{ scale: pulseAnim }] }]}
          >
            <Text style={styles.awardText}>{awardBadge}</Text>
          </Animated.View>
        )}

        {!legacy && leaving && (
          <Animated.View
            style={[styles.leavingBadge, { transform: [{ scale: pulseAnim }] }]}
          >
            <Text style={styles.awardText}>Last day: {leaving}</Text>
          </Animated.View>
        )}

        <Text style={styles.text} numberOfLines={1}>
          {name}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderRadius: 26,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.25)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  imageWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 22,
  },

  text: {
    marginTop: 10,
    fontSize: 12,
    color: '#e2e8f0',
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
    letterSpacing: 0.3,
  },

  decor: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 38,
    height: 38,
    zIndex: 300,
  },

  ban: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 26,
    backgroundColor: 'rgba(2, 6, 23, 0.75)',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 64,
    zIndex: 50,
    paddingTop: '10%',
  },

  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10b981',
    color: 'white',
    fontWeight: '900',
    fontSize: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },

  pcBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: '900',
    fontSize: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },

  brokenBadge: {
    position: 'absolute',
    top: 36,
    left: 8,
    backgroundColor: '#ef4444',
    color: 'white',
    fontWeight: '900',
    fontSize: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    shadowColor: '#ef4444',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },

  awardBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(191, 219, 254, 0.95)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#60a5fa',
    shadowColor: '#60a5fa',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },

  leavingBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#60a5fa',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    shadowColor: '#60a5fa',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },

  awardText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1e3a8a',
  },
});