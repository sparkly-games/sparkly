import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Game } from '../components/Game';
import Ionicons from '@expo/vector-icons/Ionicons';
import slugMap from './uuids';
import Banner from '@/components/Banner';


const decal = "";

export default function Index() {
  const router = useRouter();
  const [showHorror, setShowHorror] = useState(false);

  const gameGo = (path: string) => { 
    const slug = path.replace(/ /g, '-').toLowerCase();
    const uuid = slugMap[slug];
    if (uuid) router.push(`/student/package/${uuid}/task/2/item/${(Math.random()).toString().slice(6, 7)}`);
  };

  return (
    <View style={styles.container}>
      <Image source={require(`@/assets/images/decal/${decal}-atmosphere.png`)} style={styles[decal]} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.noticeTitle}>Tiny Fishing has been updated 🎉.</Text>
        <Game name="NEW Tiny Fishing" imageSource="1" onPress={() => gameGo('new-tiny-fishing')} decor={decal} newUntil={25123015} />
        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>Welcome!</Text>
          <Text style={{ color: 'white', textAlign: 'center', marginTop: 6 }}>
            Welcome to OG12, where games are added daily, with new surprises just around the corner. You can use the bug button in the header to report a bug in a game and use the other buttons as "safety escapes".
          </Text>
          {/*
            <TouchableOpacity style={styles.ctaButton} onPress={() => Linking.openURL('https://sparkly.sparxlearning.cloud-ip.cc')}>
              <Text style={styles.ctaButtonText}>Gaming for More.</Text>
            </TouchableOpacity>
          */}
        </View>
        <View style={styles.gameList}>
          <Game name="ADOFI" imageSource="ad" onPress={() => gameGo('adofai')} decor={decal} newUntil={25121015} />
          <Game name="Basket Random" imageSource="ac" onPress={() => gameGo('ba-random')} decor={decal} newUntil={25121015} />
          <Game name="Boxing Random" imageSource="ab" onPress={() => gameGo('bo-random')} decor={decal} newUntil={25121015} />
          <Game name="BitLife" imageSource="6" onPress={() => gameGo('bitlife')} decor={decal} />
          <Game name="Block Blast" imageSource="aa" onPress={() => gameGo('blockblast')} decor={decal} newUntil={25121015} />
          <Game name="BTD 5" imageSource="m" onPress={() => gameGo('btd')} decor={decal} />
          <Game name="CCL" imageSource="n" onPress={() => gameGo('ccl')} decor={decal} />
          <Game name="Crashy Road" imageSource="j" onPress={() => gameGo('crashy road')} decor={decal} newUntil={25120115} bugged/>
          <Game name="Darts Pro" imageSource="f" onPress={() => gameGo('darts')} decor={decal} />
          <Game name="Draw Climber" imageSource="g" onPress={() => gameGo('draw climb')} decor={decal} newUntil={25110615} />
          <Game name="Drift Boss" imageSource="u" onPress={() => gameGo('drift boss')} decor={decal} newUntil={25110615} />
          <Game name="Drive Mad" imageSource="9" onPress={() => gameGo('drive mad')} decor={decal} />
          <Game name="DDC" imageSource="4" onPress={() => gameGo('duck clicker')} decor={decal} />
          <Game name="Fast Runner" imageSource="t" onPress={() => gameGo('fast runner')} decor={decal} newUntil={25110615} />
          <Game name="Flappy Bird" imageSource="h" onPress={() => gameGo('flappy bird')} decor={decal} newUntil={25110615} />
          <Game name="G-Dash 3D" imageSource="o" onPress={() => gameGo('gd3d')} decor={decal} newUntil={25110615} />
          <Game name="G-Dash Wave" imageSource="x" onPress={() => gameGo('gdwv')} decor={decal} newUntil={25121015} />
          <Game name="GG Cricket" imageSource="z" onPress={() => gameGo('gg-cricket')} decor={decal} newUntil={25121015} bugged/>
          <Game name="GG Baseball" imageSource="y" onPress={() => gameGo('gg-baseball')} decor={decal} newUntil={25121015} />
          <Game name="Gobble" imageSource="r" onPress={() => gameGo('gobble')} decor={decal} newUntil={25111015} />
          <Game name="GunSpin" imageSource="8" onPress={() => gameGo('gunspin')} decor={decal} />
          <Game name="Idle Football" imageSource="k" onPress={() => gameGo('idle foot')} decor={decal} />
          <Game name="OvO" imageSource="7" onPress={() => gameGo('ovo')} decor={decal} />
          <Game name="Penalty Kick" imageSource="e" onPress={() => gameGo('pens')} decor={decal} />
          <Game name="PvZ" imageSource="p" onPress={() => gameGo('pvz')} decor={decal} newUntil={25110615} />
          <Game name="Ragdoll Archer" imageSource="2" onPress={() => gameGo('ragdoll archers')} decor={decal} />
          <Game name="Ragdoll Hit" imageSource="c" onPress={() => gameGo('ragdoll hit')} decor={decal} newUntil={25110615} />
          <Game name="Roll" imageSource="w" onPress={() => gameGo('roll')} decor={decal} newUntil={25110615} />
          <Game name="Roper (⚠︎)" imageSource="b" onPress={() => gameGo('roper')} decor={decal} />
          <Game name="Slice Master" imageSource="q" onPress={() => gameGo('slice master')} decor={decal} newUntil={25112015} />
          <Game name="Spiral Roll" imageSource="i" onPress={() => gameGo('spiral roll')} decor={decal} newUntil={25110615} />
          <Game name="Stack" imageSource="v" onPress={() => gameGo('stack')} decor={decal} newUntil={25120615} />
          <Game name="Subway Surfers" imageSource="3" onPress={() => gameGo('subway surfers')} decor={decal} />
          <Game name="Survival Race" imageSource="d" onPress={() => gameGo('survival race')} decor={decal} />
          <Game name="Tap Goal" imageSource="s" onPress={() => gameGo('tap goal')} decor={decal} newUntil={25110615} />
          <Game name="TABS" imageSource="5" onPress={() => gameGo('tabs')} decor={decal} />
          <Game name="There is No Game" imageSource="" onPress={() => gameGo('there-is-no-game')} decor={decal} newUntil={25121015} />
          <Game name="Tiny Fishing" imageSource="1" onPress={() => gameGo('tiny fishing')} decor={decal} />
          <Game name="Wheelie Bike" imageSource="l" onPress={() => gameGo('wheelie bike')} decor={decal} newUntil={25112515} />
          <Game name="X3M Winter" imageSource="0" onPress={() => gameGo('x3m winter')} decor={decal} newUntil={25112015} bugged/>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => setShowHorror(!showHorror)}>
          <Text style={styles.buttonText}>{showHorror ? 'Hide Horror' : 'Show Horror'}</Text>
        </TouchableOpacity>

        {showHorror && (
          <>
            <Text style={styles.noticeTitle}>🎃 Horror Games 🎃</Text>
            <View style={styles.gameList}>
              <Game name="FNaF 1" imageSource="a" onPress={() => gameGo('f1')} decor={decal} newUntil={25120615} />
            </View>
          </>
        )}
      </ScrollView>

      <View>
        <code style={{ margin: 10, color: 'white' }}>v6.4.002 [ 03/12/25 ]</code>
        <View style={{ position: 'absolute', right: 10, flexDirection: 'row' }}>
          <Ionicons name="information-circle" size={28} color="white" onPress={() => Linking.openURL('https://raw.githubusercontent.com/onlinegames19/main-site/refs/heads/main/CREDITS')} />
          <Ionicons name="book" size={26} color="white" onPress={() => Linking.openURL('/404.html')} />
          <Ionicons name="logo-github" size={28} color="white" onPress={() => Linking.openURL('https://github.com/onlinegames19')} />
          
        </View>
      </View>
    </View>
  );
}

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
  "": { display: 'none' },
  noticeBox: { backgroundColor: '#001f3f', padding: 15, borderRadius: 10, marginBottom: 15, width: '90%', paddingBottom: 20, paddingTop: 20, alignSelf: 'center', alignContent: 'center', justifyContent: 'center', maxWidth: 1000 },
  ctaButton: { backgroundColor: 'rgba(135,189,229,1)', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  ctaButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
