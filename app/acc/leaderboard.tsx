import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '@/assets/data/firebaseConfig';
import { gameIcons as icons } from '@/assets/data/GameIcons';
import { get, ref } from 'firebase/database';

const gameIcons = icons;

const formatTimeLeft = (ms: number) => {
  if (ms <= 0) return 'Ended';

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;

  return `${seconds}s`;
};

function getISOWeekYear(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
}

function getISOWeekNumber(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function formatISOWeek(date: Date) {
  const year = getISOWeekYear(date);
  const week = getISOWeekNumber(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

function weekToNumber(isoWeek: string) {
  const [year, week] = isoWeek.split('-W');
  return parseInt(year) * 100 + parseInt(week);
}

type GameCardProps = {
  title: string;
  icon: string;
  expiry?: string;
  active?: boolean;
  clickHandler?: () => void;
};

const LeaderboardGameCard = ({
  title,
  icon,
  expiry,
  active,
  clickHandler,
}: GameCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.gameCard, active && { opacity: 1 }]}
      onPress={clickHandler}
    >
      <Image
        source={gameIcons[icon] ?? { uri: 'https://via.placeholder.com/72' }}
        style={styles.gameImage}
      />

      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{title}</Text>
        <Text style={styles.gameSubtitle}>{expiry}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function LeaderboardScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const user = auth.currentUser;

  const [thisWeek, setThisWeek] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);

  const currentWeek = formatISOWeek(new Date());
  const currentNum = weekToNumber(currentWeek);

  const LEADERBOARD = useMemo(
    () => [
      { id: '1', name: 'Riley', score: 2400, avatar: user?.photoURL },
      { id: '2', name: 'Henry', score: 2100 },
      { id: '3', name: 'Louis', score: 1900 },
    ],
    []
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        const snapshot = await get(ref(db, 'leaderboards'));
        if (!snapshot.exists()) return;

        const data = snapshot.val();

        const currentWeek = formatISOWeek(new Date());
        const currentNum = weekToNumber(currentWeek);

        const thisWeekArr: any[] = [];
        const pastArr: any[] = [];
        const futureArr: any[] = [];

        Object.entries(data).forEach(([weekKey, weekValue]: any) => {
          const weekNum = weekToNumber(weekKey);

          Object.entries(weekValue).forEach(([id, item]: any) => {
            const fullItem = {
              id,
              week: weekKey,
              ...item,
            };

            if (weekNum === currentNum) {
              thisWeekArr.push(fullItem);
            } else if (weekNum < currentNum) {
              pastArr.push(fullItem);
            } else {
              futureArr.push(fullItem);
            }
          });
        });

        setThisWeek(thisWeekArr);
        setPast(pastArr);
        setFuture(futureArr);
      } catch (err) {
        console.error(err);
      }
    };

    fetch();
  }, []);

  const renderCard = (item: any, i: number, status: 'current' | 'past' | 'future') => {
    const expiry =
      status === 'current'
        ? item.expiry
          ? `Ends in ${formatTimeLeft(new Date(item.expiry).getTime() - Date.now())}`
          : 'Lifetime'
        : status === 'past'
          ? 'Ended'
          : item.expiry
            ? new Date(item.expiry).toLocaleString('en-GB')
            : 'Upcoming';

    return (
      <LeaderboardGameCard
        key={i}
        title={item.gameName}
        icon={item.gameIcon}
        expiry={expiry}
        active={status === 'current'}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.mainContent}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>The top players in the top games.</Text>

        <Text style={styles.sectionTitle}>This Week</Text>
        {thisWeek.map((item, i) => renderCard(item, i, 'current'))}

        <Text style={styles.sectionTitle}>Past</Text>
        {past.map((item, i) => renderCard(item, i, 'past'))}

        <Text style={styles.sectionTitle}>Future</Text>
        {future.map((item, i) => renderCard(item, i, 'future'))}
      </ScrollView>

      {isDesktop && (
        <View style={styles.wallContainer}>
          <View style={styles.leaderboardWrapper}>
            <FlatList
              data={LEADERBOARD}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <View style={styles.rankRow}>
                  <Text style={styles.rankIndex}>#{index + 1}</Text>
                  <Image
                    source={
                      item.avatar
                        ? { uri: item.avatar }
                        : { uri: `https://ui-avatars.com/api/?name=${item.name}` }
                    }
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.score}>{item.score} pts</Text>
                  </View>
                </View>
              )}
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
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  gameCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#0b1224',
    marginBottom: 10,
    opacity: 0.4,
  },
  gameImage: {
    width: 72,
    height: 72,
    borderRadius: 14,
    marginRight: 14,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  gameSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
  },
  wallContainer: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
    backgroundColor: '#050b1a',
  },
  leaderboardWrapper: {
    flex: 1,
    padding: 12,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginVertical: 6,
    backgroundColor: '#0f172a',
    borderRadius: 12,
  },
  rankIndex: {
    width: 40,
    color: '#60a5fa',
    fontWeight: '800',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    marginRight: 10,
  },
  name: {
    color: '#fff',
    fontWeight: '700',
  },
  score: {
    color: '#cbd5e1',
    fontSize: 12,
  },
});