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
      <TouchableOpacity onPress={onPress} style={[styles.card, { opacity: ban ? 0.6 : 1 }]} disabled={ban}>
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
            style={[
              styles.awardBadge,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Text style={styles.awardText}>{awardBadge}</Text>
          </Animated.View>
        )}

        {!legacy && leaving && (
          <Animated.View
            style={[
              styles.leavingBadge,
              { transform: [{ scale: pulseAnim }] },
            ]}
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
    backgroundColor: '#1e293b', // Deep Slate Blue
    borderRadius: 24,
    alignItems: 'center',
    padding: 10,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)', // Subtle blue border
  },
  imageWrapper: {
    position: 'relative',
  },
  ban: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -50 }],
    fontSize: 80,
    opacity: 0.8,
    filter: 'grayscale(100%)',
    zIndex: 50
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  decor: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 35,
    height: 35,
    zIndex: 300,
  },
  text: {
    marginTop: 8,
    fontSize: 10,
    color: '#f8fafc', // Off-white/Ice blue
    fontWeight: 'bold',
    textAlign: 'center',
    width: "100%",
  },
  newBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#10b981', // Emerald/Seafoam
    color: 'white',
    fontWeight: '800',
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    zIndex: 40,
  },
  pcBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#3b82f6', // Bright Blue
    color: 'white',
    fontWeight: '800',
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    zIndex: 40,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  brokenBadge: {
    position: 'absolute',
    top: 28,
    left: 5,
    backgroundColor: '#ef4444', // Kept red for urgency/bug visibility
    color: 'white',
    fontWeight: '900',
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    zIndex: 45,
  },
  awardBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#bfdbfe', // Light Sky Blue
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
    zIndex: 30,
    borderWidth: 1,
    borderColor: '#60a5fa',
  },
  leavingBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#60a5fa', // Steel Blue (changed from yellow)
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
    zIndex: 30,
  },
  awardText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#1e3a8a', // Dark Navy text for readability
  },
});