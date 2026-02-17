import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Animated,
  Linking,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { Game } from '../assets/components/Game';
import { gamesData } from '../assets/data/games';
import { analytics } from '@/assets/data/firebaseConfig.js';
import { ChaosImage } from '@/assets/components/ChaosImage';
import { logEvent } from 'firebase/analytics';
import AdSenseBanner from '@/assets/components/adsense';

const decal = 'new-year';
const LS_FAVS = 'sparkly:favs';
const LS_RECENT = 'sparkly:recent';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const cheeseContainerRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- Bazinga ---------------- */
  const [bazingaMode, setBazingaMode] = useState(false);
  const [lang, setLang] = useState<'en' | 'tlh'>('en');
  const [cheeseMode, setCheeseMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cheeseAudioRef = useRef<HTMLAudioElement | null>(null);
  const cheeseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleBazinga = () => {
    setBazingaMode(prev => {
      const newMode = !prev;

      if (newMode) {
        // Turn ON Bazinga
        if (!audioRef.current) {
          audioRef.current = new Audio('/sounds/bazinga.mp3');
          audioRef.current.loop = true;
          audioRef.current.playbackRate = Math.random() + Math.random() * 1.25;
        }
        audioRef.current.play();
      } else {
        // Turn OFF Bazinga
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }

      setLang(l => (l === 'en' ? 'tlh' : 'en'));
      return newMode;
    });
  };

  // Simple wrapper
  const bazinga = () => toggleBazinga();


  /* ---------------- Soundboard ---------------- */
  const soundboard = () => {
    setModalGame({
      title: { en: 'Soundboard', tlh: 'Soundboard' },
      url: '/soundboard.htm',
      soundboard: true,
    });
    setIframeKey(k => k + 1);
  };

  /* ---------------- State ---------------- */
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'all' | 'favs' | 'recent'>('all');
  const [favs, setFavs] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [showHorror, setShowHorror] = useState(false);
  const [showPC, setShowPC] = useState(false);
  const [modalGame, setModalGame] = useState<any>(null);
  const [iframeKey, setIframeKey] = useState(0);

  /* ---------------- Animations ---------------- */
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 2200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.75, duration: 3000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  /* ---------------- Local Storage ---------------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const f = localStorage.getItem(LS_FAVS);
    const r = localStorage.getItem(LS_RECENT);
    if (f) setFavs(JSON.parse(f));
    if (r) setRecent(JSON.parse(r));
  }, []);
  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if ((iframeRef.current as any).webkitRequestFullscreen) {
        /* Safari/iOS Support */
        (iframeRef.current as any).webkitRequestFullscreen();
      } else if ((iframeRef.current as any).msRequestFullscreen) {
        /* IE11 Support */
        (iframeRef.current as any).msRequestFullscreen();
      }
    }
  };
  const saveFavs = (next: string[]) => {
    setFavs(next);
    if (typeof window !== 'undefined') localStorage.setItem(LS_FAVS, JSON.stringify(next));
  };

  const saveRecent = (next: string[]) => {
    setRecent(next);
    if (typeof window !== 'undefined') localStorage.setItem(LS_RECENT, JSON.stringify(next));
  };

  const toggleFav = (name: string) => saveFavs(favs.includes(name) ? favs.filter(f => f !== name) : [...favs, name]);
  const speak = () => {
      setModalGame({
      title: { en: 'TTS', tlh: 'TTS' },
      url: '/tts.htm',
      soundboard: true,
    });
    setIframeKey(k => k + 1);
  }
  const openGame = (game: any) => {
    saveRecent([game.title.en, ...recent.filter(r => r !== game.name)].slice(0, 12));
    logEvent(analytics, 'play_game', { game_name: game.title.en });
    setModalGame(game);
    setIframeKey(k => k + 1);
  };
  const cheese = () => {
    setCheeseMode(true);
    
    if (cheeseAudioRef.current) {
      cheeseAudioRef.current.currentTime = 0;
      cheeseAudioRef.current.play().catch(() => {});
    }

    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000000000000;
    `;
    document.body.appendChild(container);

    const createCheese = () => {
      const cheese = document.createElement('div');
      const leftPos = Math.random() * 100;
      const duration = 3 + Math.random() * 2;
      
      cheese.textContent = '🧀';
      cheese.style.cssText = `
        position: absolute;
        left: ${leftPos}%;
        top: -50px;
        font-size: 120px;
        animation: fall ${duration}s linear forwards;
        opacity: 1;
      `;
      
      container.appendChild(cheese);
      
      setTimeout(() => cheese.remove(), duration * 1000);
    };

    // Add CSS animation
    if (!document.getElementById('cheese-animation')) {
      const style = document.createElement('style');
      style.id = 'cheese-animation';
      style.textContent = `
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Create cheese pieces continuously
    const interval = setInterval(createCheese, 100);
    cheeseIntervalRef.current = interval;
  };

  /* ---------------- Filter Games ---------------- */
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
  let count = 0;

  /* ---------------- Render ---------------- */
  return (
    <View style={styles.container}>
      <Head>
        <title>Sparkly Games</title>
      </Head>

      {/* Glow Effect */}
      <Animated.View style={[styles.sparkleGlow, { opacity: glowAnim }]} />

      {/* Atmosphere Decal */}
      <View style={{height: 20}} />
      {/*
      <TouchableOpacity
        onPress={() => { count+=1; if (count===250) {cheese();count=0;} }}
      >
        <ChaosImage
          source={require(`../assets/images/cheese.png`)}
          style={styles[decal]}
          bazinga={bazingaMode}
        />
      </TouchableOpacity>
      */}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Notice Box */}
        <Animated.View style={[styles.noticeBox, { transform: [{ translateY: floatAnim }] }]}>
          <Text style={styles.noticeTitle}>✨ Sparkly Games ✨</Text>
          <Text style={[styles.noticeText, { fontWeight: 'bold' }]}>
            {bazingaMode ? 'UBGU chut' : 'Officially joining the UBGU!'}
          </Text>
          <Text style={styles.noticeText}>v7.7.2 · 17/02/26</Text>
          <View style={{ height: 24, flexDirection: 'row', gap: 12, alignSelf: 'center', flex: 1, marginTop: 20 }} >
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/sparkly-games')}>
              <Ionicons name="logo-octocat" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/vids')}>
              <Ionicons name="logo-youtube" size={24} color="white" />
            </TouchableOpacity>
            {/*
            <TouchableOpacity onPress={bazinga}>
              <Ionicons name="logo-electron" size={24} color="white" />
            </TouchableOpacity>
            */}
            <TouchableOpacity onPress={soundboard}>
              <Ionicons name="volume-high-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={speak}>
              <Ionicons name="mic" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://sparkly.statuspage.io/')}>
              <Ionicons name="bar-chart" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Search */}
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={bazingaMode ? 'quj nej…' : 'Search games…'}
          style={styles.search}
        />

        {/* Toggles */}
        <View style={styles.toggles}>
          {['all', 'favs', 'recent'].map(v => (
            <TouchableOpacity
              key={v}
              onPress={() => setView(v as any)}
              style={[styles.toggle, view === v && styles.toggleActive]}
            >
              <Text style={styles.toggleText}>
                {v === 'all' ? (bazingaMode ? 'pagh' : 'All') :
                 v === 'favs' ? (bazingaMode ? 'yInlu' : 'Favourites') :
                 bazingaMode ? 'QIn' : 'Recent'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={() => setShowHorror(!showHorror)}>
          <Text style={styles.horrorTxt}>{showHorror ? (bazingaMode ? 'ghItlh Horror' : 'Hide Horror') : (bazingaMode ? 'Qagh Horror' : 'Show Horror')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowPC(!showPC)}>
          <Text style={styles.horrorTxt}>{showPC ? (bazingaMode ? 'ghItlh PC' : 'Hide PC') : (bazingaMode ? 'Qagh PC' : 'Show PC')}</Text>
        </TouchableOpacity>

        {/* Leaving Soon */}
        { games.some(g => g.leaving) && (
          <Text style={styles.sectionTitle}>{bazingaMode ? 'yItlhutlh qet' : 'Leaving Soon'}</Text>
        )}
        <View style={styles.grid}>
          {games.filter(game => game.leaving).map(game => (
            <View key={game.title.en} style={{ width: itemWidth }}>
              <Game
                name={bazingaMode ? game.title.tlh ?? game.title.en : game.title.en}
                imageSource={game.img}
                decor={decal}
                leaving={game.leaving}
                onPress={() => openGame(game)}
                bazinga={bazingaMode}
                broken={game.broken}
                pcOnly={game.pc}
              />
              <TouchableOpacity onPress={() => toggleFav(game.title.en)} style={styles.star}>
                <Ionicons name={favs.includes(game.title.en) ? 'star' : 'star-outline'} size={22} color="#60a5fa" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* All Games */}
        <Text style={styles.sectionTitle}>{bazingaMode ? 'Qap' : 'Games'}</Text>
        <View style={styles.grid}>
          {games.filter(game => !game.leaving).map(game => (
            <View key={game.title.en} style={{ width: itemWidth }}>
              <Game
                name={bazingaMode ? game.title.tlh ?? game.title.en : game.title.en}
                imageSource={game.img}
                decor={decal}
                onPress={() => openGame(game)}
                bazinga={bazingaMode}
              />
              <TouchableOpacity onPress={() => toggleFav(game.title.en)} style={styles.star}>
                <Ionicons name={favs.includes(game.title.en) ? 'star' : 'star-outline'} size={22} color="#60a5fa" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={!!modalGame} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalGame(null)}>
                <Text style={styles.modalX}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFullscreen}>
                <Ionicons name="scan" size={28} color="#60a5fa" />
              </TouchableOpacity>

              {modalGame?.title.en && !modalGame?.soundboard && (
                <TouchableOpacity onPress={() => toggleFav(modalGame.title.en)}>
                  <Ionicons name={favs.includes(modalGame.title.en) ? 'star' : 'star-outline'} size={28} color="#60a5fa" />
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => setIframeKey(k => k + 1)}>
                <Ionicons name="refresh" size={28} color="#60a5fa" />
              </TouchableOpacity>
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

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#020617' // Deep midnight blue/black
  },
  scrollContent: { paddingBottom: 40 },
  sparkleGlow: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 420,
    backgroundColor: '#3b82f6', // Electric Blue
    top: -140,
    alignSelf: 'center',
    filter: 'blur(80px)', // Adds that soft atmospheric glow
  },
  'new-year': { height: 175, width: 400, top: 10, alignSelf: 'center' },

  noticeBox: {
    margin: 16,
    padding: 22,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 58, 138, 0.2)', // Deep blue tint
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)', // Cyan-blue border
  },
  noticeTitle: { 
    color: '#60a5fa', // Light sky blue
    fontSize: 22, 
    fontWeight: '900', 
    textAlign: 'center',
    textShadowColor: 'rgba(59, 130, 246, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10
  },
  noticeText: { color: '#bfdbfe', textAlign: 'center', marginTop: 6 },

  search: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#0f172a', // Slate blue
    color: 'white',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  toggles: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 10 },
  toggle: { 
    paddingVertical: 8, 
    paddingHorizontal: 14, 
    borderRadius: 14, 
    backgroundColor: '#1e293b' 
  },
  toggleActive: { 
    backgroundColor: '#2563eb', // Vibrant Primary Blue
    shadowColor: '#2563eb',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  toggleText: { color: 'white', fontWeight: '700' },
  horrorTxt: { 
    textAlign: 'center', 
    marginBottom: 12, 
    color: '#93c5fd', // Soft blue instead of red for "horror" to stay in theme
    fontWeight: '800' 
  },
  sectionTitle: { 
    color: '#ffffff', 
    textAlign: 'center', 
    marginBottom: 12, 
    fontSize: 20, 
    fontWeight: '800',
    letterSpacing: 1
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  star: { position: 'absolute', right: 10, top: 10 },

  modalBg: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { 
    width: '95%', 
    height: '90%', 
    backgroundColor: '#0f172a', 
    borderRadius: 20, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155'
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    padding: 8, 
    gap: 12, 
    backgroundColor: '#1e293b' 
  },
  modalX: { color: '#60a5fa', fontSize: 28, fontWeight: '900' },
});
