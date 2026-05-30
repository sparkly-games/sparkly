import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Alert,
  Platform,
} from 'react-native';
import { X, AlertCircle, Search as SearchIcon, Play } from 'lucide-react-native';
import ENV_VARS from '@/assets/data/env';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = width > 600 ? 4 : 2; // Responsive grid
const ITEM_WIDTH = width / NUM_COLUMNS;

// --- DYNAMIC BACKEND LIST ---
// We use a list because public instances often go down or change auth rules
const COBALT_INSTANCES = [
  "sunny.imput.net",
  "nachos.imput.net",
  "kityune.imput.net",
  "blossom.imput.net",
  "subito-c.meowing.de",
  "nuko-c.meowing.de",
  "apicobalt.mgytr.top",
  "cobaltapi.squair.xyz",
  "cobalt.omega.wolfy.love",
  "cobalt.alpha.wolfy.love",
  "grapefruit.clxxped.lol",
  "lime.clxxped.lol",
  "cobaltapi.kittycat.boo",
  "melon.clxxped.lol",
  "fox.kittycat.boo",
  "dog.kittycat.boo",
  "api.dl.woof.monster",
  "api.qwkuns.me",
  "api.cobalt.blackcat.sweeux.org",
  "api.cobalt.liubquanti.click",
  "cobaltapi.cjs.nz",
  "api.cobalt.canine.icu",
  "cobalt.drgn.party",
  "api.cobalt.best"
].filter(Boolean);

interface Video {
  id: string;
  title: string;
  channel: string;
  thumb: string;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeInstance, setActiveInstance] = useState(COBALT_INSTANCES[0]);

  const inFlight = useRef(false);

  useEffect(() => {
    fetchPopular();
  }, []);

  // 1. YOUTUBE API LOGIC
  const fetchVideos = async (url: string) => {
    setLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      setVideos((data.items || []).map((v: any) => ({
        id: v.id?.videoId || v.id,
        title: v.snippet.title,
        channel: v.snippet.channelTitle,
        thumb: v.snippet.thumbnails.medium.url,
      })));
    } catch (e) {
      Alert.alert("Quota Exceeded", "YouTube API limit reached.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPopular = () =>
    fetchVideos(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=20&regionCode=GB&key=${ENV_VARS.YT_API_KEY}`);

  const onSearch = () => {
    if (!searchQuery) return fetchPopular();
    fetchVideos(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(searchQuery)}&type=video&key=${ENV_VARS.YT_API_KEY}`);
  };

  // 2. COBALT STREAMING LOGIC (NO JWT REQUIRED)
  const openVideo = async (videoId: string) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    for (const instance of COBALT_INSTANCES) {
      try {
        const apiUrl = `https://${instance}`;

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: videoUrl,
            videoQuality: '720', // Explicit quality often helps
            downloadMode: 'auto',
            filenamePattern: 'basic'
          }),
        });

        if (res.status === 403 || res.status === 401) {
          console.warn(`${instance} blocked the request (CORS/Auth).`);
          continue;
        }

        const data = await res.json();
        if (data?.url) {
          setSelectedStream(data.url);
          setActiveInstance(instance);
          setLoading(false);
          inFlight.current = false;
          return;
        }
      } catch (e) {
        console.error(`Connection failed for ${instance}`);
      }
    }

    Alert.alert("All Instances Failed", "Public instances are currently blocking external requests. Consider self-hosting.");
    setLoading(false);
    inFlight.current = false;
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>UB-TUBE</Text>
        <View style={styles.searchBar}>
          <SearchIcon color="#888" size={16} />
          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={onSearch}
          />
        </View>
      </View>

      {/* VIDEO GRID */}
      <FlatList
        data={videos}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openVideo(item.id)}>
            <View>
              <Image source={{ uri: item.thumb }} style={styles.thumb} />
              <View style={styles.playOverlay}>
                <Play color="white" fill="white" size={20} />
              </View>
            </View>
            <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.channelTitle}>{item.channel}</Text>
          </TouchableOpacity>
        )}
      />

      {/* PLAYER MODAL */}
      <Modal visible={!!selectedStream} animationType="fade" transparent={false}>
        <View style={styles.playerContainer}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedStream(null)}>
            <X color="white" size={32} />
          </TouchableOpacity>

          {selectedStream && (
            // Native HTML5 video for Web, requires expo-av for native mobile
            <video
              src={selectedStream}
              controls
              autoPlay
              style={styles.fullVideo}
              onError={() => Alert.alert("Video Error", "Stream link expired. Try again.")}
            />
          )}

          <View style={styles.streamInfo}>
            <Text style={styles.streamText}>Streaming via: {activeInstance}</Text>
          </View>
        </View>
      </Modal>

      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#FF0000" />
          <Text style={styles.loadingText}>Fetching Stream...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: '#000'
  },
  logo: { color: '#FF0000', fontSize: 24, fontWeight: '900', marginBottom: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44
  },
  input: { flex: 1, color: '#fff', marginLeft: 10, fontSize: 16 },
  card: { width: ITEM_WIDTH, padding: 8 },
  thumb: { width: '100%', aspectRatio: 16 / 9, borderRadius: 12, backgroundColor: '#111' },
  playOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 20
  },
  videoTitle: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginTop: 8 },
  channelTitle: { color: '#888', fontSize: 11, marginTop: 2 },
  playerContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  fullVideo: { width: '100%', maxHeight: '80%', backgroundColor: '#000' },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  streamInfo: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  streamText: { color: '#333', fontSize: 10 },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: { color: '#fff', marginTop: 10, fontSize: 12, fontWeight: '600' }
});