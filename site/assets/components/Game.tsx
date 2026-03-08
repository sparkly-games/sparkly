import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  View,
  Animated,
  Platform,
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
  isStealth?: boolean;
}

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
  isStealth = false,
}: GameProps) {
  
  /* -------------------- Logic & Icons -------------------- */
  const resolvedIcons = gameIcons();
  const rawIcon = resolvedIcons[imageSource] ?? PLACEHOLDER;
  const baseIcon: ImageSourcePropType = typeof rawIcon === 'string' ? { uri: rawIcon } : rawIcon;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const hoverAnim = useRef(new Animated.Value(1)).current;

  // Pulse for Awards/Badges
  useEffect(() => {
    if (isStealth) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [isStealth]);

  const handlePressIn = () => !isStealth && Animated.spring(hoverAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () => !isStealth && Animated.spring(hoverAnim, { toValue: 1, useNativeDriver: true }).start();

  const finalImage = useMemo<ImageSourcePropType>(() => {
    if (isStealth || !bazinga) return baseIcon;
    if (Math.floor(Math.random() * 1000) === 0) return DOG;
    return CHAOS[Math.floor(Math.random() * CHAOS.length)];
  }, [bazinga, baseIcon, isStealth]);

  const [imgSource, setImgSource] = useState<ImageSourcePropType>(finalImage);
  useEffect(() => setImgSource(finalImage), [finalImage]);

  const showNewBadge = useMemo(() => {
    if (!newUntil || isStealth) return false;
    const year = 2000 + Math.floor(newUntil / 1000000);
    const month = Math.floor((newUntil % 1000000) / 10000) - 1;
    const day = Math.floor((newUntil % 10000) / 100);
    const hour = newUntil % 100;
    return Date.now() < new Date(year, month, day, hour).getTime();
  }, [newUntil, isStealth]);

  const decorIcon = useMemo(() => {
    if (!decor || !decorIcons[decor] || isStealth) return null;
    const options = decorIcons[decor];
    return options[Math.floor(Math.random() * options.length)];
  }, [decor, isStealth]);

  /* -------------------- Render -------------------- */
  return (
    <View style={styles.outerContainer}>
      {/* Decorations Layer */}
      {decorIcon && !isStealth && (
        <Image source={decorIcon} style={styles.decor} resizeMode="contain" />
      )}

      <Animated.View style={{ transform: [{ scale: hoverAnim }], flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
          disabled={ban}
          style={[
            styles.cardBase,
            isStealth ? styles.stealthCard : styles.glassCard,
            ban && { opacity: 0.4 }
          ]}
        >
          {/* IMAGE CONTAINER: Uniform Square Fix */}
          <View style={[styles.imageFrame, isStealth && styles.stealthImageFrame]}>
            <Image
              source={imgSource}
              style={styles.fullImage}
              resizeMode="cover"
              onError={() => setImgSource(PLACEHOLDER)}
            />
            
            {/* Glossy Badges */}
            {!isStealth && (
              <View style={styles.badgeStrip}>
                {showNewBadge && <Text style={styles.badgeNew}>NEW</Text>}
                {pcOnly && <View style={styles.badgePC}><Text style={styles.badgeTextSmall}>PC</Text></View>}
              </View>
            )}
          </View>

          {/* TEXT CONTAINER: Prevents vertical shapeshifting */}
          <View style={[styles.textBox, isStealth && styles.stealthTextBox]}>
            <Text style={[isStealth ? styles.stealthTitle : styles.title]} numberOfLines={1}>
              {name}
            </Text>
            {isStealth && <Text style={styles.stealthDate}>Modified: Mar 8, 2026</Text>}
          </View>

          {/* Ban Overlay */}
          {ban && (
            <View style={styles.lockOverlay}>
              <Text style={{ fontSize: 32 }}>🔒</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    padding: 6,
    flex: 1,
    position: 'relative',
  },
  cardBase: {
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  // --- GLASS STYLE ---
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 22,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    ...(Platform.OS === 'web' && { 
        backdropFilter: 'blur(16px) saturate(180%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)' 
    }),
  },
  // --- STEALTH STYLE (File Explorer Row) ---
  stealthCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  // --- IMAGE LOGIC (The Uniform Fix) ---
  imageFrame: {
    width: '100%',
    aspectRatio: 1, // Strictly maintains square shape
    borderRadius: 16,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  stealthImageFrame: {
    width: 32,
    height: 32,
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: '#f8fafc',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  // --- TEXT LOGIC ---
  textBox: {
    marginTop: 10,
    height: 20, // Strict height to keep rows even
    justifyContent: 'center',
    width: '100%',
  },
  stealthTextBox: {
    marginTop: 0,
    marginLeft: 12,
    height: 'auto',
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  stealthTitle: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'left',
  },
  stealthDate: {
    fontSize: 10,
    color: '#000000',
    marginTop: 2,
  },
  // --- DECOR & BADGES ---
  decor: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 34,
    height: 34,
    zIndex: 50,
  },
  badgeStrip: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeNew: {
    backgroundColor: '#10b981',
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  badgePC: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeTextSmall: { color: '#fff', fontSize: 8, fontWeight: '800' },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});