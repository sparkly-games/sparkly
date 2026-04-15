import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, Text, View, TextInput, FlatList, 
  Image, TouchableOpacity, Modal, ActivityIndicator, Dimensions, 
  Platform, Alert 
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Search, X, Home, Compass, AlertCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// --- Interfaces ---
interface YTThumbnail { url: string; }
interface YTVideoItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { medium: YTThumbnail };
  };
}

const YT_API_KEY = process.env.EXPO_PUBLIC_YT_API_KEY || '';
const RAW_URL = process.env.EXPO_PUBLIC_COBALT_URL || '';
const COBALT_URL = RAW_URL.endsWith('/') ? RAW_URL : `${RAW_URL}/`;

const NUM_COLUMNS = 4;
const ITEM_WIDTH = width / NUM_COLUMNS;

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [videos, setVideos] = useState<YTVideoItem[]>([]);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [serverOnline, setServerOnline] = useState<boolean>(true);

  const checkTunnel = useCallback(async () => {
    try {
      // Use a simpler fetch for the heartbeat to avoid preflight issues
      const res = await fetch(`${COBALT_URL}`, {mode: 'no-cors'});
      if (!res.ok && res.type !== 'opaque' || res.status !=302) {
        throw new Error(`Server responded with status ${res.status}`);
        setServerOnline(false);
      }
      setServerOnline(true);
    } catch (err) {
      setServerOnline(false);
    }
  }, []);

  useEffect(() => {
    checkTunnel();
    fetchPopular();
    const interval = setInterval(checkTunnel, 60000); 
    return () => clearInterval(interval);
  }, [checkTunnel]);

  const fetchPopular = async () => {
    if (!YT_API_KEY) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=50&regionCode=GB&key=${YT_API_KEY}`
      );
      const data = await res.json();
      if (data.items) {
        setVideos(data.items.map((v: any) => ({ ...v, id: { videoId: v.id } })));
      }
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const searchYouTube = async () => {
    if (!searchQuery) return fetchPopular();
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent(searchQuery)}&type=video&key=${YT_API_KEY}`
      );
      const data = await res.json();
      setVideos(data.items || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

const openVideo = async (videoId: string) => {
    setLoading(true);
    try {
      const res = await fetch(COBALT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Cobalt needs this to agree to talk
        },
        body: JSON.stringify({
          url: `https://www.youtube.com/watch?v=${videoId}`,
          videoQuality: '720',
          alwaysProxy: true 
        })
      });

      const data = await res.json();
      
      // If status is 400, data usually contains a "text" field explaining why
      if (res.status >= 400) {
        console.error("Cobalt rejected request:", data);
        Alert.alert("Server Error", data.text || "Check console for details");
        return;
      }

      if (data.url) {
        setSelectedStream(data.url);
      } else {
        Alert.alert("Error", "No stream URL returned.");
      }
    } catch (err) {
      console.error("Network Error:", err);
      Alert.alert("Error", "Cobalt connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const VideoCard = ({ item }: { item: YTVideoItem }) => (
    <TouchableOpacity style={styles.gridCard} onPress={() => openVideo(item.id.videoId)}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.snippet.thumbnails.medium.url }} style={styles.gridThumbnail} />
      </View>
      <View style={styles.gridInfo}>
        <Text style={styles.gridTitle} numberOfLines={2}>{item.snippet.title}</Text>
        <Text style={styles.gridDetails}>{item.snippet.channelTitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!serverOnline && (
        <View style={styles.offlineBanner}>
          <AlertCircle color="white" size={14} />
          <Text style={styles.offlineText}>Server Offline</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.logo}>UB-Tube</Text>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Search" 
            placeholderTextColor="#888" 
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchYouTube}
          />
        </View>
      </View>

      <FlatList 
        data={videos}
        keyExtractor={(item, index) => item.id.videoId + index}
        renderItem={({ item }) => <VideoCard item={item} />}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listPadding}
      />

      <View style={styles.bottomNav}>
        <Home color="white" size={24} />
        <TouchableOpacity onPress={() => Alert.alert("🐣 Easter", "Coming soon!")}>
          <Compass color="#888" size={24} />
        </TouchableOpacity>
      </View>

      <Modal visible={!!selectedStream} animationType="slide">
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedStream(null)}>
            <X color="white" size={30} />
          </TouchableOpacity>
          {Platform.OS === 'web' ? (
            <video controls autoPlay style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
              <source src={selectedStream || ''} type="video/mp4" />
            </video>
          ) : (
            <WebView 
              source={{ html: `<html><body style="margin:0;background:0;"><video controls autoplay playsinline style="width:100%;height:100%;"><source src="${selectedStream}"></video></body></html>` }}
              style={{ flex: 1 }}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', paddingTop: 40 },
  offlineBanner: { backgroundColor: '#c0392b', flexDirection: 'row', justifyContent: 'center', padding: 5 },
  offlineText: { color: 'white', fontSize: 12, marginLeft: 5 },
  header: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  logo: { color: 'white', fontSize: 20, fontWeight: 'bold', marginRight: 10 },
  searchContainer: { flex: 1, backgroundColor: '#222', borderRadius: 20, paddingHorizontal: 15, height: 35, justifyContent: 'center' },
  input: { color: 'white' },
  listPadding: { paddingBottom: 100 },
  gridCard: { width: ITEM_WIDTH, padding: 5 },
  thumbnailContainer: { width: '100%', aspectRatio: 16/9, borderRadius: 10, overflow: 'hidden' },
  gridThumbnail: { width: '100%', height: '100%' },
  gridInfo: { marginTop: 5 },
  gridTitle: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  gridDetails: { color: '#888', fontSize: 10 },
  bottomNav: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: '#0f0f0f', borderTopWidth: 1, borderTopColor: '#222' },
  modalContent: { flex: 1, backgroundColor: 'black' },
  closeBtn: { position: 'absolute', top: 40, right: 20, zIndex: 10, padding: 10 }
});