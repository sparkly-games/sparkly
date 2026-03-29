import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Animated,
  useWindowDimensions,
} from 'react-native';
import Head from 'expo-router/head';

interface VideoCard {
  id: string;
  title: string;
  thumbnail: any;
}

const videos: VideoCard[] = [
  {
    id: 'stealth-thorpe-park',
    title: 'Stealth | Thorpe Park 2023 POV (360p)',
    thumbnail: require('@/assets/thumbnails/rc-thorpe-park/stealth.jpg'),
  },
  {
    id: 'colossus-thorpe-park',
    title: 'Colossus | Thorpe Park 2023 POV (360p)',
    thumbnail: require('@/assets/thumbnails/rc-thorpe-park/colossus.jpg'),
  },
  {
    id: 'saw-thorpe-park',
    title: 'Saw | Thorpe Park 2023 POV (360p)',
    thumbnail: require('@/assets/thumbnails/rc-thorpe-park/saw.jpg'),
  },
  {
    id: '13-thorpe-park',
    title: 'TH13TEEN | Alton Towers 2020 POV (360p)',
    thumbnail: require('@/assets/thumbnails/rc-alton-towers/13.webp'),
  },
  {
    id: 'bazinga-tbbt',
    title: 'Bazinga | The Big Bang Theory S3E15 (360p)',
    thumbnail: require('@/assets/thumbnails/tbbt/bazinga.webp'),
  },
];

export default function VidsScreen() {
  const { width } = useWindowDimensions();
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.75, duration: 3000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const columns = width < 480 ? 1 : width < 900 ? 2 : 3;
  const itemWidth = Math.floor((width - 40) / columns);

  const openVideo = (video: VideoCard) => {
    router.push(`/vidplayer/${video.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.sparkleGlow, { opacity: glowAnim }]} />
      <Text style={[styles.title, { margin: 30, fontSize: 120, opacity: glowAnim }]}>Coming Soon</Text>
      <Text style={[styles.subtitle, { margin: 30, fontSize: 40, opacity: glowAnim, textDecorationLine: 'underline' }]} onPress={() => router.push('/vids.backup')}>View old page.</Text>
    </SafeAreaView>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sparkleGlow: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 420,
    backgroundColor: '#3b82f6',
    top: -140,
    alignSelf: 'center',
    filter: 'blur(80px)',
  },
  headerCard: {
    margin: 16,
    padding: 22,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 58, 138, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  title: {
    color: '#60a5fa',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(59,130,246,0.5)',
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#bfdbfe',
    textAlign: 'center',
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: '#020617',
  },
  videoTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});