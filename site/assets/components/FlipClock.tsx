import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlipDigit } from './FlipDigit';
// If you have canvas-confetti installed, import it:
// import confetti from 'canvas-confetti'; 

interface FlipClockProps {
  targetDate: string;
}

export const FlipClock: React.FC<FlipClockProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const expiryTime = target + (60 * 60 * 1000); // 1 hour after target

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      // 1. Hide after 1 hour
      if (now >= expiryTime) {
        setIsVisible(false);
        clearInterval(interval);
        return;
      }

      // 2. The Celebration Logic (Hits 0)
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        
        // Trigger confetti once when someone sees the clock at 0
        if (!hasCelebrated) {
          triggerConfetti();
          setHasCelebrated(true);
        }
        return;
      }

      // 3. Normal countdown
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, hasCelebrated]);

  const triggerConfetti = () => {
    // If you are using the canvas-confetti library:
    // confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#60a5fa', '#fbbf24', '#ffffff'] });

    // OR: Quick Web-only hack if you don't want to install a library tonight:
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      script.onload = () => {
        // @ts-ignore
        window.confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.7 },
          colors: ['#60a5fa', '#fbbf24', '#ffffff'] // Match your site colors
        });
      };
      document.head.appendChild(script);
    }
  };

  if (!isVisible) return null;

  const renderDigits = (num: number) =>
    num.toString().padStart(2, '0').split('').map((n, i) => <FlipDigit key={i} value={parseInt(n)} />);

  const renderGroup = (num: number, label: string) => (
    <View style={styles.group}>
      <View style={styles.digitsRow}>{renderDigits(num)}</View>
      <Text style={[styles.label, hasCelebrated && { color: '#fbbf24' }]}>
        {hasCelebrated ? label.toUpperCase() : label}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderGroup(timeLeft.days, 'Days')}
      <Text style={[styles.separator, hasCelebrated && { color: '#fbbf24' }]}>:</Text>
      {renderGroup(timeLeft.hours, 'Hours')}
      <Text style={[styles.separator, hasCelebrated && { color: '#fbbf24' }]}>:</Text>
      {renderGroup(timeLeft.minutes, 'Minutes')}
      <Text style={[styles.separator, hasCelebrated && { color: '#fbbf24' }]}>:</Text>
      {renderGroup(timeLeft.seconds, 'Seconds')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  group: { alignItems: 'center', marginHorizontal: 4 },
  digitsRow: { flexDirection: 'row' },
  label: { color: '#bfdbfe', fontWeight: '700', marginTop: 4, fontSize: 14, textAlign: 'center' },
  separator: { color: '#60a5fa', fontSize: 50, fontWeight: '900', marginHorizontal: 4, lineHeight: 60 },
});