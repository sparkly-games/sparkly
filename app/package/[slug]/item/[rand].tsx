import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { analytics, logEvent } from '../../../firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import slugMap from '../../../uuids';

const prefix = '../../..';

// Map game slugs to URLs and display names
const games: Record<string, [string, string]> = {
  'tiny-fishing': [`${prefix}/tiny-fishing`, 'Tiny Fishing'],
  'ragdoll-archers': [`${prefix}/ragdoll-archers`, 'Ragdoll Archers'],
  'subway-surfers': [`${prefix}/subway-surfers`, 'Subway Surfers'],
  'duck-clicker': [`${prefix}/duck-duck-clicker`, 'Duck Duck Clicker'],
  'tabs': [`${prefix}/thorns-and-balloons`, 'Thorns and Balloons'],
  'bitlife': [`${prefix}/bitlife`, 'BitLife'],
  'ovo': [`${prefix}/ovo`, 'OvO'],
  'gunspin': [`${prefix}/gunspin`, 'Gunspin'],
  'drive-mad': [`${prefix}/drive-mad`, 'Drive Mad'],
  'roper': [`${prefix}/roper`, 'Roper'],
  'survival-race': [`https://svlrc.sparxlearning.cloud-ip.cc`, 'Survival Race'],
  'pens': [`${prefix}/penkick`, 'Penalty Kick Online'],
  'darts': [`${prefix}/dartspro`, 'Darts Pro'],
  'idle-foot': [`${prefix}/idle-football`, 'Idle Football'],
  'btd': [`${prefix}/btd5.htm`, 'BTD5'],
  'ccl': [`${prefix}/ccl.htm`, 'Crazy Crash Landing'],
  'run3': [`${prefix}/run3`, 'Run 3'],
  'pvz': [`${prefix}/pvz`, 'Plants VS Zombies'],
  'spiral-roll': [`${prefix}/slice-roll`, 'Spiral Roll'],
  'tap-goal': [`${prefix}/tap-goal`, 'Tap Goal'],
  'draw-climb': [`${prefix}/draw-climber`, 'Draw Climber'],
  'flappy-bird': [`${prefix}/flappy-bird`, 'Flappy Bird'],
  'drift-boss': [`${prefix}/drift-boss`, 'Drift Boss'],
  'granny': [`${prefix}/granny.htm`, 'Granny'],
  'swoop': [`${prefix}/swoop.htm`, 'Swoop'],
  'fast-runner': [`${prefix}/fast-runner`, 'Fast Runner'],
  'roll': [`${prefix}/roll.html`, 'Roll'],
  'ragdoll-hit': [`${prefix}/ragdoll-hit`, 'Ragdoll Hit'],
  'gd3d': [`${prefix}/gd3d`, 'Geometry Dash 3D'],
  'gobble': [`${prefix}/gobble`, 'Gobble'],
  'slice-master': [`https://game-hub.nyc3.cdn.digitaloceanspaces.com/slice-master/index.html`, 'Slice Master'],
  'x3m-winter': [`${prefix}/x3m`, 'Moto X3M Winter'],
  'wheelie-bike': [`${prefix}/wheelie-bike`, 'Wheelie Bike'],
  'tpo': [`${prefix}/tpo`, 'Thief Puzzle Online'],
  'f1': [`https://fnaf.sparxlearning.cloud-ip.cc/FNAF1`, 'Five Nights at Freddy\'s 1'],
  'f2': [`https://fnaf.sparxlearning.cloud-ip.cc/FNAF2`, 'Five Nights at Freddy\'s 2'],
  'ucn': [`https://fnaf.sparxlearning.cloud-ip.cc/UCN`, 'Ultimate Custom Night'],
  'stack': [`${prefix}/stack`, 'Stack'],
  'nut-sort': [`${prefix}/nutsort`, 'Nut Sort'],
  'crashy-road': [`${prefix}/crashyroad`, 'Crashy Road'],
  'fireboy-and-watergirl': [`${prefix}/fireboy-and-watergirl.htm`, 'Fireboy and Watergirl'],
  'helix': [`${prefix}/helix`, 'Helix Jump'],
  'snowball-io': [`${prefix}/snowball`, 'Snowball.io'],
};

export default function GameScreen() {
  const router = useRouter();
  const { slug, rand } = useLocalSearchParams();

  // If the incoming :slug is a friendly slug that maps to a UUID, redirect to the UUID route.
  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;

    const uuid = (slugMap as Record<string, string>)[slug];
    if (uuid) {
      // use replace to avoid polluting history/back navigation
      router.replace(`/package/${uuid}/item/${rand}`);
    }
  }, [slug, router, rand]);

  // Determine the friendly slug used as the key in `games`.
  const friendlyKey = useMemo(() => {
    if (!slug || typeof slug !== 'string') return undefined;

    // If slug is one of the UUIDs (a value in slugMap), find the corresponding friendly slug (key).
    const keys = Object.keys(slugMap) as string[];
    const found = keys.find(k => (slugMap as Record<string, string>)[k] === slug);
    // If found, use that friendly slug; otherwise assume the incoming slug already is a friendly slug.
    return found ?? slug;
  }, [slug]);

  const gameUrl = friendlyKey ? games[friendlyKey]?.[0] ?? null : null;
  const displayName = friendlyKey ? games[friendlyKey]?.[1] ?? friendlyKey.replace(/-/g, ' ') : '';

  useEffect(() => {
    if (!gameUrl || !analytics) return;

    const logGame = async () => {
      const id = uuidv4();
      const timestamp = new Date().toISOString();
      try {
        logEvent(analytics, 'game', {
          id,
          time: timestamp,
          requestedSlug: slug,
          friendlySlug: friendlyKey,
          gameUrl,
          path: typeof window !== 'undefined' ? new URL(gameUrl, window.location.origin).pathname : null,
        });
      } catch (e) {
        // swallow logging errors
      }
    };

    logGame();
  }, [slug, friendlyKey, gameUrl]);

  if (!gameUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}><code>404</code> - Game may have been removed or moved.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: displayName }} />
      <iframe
        src={gameUrl}
        style={styles.iframe}
        title={displayName}
        allowFullScreen={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  iframe: { flex: 1, width: '100%', height: '100%', borderWidth: 0 },
  errorText: { fontSize: 20, color: 'red', textAlign: 'center', marginTop: 50 },
});