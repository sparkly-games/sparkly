import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlipDigit } from './FlipDigit';

interface FlipClockProps {
  targetDate: string;
}

export const FlipClock: React.FC<FlipClockProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const renderDigits = (num: number) =>
    num
      .toString()
      .padStart(2, '0')
      .split('')
      .map((n, i) => <FlipDigit key={i} value={parseInt(n)} />);

  const renderGroup = (num: number, label: string) => (
    <View style={styles.group}>
      <View style={styles.digitsRow}>{renderDigits(num)}</View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderGroup(timeLeft.days, 'Days')}
      <Text style={styles.separator}>:</Text>
      {renderGroup(timeLeft.hours, 'Hours')}
      <Text style={styles.separator}>:</Text>
      {renderGroup(timeLeft.minutes, 'Minutes')}
      <Text style={styles.separator}>:</Text>
      {renderGroup(timeLeft.seconds, 'Seconds')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  group: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  digitsRow: {
    flexDirection: 'row', // <- This makes the digits sit in a row horizontally
  },
  label: {
    color: '#bfdbfe',
    fontWeight: '700',
    marginTop: 4,
    fontSize: 14,
    textAlign: 'center',
  },
  separator: {
    color: '#60a5fa',
    fontSize: 50,
    fontWeight: '900',
    marginHorizontal: 4,
    lineHeight: 60,
  },
});
