import React, { useState, useEffect, useCallback, useRef } from 'react';
import ENV_VARS from '@/assets/data/env';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Search, X, Home, Compass, AlertCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface YTVideoItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { medium: { url: string } };
  };
}

const YT_API_KEY = ENV_VARS.YT_API_KEY || '';
const COBALT_URL = (ENV_VARS.COBALT_URL || '').replace(/\/$/, '');

const NUM_COLUMNS = 4;
const ITEM_WIDTH = width / NUM_COLUMNS;

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<YTVideoItem[]>([]);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);

  // prevents NS_BINDING_ABORTED / duplicate calls
  const inFlight = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const checkTunnel = useCallback(async () => {
    try {
      const res = await fetch(COBALT_URL);
      if (mounted.current) setServerOnline(res.ok);
    } catch {
      if (mounted.current) setServerOnline(false);
    }
  }, []);

  useEffect(() => {
    checkTunnel();
    fetchPopular();
    const interval = setInterval(checkTunnel, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPopular = async () => {
    if (!YT_API_KEY) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=40&regionCode=GB&key=${YT_API_KEY}`
      );

      const data = await res.json();

      if (data.items && mounted.current) {
        setVideos(
          data.items.map((v: any) => ({
            ...v,
            id: { videoId: v.id },
          }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const searchYouTube = async () => {
    if (!searchQuery) return fetchPopular();

    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=40&q=${encodeURIComponent(
          searchQuery
        )}&type=video&key=${YT_API_KEY}`
      );

      const data = await res.json();
      if (mounted.current) setVideos(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- STREAM FIX ----------------

  const openVideo = async (videoId: string) => {
    if (inFlight.current) return;
    inFlight.current = true;

    setLoading(true);

    try {
      const res = await fetch(COBALT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          url: `https://www.youtube.com/watch?v=${videoId}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data?.text || 'Stream failed');
        return;
      }

      if (data?.url && mounted.current) {
        // 🔥 prevents NS_BINDING_ABORTED by delaying mount
        setTimeout(() => {
          if (mounted.current) {
            setSelectedStream(data.url);
          }
        }, 150);
      }
    } catch (e) {
      console.error('Stream error:', e);
      Alert.alert('Error', 'Connection failed');
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  };

  const VideoCard = ({ item }: { item: YTVideoItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openVideo(item.id.videoId)}
    >
      <Image
        source={{ uri: item.snippet.thumbnails.medium.url }}
        style={styles.thumb}
      />
      <Text style={styles.title} numberOfLines={2}>
        {item.snippet.title}
      </Text>
      <Text style={styles.sub}>{item.snippet.channelTitle}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!serverOnline && (
        <View style={styles.offline}>
          <AlertCircle color="white" size={14} />
          <Text style={styles.offlineText}>Server Offline</Text>
        </View>
      )}

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>UB-Tube</Text>

        <TextInput
          style={styles.search}
          placeholder="Search"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchYouTube}
        />
      </View>

      {/* GRID */}
      <FlatList
        data={videos}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item, i) => item.id.videoId + i}
        renderItem={({ item }) => <VideoCard item={item} />}
      />

      {/* PLAYER */}
      <Modal visible={!!selectedStream} animationType="fade">
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => setSelectedStream(null)}
          >
            <X color="white" size={28} />
          </TouchableOpacity>

          {/* 🔥 IMPORTANT FIX: use native video, NOT WebView */}
          {selectedStream && (
            <video
              controls
              autoPlay
              style={{ width: '100%', height: '100%', background: 'black' }}
              src={selectedStream}
            />
          )}
        </View>
      </Modal>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator color="white" />
        </View>
      )}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', paddingTop: 40 },

  offline: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#c0392b',
    padding: 6,
  },
  offlineText: { color: 'white', marginLeft: 5 },

  header: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  logo: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 10 },

  search: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 12,
    color: 'white',
    height: 35,
  },

  card: {
    width: ITEM_WIDTH,
    padding: 6,
  },

  thumb: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
  },

  title: { color: 'white', fontSize: 11, fontWeight: '600' },
  sub: { color: '#888', fontSize: 10 },

  modal: {
    flex: 1,
    backgroundColor: 'black',
  },

  close: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },

  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});