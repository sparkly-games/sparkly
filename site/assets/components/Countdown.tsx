import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CountdownProps {
  targetDate: string; // ISO format: "YYYY-MM-DDTHH:mm:ss"
  caption?: string;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate, caption }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        🎉 {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s until {caption || "the event"}! 🎉
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    margin: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(59,130,246,0.2)',
    alignItems: 'center',
  },
  text: {
    color: '#bfdbfe',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
});
