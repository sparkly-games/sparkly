import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Linking,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { Game } from '../assets/components/Game';
import { gamesData } from '../assets/data/games';
import { analytics } from '@/assets/data/firebaseConfig.js';
import { logEvent } from 'firebase/analytics';
import { FlipClock } from '@/assets/components/FlipClock';
import banList from '@/public/banlist.json';

const decal = 'new-year';
const LS_FAVS = 'sparkly:favs';
const LS_RECENT = 'sparkly:recent';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const iframeRef = useRef(null);

  const [query, setQuery] = useState('');
  const [view, setView] = useState('all');
  const [favs, setFavs] = useState([]);
  const [recent, setRecent] = useState([]);
  const [showHorror, setShowHorror] = useState(false);
  const [showPC, setShowPC] = useState(false);
  const [modalGame, setModalGame] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);

  /* ---------------- LocalStorage ---------------- */
  useEffect(() => {
    const load = () => {
      const f = JSON.parse(localStorage.getItem(LS_FAVS) || '[]');
      const r = JSON.parse(localStorage.getItem(LS_RECENT) || '[]');
      setFavs(f);
      setRecent(r);
    };
    load();
  }, []);

  const toggleFav = (name) => {
    let updated;
    if (favs.includes(name)) {
      updated = favs.filter(f => f !== name);
    } else {
      updated = [...favs, name];
    }
    setFavs(updated);
    localStorage.setItem(LS_FAVS, JSON.stringify(updated));
  };

  const addRecent = (name) => {
    const updated = [name, ...recent.filter(r => r !== name)].slice(0, 20);
    setRecent(updated);
    localStorage.setItem(LS_RECENT, JSON.stringify(updated));
  };

  /* ---------------- Filter Logic ---------------- */
  const games = useMemo(() => {
    let g = gamesData
      .filter(g => showHorror || !g.horror)
      .filter(g => showPC || !g.pc)
      .filter(g => g.title.en.toLowerCase().includes(query.toLowerCase()));

    if (view === 'favs') g = g.filter(g => favs.includes(g.title.en));
    if (view === 'recent') g = g.filter(g => recent.includes(g.title.en));

    return g.sort((a, b) => a.title.en.localeCompare(b.title.en));
  }, [query, showHorror, showPC, view, favs, recent]);

  const columns = width < 420 ? 2 : width < 900 ? 3 : 5;
  const itemWidth = Math.floor((width - 24) / columns);

  /* ---------------- Check if banned ---------------- */
  const isBanned = () => {
    return banList.includes(localStorage.getItem('sparkly:uid'));
  };

  return (
    <View style={styles.container}>
      <Head>
        <title>Sparkly Games</title>
      </Head>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FlipClock targetDate="2026-03-20T11:44:00" caption="the onlinegames12 anniversary" />

        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>✨ Sparkly Games ✨</Text>
          <Text style={styles.noticeText}>Officially joining the UBGU!</Text>
          <Text style={styles.noticeText}>v7.9.2 · 03/03/26</Text>

          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/sparkly-games')}>
              <Ionicons name="logo-github" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setModalGame({url:'https://redlib.canine.tools'}); setIframeKey(k=>k+1);}}>
              <Ionicons name="logo-reddit" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setModalGame({url:'https://wikiless.canine.tools'}); setIframeKey(k=>k+1);}}>
              <Ionicons name="globe-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/vids')}>
              <Ionicons name="logo-youtube" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('/soundboard.htm')}>
              <Ionicons name="volume-high-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('/tts.htm')}>
              <Ionicons name="mic-outline" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.pipe}>|</Text>

            <TouchableOpacity onPress={() => setShowPC(p => !p)}>
              <Ionicons name="desktop-outline" size={24} color={showPC ? '#60a5fa' : '#475569'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowHorror(p => !p)}>
              <Ionicons name="skull-outline" size={24} color={showHorror ? '#60a5fa' : '#475569'} />
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search games…"
          style={styles.search}
        />

        <View style={styles.grid}>
          {games.map(game => (
            <View key={game.title.en} style={{ width: itemWidth }}>
              <Game
                name={game.title.en}
                imageSource={game.img}
                decor={decal}
                ban={isBanned(game)}
                onPress={() => {
                  if (isBanned(game)) return;
                  setModalGame(game);
                  setIframeKey(k => k + 1);
                  addRecent(game.title.en);
                  logEvent(analytics, 'play_game', { game_name: game.title.en });
                }}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={!!modalGame} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              <TouchableOpacity onPress={() => setModalGame(null)}>
                <Ionicons name="close" size={28} color="#60a5fa" />
              </TouchableOpacity>

              <View style={styles.modalRight}>
                <TouchableOpacity onPress={() => setIframeKey(k => k + 1)}>
                  <Ionicons name="refresh" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => iframeRef.current?.requestFullscreen?.()}>
                  <Ionicons name="expand" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <iframe
              ref={iframeRef}
              key={iframeKey}
              src={modalGame?.url}
              style={{ flex: 1, width: '100%', border: 'none' }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { paddingBottom: 40 },
  noticeBox: {
    margin: 16,
    padding: 22,
    borderRadius: 20,
    backgroundColor: 'rgba(30,58,138,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  noticeTitle: { color: '#60a5fa', fontSize: 22, fontWeight: '900', textAlign: 'center' },
  noticeText: { color: '#bfdbfe', textAlign: 'center', marginTop: 6 },
  iconRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 20 },
  pipe: { color: '#334155', fontSize: 22, fontWeight: '700' },
  search: { marginHorizontal: 16, marginBottom: 16, padding: 14, borderRadius: 14, backgroundColor: '#0f172a', color: 'white', borderWidth: 1, borderColor: '#1e293b' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  modalBg: { flex: 1, backgroundColor: 'rgba(2,6,23,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '95%', height: '90%', backgroundColor: '#0f172a', borderRadius: 20, overflow: 'hidden' },
  modalTop: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' },
  modalRight: { flexDirection: 'row', gap: 18 },
});