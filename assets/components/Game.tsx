import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import { gameIcons } from '@/assets/data/GameIcons';

const PLACEHOLDER: ImageSourcePropType = {
  uri: 'https://placehold.co/200?text=?',
};

export function Game({
  name,
  imageSource,
  onPress,
  ban = false,
  broken = false,
}: {
  name: string;
  imageSource: string;
  onPress: () => void;
  ban?: boolean;
  broken?: boolean;
}) {
  const icons = gameIcons();

  // Memoised icon lookup
  const baseIcon = useMemo(() => {
    const icon = icons[imageSource];
    return typeof icon === 'string'
      ? { uri: icon }
      : icon || PLACEHOLDER;
  }, [icons, imageSource]);

  const hover = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(0)).current;

  const [img, setImg] = useState<ImageSourcePropType>(baseIcon);

  // Keep state in sync if icon changes
  if (img !== baseIcon) {
    setImg(baseIcon);
  }

  // Stable animation function
  const pressAnim = useCallback((to: number) => {
    Animated.spring(hover, {
      toValue: to,
      useNativeDriver: true,
    }).start();
  }, [hover]);

  const handleLoad = useCallback(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  const handleError = useCallback(() => {
    setImg(PLACEHOLDER);
  }, []);

  return (
    <View style={styles.outer}>
      <Animated.View style={[styles.flex, { transform: [{ scale: hover }] }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={!ban ? onPress : undefined}
          onPressIn={() => pressAnim(0.96)}
          onPressOut={() => pressAnim(1)}
          disabled={ban}
          style={[styles.card, ban && styles.bannedOpacity]}
        >
          <View style={styles.imageFrame}>
            <Animated.Image
              source={img}
              style={[styles.image, { opacity: fade }]}
              resizeMode="cover"
              onLoad={handleLoad}
              onError={handleError}
            />

            {broken && (
              <View style={styles.broken}>
                <Text style={styles.brokenText}>⚠</Text>
              </View>
            )}
          </View>

          <View style={styles.textBox}>
            <Text numberOfLines={1} style={styles.title}>
              {name}
            </Text>
          </View>

          {ban && (
            <View style={styles.lock}>
              <Text style={styles.lockText}>🔒</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { padding: 6, flex: 1 },
  flex: { flex: 1 },
  card: {
    overflow: 'hidden',
    borderRadius: 22,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(16px) saturate(180%)',
      boxShadow: '0 6px 30px rgba(0,0,0,0.4)',
    }),
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  textBox: { marginTop: 10, height: 20, justifyContent: 'center', width: '100%' },
  title: { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'center', paddingHorizontal: 4 },
  broken: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(239,68,68,0.9)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  brokenText: { color: '#fff', fontSize: 30, fontWeight: '900' },
  lock: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,6,23,0.8)', justifyContent: 'center', alignItems: 'center' },
  lockText: { fontSize: 32 },
  bannedOpacity: { opacity: 0.4 },
});