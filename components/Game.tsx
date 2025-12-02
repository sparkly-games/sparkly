import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType, View } from 'react-native';
import { gameIcons } from '@/assets/images/GameIcons';
import { decorIcons } from '@/assets/images/DecorIcons';

type DecorEvent = 'halloween' | 'christmas' | 'easter' | 'stpatricks';

interface GameProps {
  name: string;
  imageSource: keyof typeof gameIcons;
  onPress: () => void;
  decor?: DecorEvent;
  newUntil?: number; // YYMMDDHH format
  pcOnly?: boolean,
  fixed?: boolean ,
  bugged?: boolean ,
}

export function Game({ name, imageSource, onPress, decor, newUntil, pcOnly, fixed, bugged }: GameProps) {
  const icon: ImageSourcePropType = gameIcons[imageSource];
  let decorIcon: ImageSourcePropType | null = null;

  // Pick random decor if specified
  if (decor && decorIcons[decor]) {
    const options = decorIcons[decor];
    decorIcon = options[Math.floor(Math.random() * options.length)];
  }

  if (!icon) {
    console.error(`Error: No image source found for game name "${name}"`);
    return null;
  }

  // Determine if badge should show
  const showBadge = (() => {
    if (!newUntil) return false;

    const year = 2000 + Math.floor(newUntil / 1000000);
    const month = Math.floor((newUntil % 1000000) / 10000) - 1; // JS months 0-11
    const day = Math.floor((newUntil % 10000) / 100);
    const hour = newUntil % 100;

    const expireTime = new Date(year, month, day, hour).getTime();
    return Date.now() < expireTime;
  })();
  const showPcBadge = pcOnly;

  return (
    <View style={{ position: 'relative', margin: 5 }}>
      {decorIcon && <Image source={decorIcon} style={styles.decor} />}
      <TouchableOpacity onPress={onPress} style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={icon} style={styles.image} />
          {showBadge && <Text style={styles.newBadge}>New!</Text>}
          {showPcBadge && <Text style={styles.pcBadge}>💻 PC</Text>}
        </View>
        {fixed && <Text style={styles.pcBadge}>Fixed</Text>}
        {bugged && <Text style={[styles.pcBadge, { marginBottom: 40 }]}>&#x1f41c; Bugged</Text>}
        <Text style={styles.text}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgb(56,59,58)',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
    padding: 15,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  decor: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    zIndex: 300,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  newBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(135,189,229,1)',
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    textTransform: 'uppercase',
    zIndex: 10,
  },
  pcBadge: {
    position: 'absolute',
    bottom: 5,
    left: 10,
    backgroundColor: 'rgba(135,189,229,1)',
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    textTransform: 'uppercase',
    zIndex: 10,
  },
});
