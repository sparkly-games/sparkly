import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
  Image,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { GlitchText } from '@/assets/components/GlitchText';
import { GameWall } from '@/assets/components/GameWall';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': {
        'buy-button-id': string;
        'publishable-key': string;
        children?: React.ReactNode;
      };
    }
  }
}

export default function SparklyProScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  useEffect(() => {
    if (Platform.OS === 'web') {
      const modal = document.querySelector('#modal');
      modal?.remove();
    }
  }, []);

  return (
    <View style={[styles.container, isDesktop && styles.desktop]}>
      <GameWall />

      <View style={styles.center}>
        <View style={styles.card}>

          <Image
            source={require('@/assets/images/sparkly-pro-header.png')}
            style={styles.headerImage}
          />

          <Text style={styles.badge}>✨ Sparkly Pro</Text>

          <GlitchText style={styles.title}>
            Unlock the full experience
          </GlitchText>

          <Text style={styles.subtitle}>
            Early access • Free AI credits • Premium perks
          </Text>

          <View style={styles.perks}>
            <Text style={styles.perk}>⚡ Early access to new features</Text>
            <Text style={styles.perk}>🧠 Monthly AI Lab credits</Text>
            <Text style={styles.perk}>❤️ Support development</Text>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.price}>
              £4.99
              <Text style={{ fontWeight: '400' }}>/mo</Text>
            </Text>
            <Text style={styles.save}>£49.99/year • save 15%</Text>
            <Text style={styles.lifetime}>£499.99 lifetime unlock</Text>
          </View>

          {Platform.OS === 'web' &&
            React.createElement('stripe-buy-button', {
              'buy-button-id': 'buy_btn_1TRbPbCuTZizttXV5LfT2hqN',
              'publishable-key': 'pk_test_51TRavGCuTZizttXVV8FXSbn9oEknEa8nFL0XCdYj9aGqmXYt184as0RRFkyKw6vfxLzFF2o39PcAmC8XSgLbFSkv00WxE4ApP6',
            })
          }

          <TouchableOpacity
            style={styles.secondary}
            onPress={() => Linking.openURL('https://github.com/sparkly-games')}
          >
            <Ionicons name="logo-github" size={18} color="#94a3b8" />
            <Text style={styles.secondaryText}>View on GitHub</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
    justifyContent: 'center',
    alignItems: 'center',
  },

  desktop: {
    paddingHorizontal: 40,
  },

  center: {
    width: '92%',
    maxWidth: 520,
  },

  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 28,
    padding: 26,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },

  headerImage: {
    width: '100%',
    aspectRatio: 3,
    resizeMode: 'contain',
    marginBottom: 8,
  },

  badge: {
    color: '#a78bfa',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },

  title: {
    color: '#e2e8f0',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },

  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 14,
  },

  perks: {
    width: '100%',
    marginTop: 10,
    marginBottom: 18,
    gap: 6,
  },

  perk: {
    color: '#cbd5f5',
    fontSize: 14,
    textAlign: 'center',
  },

  priceBox: {
    alignItems: 'center',
    marginBottom: 16,
  },

  price: {
    color: '#60a5fa',
    fontSize: 34,
    fontWeight: '900',
  },

  save: {
    color: '#34d399',
    fontSize: 13,
    marginTop: 2,
  },

  lifetime: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },

  cta: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },

  ctaText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },

  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },

  secondaryText: {
    color: '#94a3b8',
    fontSize: 13,
  },
});