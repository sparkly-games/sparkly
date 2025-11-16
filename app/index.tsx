import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Linking, Animated, Easing, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Game } from '../components/Game';
import Ionicons from '@expo/vector-icons/Ionicons';
import slugMap from './uuids';

// --- Interface and Parsing Logic ---

interface RemoteNotice {
  name: string;
  info: string;
  noticeDetails: string;
  end: number;
}

const decal = "";
const errorNoticesUrl = 'https://raw.githubusercontent.com/onlinegames19/main-site/main/errors.md';

const parseNotices = (rawText: string): RemoteNotice[] => {
  return rawText
    .split('---')
    .filter(block => block.trim())
    .map(block => {
      const data: any = {};
      block.trim().split('\n').forEach(line => {
        const [key, ...rest] = line.split(':');
        if (!key || !rest.length) return;
        const value = rest.join(':').trim().replace(/^['"]|['"]$/g, '');
        if (['name', 'info', 'noticeDetails'].includes(key)) data[key] = value;
        if (key === 'end') data.end = parseInt(value, 10);
      });
      return data as RemoteNotice;
    })
    .filter(n => n.name && n.info && n.noticeDetails && !isNaN(n.end));
};

// --- Toast Notice Component ---

const ToastNotice = ({ notice }: { notice: RemoteNotice | null }) => {
  const [isVisible, setIsVisible] = useState(false);
  const translateY = useRef(new Animated.Value(-100)).current;

  const DISPLAY_DURATION = 8000;
  const ANIMATION_DURATION = 500;

  useEffect(() => {
    if (notice) {
      setIsVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        const timer = setTimeout(() => {
          Animated.timing(translateY, {
            toValue: -100,
            duration: ANIMATION_DURATION,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }).start(() => setIsVisible(false));
        }, DISPLAY_DURATION);
        return () => clearTimeout(timer);
      });
    }
  }, [notice]);

  if (!notice || !isVisible) return null;

  const dismissToast = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: ANIMATION_DURATION,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };

  return (
    <Animated.View style={[toastStyles.toastContainer, { transform: [{ translateY }] }]}>
      <View style={toastStyles.toastContent}>
        <View style={toastStyles.textContainer}>
          <Text style={toastStyles.toastTitle}>{notice.name}</Text>
          <Text style={toastStyles.toastInfo} numberOfLines={5}>
            {notice.info}
          </Text>
        </View>
        <TouchableOpacity onPress={dismissToast} style={toastStyles.closeButton}>
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// --- Main Index Component ---

export default function Index() {
  const router = useRouter();
  const [initialNotice, setInitialNotice] = useState<RemoteNotice | null>(null);
  const [showHorror, setShowHorror] = useState(false);

  const gameGo = (path: string) => { 
    slug = path.replace(/ /g, '-').toLowerCase();
    const uuid = slugMap[slug];
    if (uuid) router.push(`/package/${uuid}/item/${(Math.random() * 100000000000000000).toString().slice(0, 1)}`);
  };

  const fetchAndFilterNotices = async () => {
    try {
      const response = await fetch(errorNoticesUrl);
      if (!response.ok) throw new Error('Network error');
      const allNotices = parseNotices(await response.text());
      const now = Date.now();
      const active = allNotices.find(n => n.end * 1000 > now) || null;
      if (active) setInitialNotice(active);
    } catch {
      setInitialNotice(null);
    }
  };

  useEffect(() => { fetchAndFilterNotices(); }, []);

  return (
    <View style={styles.container}>
      <ToastNotice notice={initialNotice} />
      <Image source={require(`@/assets/images/decal/${decal}-atmosphere.png`)} style={styles[decal]} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}></Text>
        <View style={styles.gameList}>
          <Game name="BitLife" imageSource="6" onPress={() => gameGo('bitlife')} decor={decal} />
          <Game name="BTD 5" imageSource="m" onPress={() => gameGo('btd')} decor={decal} />
          <Game name="CCL" imageSource="n" onPress={() => gameGo('ccl')} decor={decal} />
          <Game name="Crashy Road" imageSource="12" onPress={() => gameGo('crashy road')} decor={decal} newUntil={25120115} />
          <Game name="Darts Pro" imageSource="f" onPress={() => gameGo('darts')} decor={decal} />
          <Game name="Draw Climber" imageSource="g" onPress={() => gameGo('draw climb')} decor={decal} newUntil={25110615} />
          <Game name="Drift Boss" imageSource="w" onPress={() => gameGo('drift boss')} decor={decal} newUntil={25110615} />
          <Game name="Drive Mad" imageSource="9" onPress={() => gameGo('drive mad')} decor={decal} />
          <Game name="DDC" imageSource="4" onPress={() => gameGo('duck clicker')} decor={decal} />
          <Game name="Fast Runner" imageSource="t" onPress={() => gameGo('fast runner')} decor={decal} newUntil={25110615} />
          <Game name="FB + WG: Temple" imageSource="s" onPress={() => gameGo('fireboy and watergirl')} decor={decal} newUntil={25120115} />
          <Game name="Flappy Bird" imageSource="h" onPress={() => gameGo('flappy bird')} decor={decal} newUntil={25110615} />
          <Game name="G-Dash 3D" imageSource="z" onPress={() => gameGo('gd3d')} decor={decal} newUntil={25110615} />
          <Game name="Gobble" imageSource="u" onPress={() => gameGo('gobble')} decor={decal} newUntil={25111015} />
          <Game name="GunSpin" imageSource="8" onPress={() => gameGo('gunspin')} decor={decal} />
          <Game name="Helix Jump" imageSource="03" onPress={() => gameGo('helix')} decor={decal} newUntil={25120115} />
          <Game name="Idle Football" imageSource="k" onPress={() => gameGo('idle foot')} decor={decal} />
          <Game name="Nut Sort" imageSource="340" onPress={() => gameGo('nut sort')} decor={decal} newUntil={25120115} />
          <Game name="OvO" imageSource="7" onPress={() => gameGo('ovo')} decor={decal} />
          <Game name="Penalty Kick" imageSource="e" onPress={() => gameGo('pens')} decor={decal} />
          <Game name="PvZ" imageSource="p" onPress={() => gameGo('pvz')} decor={decal} newUntil={25110615} />
          <Game name="Ragdoll Archer" imageSource="2" onPress={() => gameGo('ragdoll archers')} decor={decal} />
          <Game name="Ragdoll Hit" imageSource="c" onPress={() => gameGo('ragdoll hit')} decor={decal} newUntil={25110615} />
          <Game name="Roll" imageSource="y" onPress={() => gameGo('roll')} decor={decal} newUntil={25110615} />
          <Game name="Roper (⚠︎)" imageSource="b" onPress={() => gameGo('roper')} decor={decal} />
          <Game name="Run 3" imageSource="o" onPress={() => gameGo('run3')} decor={decal} pcOnly />
          <Game name="Slice Master" imageSource="q" onPress={() => gameGo('slice master')} decor={decal} newUntil={25112015} />
          <Game name="Snowball.io" imageSource="67" onPress={() => gameGo('snowball io')} decor={decal} newUntil={25120115} />
          <Game name="Spiral Roll" imageSource="i" onPress={() => gameGo('spiral roll')} decor={decal} newUntil={25110615} />
          <Game name="Stack" imageSource="x" onPress={() => gameGo('stack')} decor={decal} newUntil={25120615} />
          <Game name="Subway Surfers" imageSource="3" onPress={() => gameGo('subway surfers')} decor={decal} />
          <Game name="Survival Race" imageSource="d" onPress={() => gameGo('survival race')} decor={decal} />
          <Game name="Swoop!" imageSource="r" onPress={() => gameGo('swoop')} decor={decal} newUntil={25110615} />
          <Game name="Tap Goal" imageSource="v" onPress={() => gameGo('tap goal')} decor={decal} newUntil={25110615} />
          <Game name="Thief Puzzle" imageSource="30" onPress={() => gameGo('tpo')} decor={decal} newUntil={25120115} />
          <Game name="TABS" imageSource="5" onPress={() => gameGo('tabs')} decor={decal} />
          <Game name="Tiny Fishing" imageSource="1" onPress={() => gameGo('tiny fishing')} decor={decal} />
          <Game name="Wheelie Bike" imageSource="25" onPress={() => gameGo('wheelie bike')} decor={decal} newUntil={25112515} />
          <Game name="X3M Winter" imageSource="02" onPress={() => gameGo('x3m winter')} decor={decal} newUntil={25112015} />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => setShowHorror(!showHorror)}>
          <Text style={styles.buttonText}>{showHorror ? 'Hide Horror' : 'Show Horror'}</Text>
        </TouchableOpacity>

        {showHorror && (
          <>
            <Text style={styles.noticeTitle}>🎃 Horror Games 🎃</Text>
            <View style={styles.gameList}>
              <Game name="Granny" imageSource="j" onPress={() => gameGo('granny')} decor={decal} newUntil={25110615} pcOnly />
              <Game name="FNaF 1" imageSource="a" onPress={() => gameGo('f1')} decor={decal} newUntil={25120615} />
              <Game name="FNaF 2" imageSource="a" onPress={() => gameGo('f2')} decor={decal} newUntil={25120615} pcOnly />
              <Game name="UCN" imageSource="a" onPress={() => gameGo('ucn')} decor={decal} newUntil={25120615} pcOnly />
            </View>
          </>
        )}
      </ScrollView>

      <View>
        <code style={{ margin: 10, color: 'white' }}>v6.1.1 [ 16/11/25 ]</code>
        <View style={{ position: 'absolute', right: 10, flexDirection: 'row' }}>
          <Ionicons name="information-circle" size={28} color="white" onPress={() => Linking.openURL('https://raw.githubusercontent.com/onlinegames19/main-site/refs/heads/main/CREDITS')} />
          <Ionicons name="book" size={26} color="white" onPress={() => Linking.openURL('/behindcloseddoors.pdf')} />
          <Ionicons name="logo-github" size={28} color="white" onPress={() => Linking.openURL('https://github.com/onlinegames19')} />
        </View>
      </View>
    </View>
  );
}


// --- Toast Styles ---
const toastStyles = StyleSheet.create({
  toastContainer: { position: 'absolute', top: 15, right: 15, zIndex: 1000, borderRadius: 8, overflow: 'hidden', maxWidth: 500, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  toastContent: { backgroundColor: 'rgba(74, 168, 255, 0.95)', flexDirection: 'row', alignItems: 'center', padding: 10 },
  textContainer: { flex: 1, paddingRight: 5 },
  toastTitle: { color: 'white', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  toastInfo: { color: 'white', fontSize: 12 },
  closeButton: { padding: 2 },
});

// --- General Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2b2b2bff' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  gameList: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  noticeTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  button: { backgroundColor: 'rgba(135,189,229,1)', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  halloween: { position: 'absolute', height: 350, width: 400 },
  christmas: { position: 'absolute', height: 350, width: 400, bottom: 0 },
  "": { display: 'none' }
});
