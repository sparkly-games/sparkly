import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  videoId: string;
}

interface CobaltResponse {
  videoUrl: string;
  quality: string;
}

const VIDEO_LIST: VideoItem[] = [
  {
    id: '1',
    title: 'Example Video 1',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    videoId: 'dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'Example Video 2',
    thumbnail: 'https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg',
    videoId: '3JZ_D3ELwOQ',
  },
  // Add more videos or fetch dynamically later
];

export default function VideosScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [cobaltUrl, setCobaltUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<any>(null);
  const screenWidth = Dimensions.get('window').width;

  const openVideo = async (video: VideoItem) => {
    setSelectedVideo(video);
    setModalVisible(true);
    setLoading(true);

    try {
      const res = await fetch('https://cobalt-backend.canine.tools/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: 'https://www.youtube.com/watch?v=' + video.videoId,
          videoQuality: 720,
        }),
      });

      const data: CobaltResponse = await res.json();
      setCobaltUrl(data.videoUrl);
    } catch (err) {
      console.error('Cobalt fetch error:', err);
      setCobaltUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVideo(null);
    setCobaltUrl(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={VIDEO_LIST}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-around' }}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.videoCard}
            onPress={() => openVideo(item)}
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.thumbnail}
            />
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            {loading && (
              <ActivityIndicator size="large" color="#60a5fa" style={{ flex: 1 }} />
            )}

            {!loading && cobaltUrl && (
              <GameFrame
                ref={iframeRef}
                src={cobaltUrl}
                style={{
                  width: screenWidth * 0.9,
                  height: (screenWidth * 0.9 * 9) / 16, // 16:9 ratio
                  border: 'none',
                }}
              />
            )}

            {!loading && !cobaltUrl && (
              <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                Failed to load video.
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingTop: 20,
  },
  videoCard: {
    backgroundColor: '#1e293b',
    margin: 10,
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    width: '45%',
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  title: {
    marginTop: 6,
    color: '#f8fafc',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  modalTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  close: {
    fontSize: 28,
    color: '#60a5fa',
    fontWeight: '900',
    marginBottom: 10,
  },
});