import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Game } from '../assets/components/Game';
import Ionicons from '@expo/vector-icons/Ionicons';
import slugMap from './uuids';


const decal = "";

export default function Index() {
  const router = useRouter();
  const [showHorror, setShowHorror] = useState(false);

  const gameGo = (path: string) => { 
    const slug = path.replace(/ /g, '-').toLowerCase();
    const uuid = slugMap[slug];
    if (uuid) router.push(`/student/package/${uuid}/task/2/item/5`);
  };

  return (
    <View style={styles.container}>
      <Image source={require(`@/assets/images/decal/${decal}-atmosphere.png`)} style={styles[decal]} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 20 }}>
          <View style={styles.noticeBox}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>Sparkly Games Awards 2025</Text>
            <Text style={{ color: 'white', fontSize: 14, marginBottom: 10, textAlign: 'center' }}>
              Nominate your favourite games for the <span style={{ fontWeight: 'bold' }}> Sparkly Games Awards 2025</span>!
            </Text>
            <TouchableOpacity style={styles.ctaButton} onPress={() => Linking.openURL('https://forms.gle/9JmsT8GT3w3yKSeP7')}>
              <Text style={styles.ctaButtonText}>Nominate Now</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Platformer / Runner Games Category */}
        <Text style={styles.categoryTitle}>🏃 Platformer / Runner Games 💨</Text>
        <View style={styles.gameList}>
          <Game name="Fast Runner" imageSource="t" onPress={() => gameGo('fast runner')} decor={decal} newUntil={25110615} showText />
          <Game name="Flappy Bird" imageSource="h" onPress={() => gameGo('flappy bird')} decor={decal} newUntil={25110615} showText />
          <Game name="Geometry Dash 3D" imageSource="o" onPress={() => gameGo('gd3d')} decor={decal} newUntil={25110615} showText />
          <Game name="Geometry Dash Wave" imageSource="x" onPress={() => gameGo('gdwv')} decor={decal} newUntil={25121015} showText />
          <Game name="OvO" imageSource="7" onPress={() => gameGo('ovo')} decor={decal} />
          <Game name="Subway Surfers" imageSource="3" onPress={() => gameGo('subway surfers')} decor={decal} />
          <Game name="Survival Race" imageSource="d" onPress={() => gameGo('survival race')} decor={decal} />
        </View>

        {/* Sports Games Category */}
        <Text style={styles.categoryTitle}>⚽ Sports & Competitive 🏆</Text>
        <View style={styles.gameList}>
          <Game name="A Small World Cup" imageSource="ag" onPress={() => gameGo('a small world cup')} decor={decal} newUntil={25122015} showText />
          <Game name="Basket Random" imageSource="ac" onPress={() => gameGo('ba random')} decor={decal} newUntil={25121015} showText />
          <Game name="Darts Pro" imageSource="f" onPress={() => gameGo('darts')} decor={decal} showText />
          <Game name="Google Games Baseball" imageSource="y" onPress={() => gameGo('gg baseball')} decor={decal} newUntil={25121015} bugged/>
          <Game name="Google Games Cricket" imageSource="z" onPress={() => gameGo('gg cricket')} decor={decal} newUntil={25121015} bugged/>
          <Game name="Idle Football Manager" imageSource="k" onPress={() => gameGo('idle foot')} decor={decal} />
          <Game name="Penalty Kick Online" imageSource="e" onPress={() => gameGo('pens')} decor={decal} />
          <Game name="Tap Goal" imageSource="s" onPress={() => gameGo('tap goal')} decor={decal} newUntil={25110615} showText />
        </View>

        {/* Fighting & Action Games Category */}
        <Text style={styles.categoryTitle}>🥊 Fighting & Ragdoll Action 💥</Text>
        <View style={styles.gameList}>
          <Game name="Boxing Random" imageSource="ab" onPress={() => gameGo('bo random')} decor={decal} newUntil={25121015} showText />
          <Game name="GunSpin" imageSource="8" onPress={() => gameGo('gunspin')} decor={decal} />
          <Game name="Ragdoll Archers" imageSource="2" onPress={() => gameGo('ragdoll archers')} decor={decal} />
          <Game name="Ragdoll Hit" imageSource="c" onPress={() => gameGo('ragdoll hit')} decor={decal} newUntil={25110615} />
        </View>

        {/* Driving & Stunt Games Category */}
        <Text style={styles.categoryTitle}>🚗 Driving & Stunt Games 🚧</Text>
        <View style={styles.gameList}>
          <Game name="Adventure Drivers" imageSource="ae" onPress={() => gameGo('adventure drivers')} decor={decal} newUntil={25121015} showText />
          <Game name="Crazy Crash Landing" imageSource="n" onPress={() => gameGo('ccl')} decor={decal} customBadge={"⭐️ FAN FAVOURITE ⭐️"} showText />
          <Game name="Crashy Road" imageSource="j" onPress={() => gameGo('crashy road')} decor={decal} newUntil={25120115} fixed/>
          <Game name="Drift Boss" imageSource="u" onPress={() => gameGo('drift boss')} decor={decal} newUntil={25110615} showText />
          <Game name="Drive Mad" imageSource="9" onPress={() => gameGo('drive mad')} decor={decal} showText />
          <Game name="Wheelie Bike" imageSource="l" onPress={() => gameGo('wheelie bike')} decor={decal} newUntil={25112515} />
          <Game name="X3M Winter" imageSource="0" onPress={() => gameGo('x3m winter')} decor={decal} newUntil={25112015} fixed/>
        </View>

        {/* Puzzle & Casual Games Category */}
        <Text style={styles.categoryTitle}>🧩 Puzzle & Casual Games ✨</Text>
        <View style={styles.gameList}>
          <Game name="BitLife" imageSource="6" onPress={() => gameGo('bitlife')} decor={decal} customBadge={"⭐️ FAN FAVOURITE ⭐️"} showText />
          <Game name="Block Blast" imageSource="aa" onPress={() => gameGo('blockblast')} decor={decal} newUntil={25121015} showText />
          <Game name="Draw Climber" imageSource="g" onPress={() => gameGo('draw climb')} decor={decal} newUntil={25110615} showText />
          <Game name="Gobble" imageSource="r" onPress={() => gameGo('gobble')} decor={decal} newUntil={25111015} />
          <Game name="Nut Sort" imageSource="aj" onPress={() => gameGo('nut sort')} decor={decal} customBadge={"👾 RETURN 👾"} />
          <Game name="Roll" imageSource="w" onPress={() => gameGo('roll')} decor={decal} newUntil={25110615} />
          <Game name="Roper" imageSource="b" onPress={() => gameGo('roper')} decor={decal} />
          <Game name="Slice Master" imageSource="q" onPress={() => gameGo('slice master')} decor={decal} newUntil={25112015} customBadge={"⭐️ FAN FAVOURITE ⭐️"}/>
          <Game name="Spiral Roll" imageSource="i" onPress={() => gameGo('spiral roll')} decor={decal} newUntil={25110615} />
          <Game name="Stack" imageSource="v" onPress={() => gameGo('stack')} decor={decal} newUntil={25120615} />
          <Game name="There is No Game" imageSource="af" onPress={() => gameGo('there is no game')} decor={decal} newUntil={25121015}/>
        </View>

        {/* Clicker & Idle Games Category */}
        <Text style={styles.categoryTitle}>🎣 Clicker & Idle Games 💰</Text>
        <View style={styles.gameList}>
          <Game name="Duck Duck Clicker" imageSource="4" onPress={() => gameGo('duck clicker')} decor={decal} showText />
          <Game name="NEW Tiny Fishing" imageSource="1" onPress={() => gameGo('new tiny fishing')} decor={decal} newUntil={25123015} fixed/>
          <Game name="Tiny Fishing" imageSource="1" onPress={() => gameGo('tiny fishing')} decor={decal} customBadge={"⭐️ FAN FAVOURITE ⭐️"}/>
        </View>

        {/* Strategy & Tower Defense Category */}
        <Text style={styles.categoryTitle}>🛡️ Strategy & Tower Defense ♟️</Text>
        <View style={styles.gameList}>
          <Game name="Bloons Tower Defence 5" imageSource="m" onPress={() => gameGo('btd')} decor={decal} showText />
          <Game name="Plants vs Zombies" imageSource="p" onPress={() => gameGo('pvz')} decor={decal} newUntil={25110615} />
        </View>

        {/* Rhythm Games Category */}
        <Text style={styles.categoryTitle}>🎶 Rhythm Games 🎵</Text>
        <View style={styles.gameList}>
          <Game name="A Dance of Fire and Ice" imageSource="ad" onPress={() => gameGo('adofai')} decor={decal} newUntil={25121015} showText />
        </View>
        
        {/* Miscellaneous Games Category */}
        <Text style={styles.categoryTitle}>⭐ Other Great Games ⭐</Text>
        <View style={styles.gameList}>
          <Game name="Thorns and Balloons" imageSource="5" onPress={() => gameGo('tabs')} decor={decal} customBadge={"⭐️ FAN FAVOURITE ⭐️"}/>
        </View>


        <TouchableOpacity style={styles.button} onPress={() => setShowHorror(!showHorror)}>
          <Text style={styles.buttonText}>{showHorror ? 'Hide Horror' : 'Show Horror'}</Text>
        </TouchableOpacity>

        {showHorror && (
          <>
            <Text style={styles.noticeTitle}>🎃 Horror Games 👻</Text>
            <View style={styles.gameList}>
              <Game name="Five Nights at Freddy's 1" imageSource="a" onPress={() => gameGo('f1')} decor={decal} newUntil={25120615} />
              <Game name="Five Nights at Freddy's 2" imageSource="ah" onPress={() => gameGo('f2')} decor={decal} newUntil={26010615} />
              <Game name="Five Nights at Freddy's 3" imageSource="ai" onPress={() => gameGo('f3')} decor={decal} newUntil={26011015} bugged/>
            </View>
          </>
        )}
      </ScrollView>

      <View>
        <code style={{ margin: 10, color: 'white' }}>v6.7.5 [ 07/12/25 ]</code>
        <View style={{ position: 'absolute', right: 10, flexDirection: 'row' }}>
          <Ionicons name="information-circle" size={28} color="white" onPress={() => Linking.openURL('https://raw.githubusercontent.com/sparkly-games/main-site/refs/heads/main/CREDITS')} />
          <Ionicons name="logo-github" size={28} color="white" onPress={() => Linking.openURL('https://github.com/sparkly-games')} />
          
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2b2b2bff' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  categoryTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginVertical: 15, textAlign: 'center' },
  gameList: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  noticeTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  button: { backgroundColor: 'rgba(135,189,229,1)', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  halloween: { position: 'absolute', height: 350, width: 400 },
  christmas: { position: 'absolute', height: 350, width: 400, bottom: 0 },
  "": { display: 'none' },
  noticeBox: { backgroundColor: '#001f3f', padding: 15, borderRadius: 10, marginBottom: 15, width: '90%', paddingBottom: 20, paddingTop: 20, alignSelf: 'center', alignContent: 'center', justifyContent: 'center' },
  ctaButton: { backgroundColor: 'rgba(135,189,229,1)', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  ctaButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
