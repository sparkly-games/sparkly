import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, Text, View, TextInput, FlatList, 
  Image, TouchableOpacity, Modal, ActivityIndicator, Dimensions, 
  Platform, Alert 
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Search, X, Home, Compass, PlaySquare, User, AlertCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// --- Configuration ---
const YT_API_KEY = process.env.EXPO_PUBLIC_YT_API_KEY;
const RAW_URL = process.env.EXPO_PUBLIC_COBALT_URL || '';
const COBALT_URL = RAW_URL.endsWith('/') ? RAW_URL : `${RAW_URL}/`;

const NUM_COLUMNS = 4;
const ITEM_WIDTH = width / NUM_COLUMNS;

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);

  // 1. Check if Cobalt Server is reachable
  const checkTunnel = useCallback(async () => {
    try {
      const res = await fetch(COBALT_URL + 'api/serverInfo', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      setServerOnline(res.ok);
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
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=75&regionCode=GB&page=3&key=${YT_API_KEY}`
      );
      const data = await res.json();
      setVideos(data.items.map(v => ({ ...v, id: { videoId: v.id } })));
    } catch (err) {
      console.error("Popular fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const searchYouTube = async () => {
    if (!searchQuery) return fetchPopular();
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=75&q=${encodeURIComponent(searchQuery)}&type=video&key=${YT_API_KEY}`
      );
      const data = await res.json();
      setVideos(data.items || []);
    } catch (err) {
      console.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const openVideo = async (videoId) => {
    setLoading(true);
    try {
      const res = await fetch(COBALT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'bypass-tunnel-reminder': 'true' 
        },
        body: JSON.stringify({
          url: `https://www.youtube.com/watch?v=${videoId}`,
          videoQuality: '720',
          alwaysProxy: true 
        })
      });

      const data = await res.json();
      if (data.url) {
        setSelectedStream(data.url);
      } else {
        Alert.alert("Video Error", "Cobalt couldn't find a clean stream.");
      }
    } catch (err) {
      Alert.alert("Connection Error", "Is your Cobalt instance/tunnel running?");
    } finally {
      setLoading(false);
    }
  };

  const VideoCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.gridCard} 
      onPress={() => openVideo(item.id.videoId)}
      activeOpacity={0.7}
    >
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: item.snippet?.thumbnails?.medium?.url }} 
          style={styles.gridThumbnail} 
        />
      </View>
      <View style={styles.gridInfo}>
        <Text style={styles.gridTitle} numberOfLines={2}>{item.snippet?.title}</Text>
        <Text style={styles.gridDetails} numberOfLines={1}>{item.snippet?.channelTitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Offline Warning */}
      {!serverOnline && (
        <View style={styles.offlineBanner}>
          <AlertCircle color="white" size={14} />
          <Text style={styles.offlineText}>Cobalt Server Offline</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>CobaltTube</Text>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.input}
            placeholder="Search"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchYouTube}
          />
          <TouchableOpacity onPress={searchYouTube} style={styles.searchIcon}>
            <Search color="#aaa" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid */}
      <FlatList 
        data={videos}
        keyExtractor={(item, index) => (item.id.videoId || index.toString()) + index}
        renderItem={({ item }) => <VideoCard item={item} />}
        numColumns={NUM_COLUMNS}
        key={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        onRefresh={fetchPopular}
        refreshing={loading}
        contentContainerStyle={styles.listPadding}
      />

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}><Home color="white" size={22} /><Text style={styles.navText}>Home</Text></View>
        <View style={styles.navItem}><Compass color="#888" size={22} /><Text style={styles.navTextInactive}>Explore</Text></View>
        <View style={styles.navItem}><PlaySquare color="#888" size={22} /><Text style={styles.navTextInactive}>Subs</Text></View>
        <View style={styles.navItem}><User color="#888" size={22} /><Text style={styles.navTextInactive}>You</Text></View>
      </View>

      {/* Universal Player Modal */}
      <Modal visible={!!selectedStream} animationType="slide">
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedStream(null)}>
            <X color="white" size={30} />
          </TouchableOpacity>
          
          {Platform.OS === 'web' ? (
            <View style={styles.webPlayerContainer}>
               <video 
                controls 
                autoPlay 
                style={styles.webVideo}
              >
                <source src={selectedStream} type="video/mp4" />
                Browser not supported.
              </video>
            </View>
          ) : (
            <WebView 
              source={{ 
                html: `
                  <html>
                    <body style="margin:0;background:black;display:flex;align-items:center;justify-content:center;height:100vh;">
                      <video controls autoplay playsinline style="width:100%;height:auto;">
                        <source src="${selectedStream}" type="video/mp4">
                      </video>
                    </body>
                  </html>
                ` 
              }}
              style={styles.webview}
              allowsFullscreenVideo={true}
              backgroundColor="black"
            />
          )}
        </View>
      </Modal>

      {loading && !videos.length && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="red" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', paddingTop: Platform.OS === 'ios' ? 50 : 20 },
  offlineBanner: { backgroundColor: '#c0392b', flexDirection: 'row', justifyContent: 'center', padding: 4 },
  offlineText: { color: 'white', fontSize: 10, marginLeft: 5 },
  header: { flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center', height: 50 },
  logo: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 15 },
  searchContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#222', borderRadius: 20, paddingHorizontal: 15, alignItems: 'center', height: 36 },
  input: { flex: 1, color: 'white', fontSize: 14 },
  searchIcon: { paddingLeft: 8 },
  listPadding: { paddingHorizontal: 4, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'flex-start' },
  gridCard: { width: ITEM_WIDTH, padding: 5, marginBottom: 15 },
  thumbnailContainer: { width: '100%', aspectRatio: 16/9, backgroundColor: '#222', borderRadius: 8, overflow: 'hidden' },
  gridThumbnail: { width: '100%', height: '100%' },
  gridInfo: { marginTop: 8 },
  gridTitle: { color: 'white', fontSize: 11, fontWeight: '500' },
  gridDetails: { color: '#aaa', fontSize: 10 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#0f0f0f', borderTopWidth: 1, borderTopColor: '#222', paddingVertical: 10, justifyContent: 'space-around', position: 'absolute', bottom: 0, width: '100%' },
  navItem: { alignItems: 'center' },
  navText: { color: 'white', fontSize: 10, marginTop: 4 },
  navTextInactive: { color: '#888', fontSize: 10, marginTop: 4 },
  modalContent: { flex: 1, backgroundColor: 'black' },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 99, padding: 10 },
  webview: { flex: 1, marginTop: 50 },
  webPlayerContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'black' },
  webVideo: { width: '100%', maxHeight: '100%' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 100 }
});