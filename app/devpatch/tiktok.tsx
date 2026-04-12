import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StyleSheet, Text, View, FlatList, Dimensions, 
  ActivityIndicator, TouchableOpacity, Platform, ViewToken 
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Heart, MessageCircle, Share2, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// --- Configuration ---
const COBALT_URL = process.env.EXPO_PUBLIC_COBALT_URL || 'https://api.cobalt.tools/';

// Dummy Data: In a real app, you'd fetch these URLs from your DB or a scraper
const INITIAL_TIKTOKS = [
  "https://www.tiktok.com/@isaach.p/video/7621168431483653398",
  "https://www.tiktok.com/@isaach.p/video/7621168431483653398",
  "https://www.tiktok.com/@isaach.p/video/7621168431483653398",
  "https://www.tiktok.com/@isaach.p/video/7621168431483653398",
  "https://www.tiktok.com/@isaach.p/video/7621168431483653398",
  "https://www.tiktok.com/@isaach.p/video/7621168431483653398",
  "https://www.tiktok.com/@isaach.p/video/7621168431483653398",
];

interface VideoItem {
  id: string;
  originalUrl: string;
  streamUrl: string | null;
  loading: boolean;
}

export default function TikTokFeed() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  
  // Track visibility to play/pause videos
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80, // Video must be 80% visible to play
  }).current;

  // --- Logic to "Wash" a TikTok URL through Cobalt ---
  const washUrl = async (url: string): Promise<string | null> => {
    try {
      const res = await fetch(`${COBALT_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          url,
          videoQuality: '720',
          downloadMode: 'tunnel', // Bypasses local network blocks
          isNoWatermark: true,
        })
      });
      const data = await res.json();
      return data.url || null;
    } catch (err) {
      return null;
    }
  };

  const loadInitialFeed = async () => {
    const washed = INITIAL_TIKTOKS.map((url, i) => ({
      id: `${i}`,
      originalUrl: url,
      streamUrl: null,
      loading: true,
    }));
    setVideos(washed);

    // Resolve stream URLs in background
    for (let i = 0; i < washed.length; i++) {
      const stream = await washUrl(washed[i].originalUrl);
      setVideos(prev => prev.map((v, idx) => idx === i ? { ...v, streamUrl: stream, loading: false } : v));
    }
  };

  useEffect(() => {
    loadInitialFeed();
  }, []);

  const VideoPost = ({ item, index }: { item: VideoItem, index: number }) => {
    const isPaused = activeVideoIndex !== index;

    return (
      <View style={styles.videoContainer}>
        {item.loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : item.streamUrl ? (
          <Video
            source={{ uri: item.streamUrl }}
            style={styles.fullScreenVideo}
            resizeMode={ResizeMode.COVER}
            shouldPlay={!isPaused}
            isLooping
            isMuted={false}
          />
        ) : (
          <Text style={styles.errorText}>Video Unavailable</Text>
        )}

        {/* --- Sidebar UI (Similar to TikTok) --- */}
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.iconButton}>
            <Heart color="white" size={35} fill={index % 2 === 0 ? "none" : "fill"} />
            <Text style={styles.iconText}>12.4K</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MessageCircle color="white" size={35} />
            <Text style={styles.iconText}>842</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Share2 color="white" size={35} />
            <Text style={styles.iconText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* --- Bottom Info --- */}
        <View style={styles.bottomInfo}>
          <Text style={styles.username}>@TikBlocked</Text>
          <Text style={styles.description} numberOfLines={2}>
            Tiktok Privacy Frontend.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={({ item, index }) => <VideoPost item={item} index={index} />}
        keyExtractor={item => item.id}
        pagingEnabled // This creates the "snap" effect
        vertical
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        // Optimization: Don't render everything at once
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
      
      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <Text style={styles.headerText}>Following</Text>
        <View style={styles.activeIndicator} />
        <Text style={[styles.headerText, { opacity: 0.6 }]}>For You</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  videoContainer: { 
    width: width, 
    height: height, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  fullScreenVideo: { 
    position: 'absolute', 
    top: 0, left: 0, bottom: 0, right: 0 
  },
  sidebar: { 
    position: 'absolute', 
    right: 15, 
    bottom: 120, 
    alignItems: 'center', 
    gap: 20 
  },
  iconButton: { alignItems: 'center' },
  iconText: { color: 'white', fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  bottomInfo: { 
    position: 'absolute', 
    bottom: 40, 
    left: 15, 
    width: width * 0.7 
  },
  username: { color: 'white', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  description: { color: 'white', fontSize: 14, lineHeight: 18 },
  floatingHeader: { 
    position: 'absolute', 
    top: 50, 
    width: '100%', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 20, 
    zIndex: 10 
  },
  headerText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  activeIndicator: { 
    position: 'absolute', 
    bottom: -5, 
    left: '38%', 
    width: 30, 
    height: 3, 
    backgroundColor: 'white' 
  },
  errorText: { color: '#888' }
});