import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '@/assets/data/firebaseConfig';
import { gameIcons as icons } from '@/assets/data/GameIcons';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const user = auth.currentUser;
  const gameIcons = icons();

  const LEADERBOARD = useMemo(() => [
    { id: '1', name: 'Riley', score: 2400, avatar: user?.photoURL },
    { id: '2', name: 'Henry', score: 2100 },
    { id: '3', name: 'Louis', score: 1900 },
    { id: '4', name: 'Bobby', score: 1700 },
    { id: '5', name: 'James', score: 1500 },
    { id: '6', name: 'Charlie', score: 1200 },
    { id: '7', name: 'Mason', score: 1100 },
    { id: '8', name: 'Robert', score: 1034 },
    { id: '9', name: 'Jack', score: 967 },
  ], []);

  const RankItem = ({ item, index }) => {
    const isTop3 = index < 3;

    return (
      <View style={[styles.rankRow, isTop3 && styles.topRank]}>
        <Text style={styles.rankIndex}>#{index + 1}</Text>

        <Image
          source={item.avatar ? { uri: item.avatar } : { uri: "https://ui-avatars.com/api/?name="+item.name }}
          style={styles.avatar}
        />

        <View style={styles.nameBlock}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.score}>{item.score} pts</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* LEFT SIDE */}
      <View style={[styles.mainContent, isDesktop && styles.desktopContent]}>
        <Text style={styles.title}>Weekly Leaderboard</Text>
        <Text style={styles.subtitle}>Top players this week</Text>

        {/* BIG GAME CARD */}
        <View style={[styles.gameCard, { opacity: 1 }]}>
            <Image
            source={gameIcons['2']}
            style={styles.gameImage}
            />

            <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Ragdoll Archers</Text>
            <Text style={styles.gameSubtitle}>
                Compete in physics-based archery battles
            </Text>
            </View>
        </View>
        <View style={styles.gameCard}>
            <Image
            source={gameIcons['1']}
            style={styles.gameImage}
            />

            <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Tiny Fishing</Text>
            <Text style={styles.gameSubtitle}>
                Build your digital fish empire
            </Text>
            </View>
        </View>
        <View style={styles.gameCard}>
            <Image
            source={gameIcons['9']}
            style={styles.gameImage}
            />

            <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Drive Mad</Text>
            <Text style={styles.gameSubtitle}>
                Drive a wacky car across even wackier courses
            </Text>
            </View>
        </View>
    </View>

      {/* RIGHT SIDE LEADERBOARD */}
      {isDesktop && (
        <View style={styles.wallContainer}>
          <View style={styles.leaderboardWrapper}>
            <FlatList
              data={LEADERBOARD}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <RankItem item={item} index={index} />
              )}
              scrollEnabled
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    flexDirection: 'row',
  },

  mainContent: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    zIndex: 10,
  },

  desktopContent: {
    alignItems: 'flex-start',
    maxWidth: '50%',
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 20,
  },

  userCard: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.35)',
  },

  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
  },

  gameCard: {
    width: '100%',
    maxWidth: 420,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#0b1224',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.35)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    opacity: 0.4,
  },

    gameImage: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    marginRight: 14,
  },

  gameInfo: {
    flex: 1,
  },

  gameTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
  },

  gameSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },

  userText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },

  // RIGHT PANEL
  wallContainer: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    backgroundColor: '#050b1a',
  },

  leaderboardWrapper: {
    flex: 1,
    paddingVertical: 12,
  },

  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },

  topRank: {
    borderColor: 'rgba(59, 130, 246, 0.5)',
    backgroundColor: '#0b1224',
  },

  rankIndex: {
    width: 50,
    color: '#60a5fa',
    fontWeight: '800',
    fontSize: 16,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: '#1e293b',
    marginRight: 10,
  },

  nameBlock: {
    flex: 1,
  },

  name: {
    color: '#ffffff',
    fontWeight: '700',
  },

  score: {
    color: '#cbd5e1',
    fontSize: 12,
  },
});