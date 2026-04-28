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

export default function SparklyProScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const handleSubscribe = () => {
    router.push('/subscribe'); // change if needed
  };

  const openGithub = () => {
    Linking.openURL('https://github.com/sparkly-games');
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      const modal = document.querySelector('#modal');
      if (modal) modal.remove();
    }
  }, []);

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      <GameWall />

      <View style={[styles.centerWrap, isDesktop && styles.mainContent]}>
        <View style={styles.noticeBox}>

          <Image
            source={require('@/assets/images/sparkly-pro-header.png')}
            style={styles.imageHeader}
          />

          <View style={styles.spacer} />

          <GlitchText style={styles.title}>
            Level up with Sparkly Pro
          </GlitchText>

          <Text style={styles.features}>
            {"\n"}• Get early access to new features 🛠️
            {"\n\n"}• Receive free monthly AI Lab credits ⚡
            {"\n\n"}• Support ongoing development ❤️
          </Text>

          <View style={styles.spacer} />

          <View style={styles.pricingBox}>
            <Text style={styles.priceMain}>£4.99/month</Text>

            <Text style={styles.priceHighlight}>
              £49.99/year <Text style={styles.saveText}>(save over 15%)</Text> ⭐
            </Text>

            <Text style={styles.priceSub}>
              £499.99 lifetime (one-time payment)
            </Text>
          </View>

          <View style={styles.spacer} />

          <TouchableOpacity style={styles.ctaBtn} onPress={handleSubscribe}>
            <Text style={styles.ctaText}>Get Sparkly Pro</Text>
          </TouchableOpacity>

          <View style={styles.iconRow}>
            <ControlIcon name="logo-github" onPress={openGithub} />
          </View>

        </View>
      </View>
    </View>
  );
}

const ControlIcon = ({ name, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.iconBtn} activeOpacity={0.7}>
    <Ionicons name={name} size={22} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  imageHeader: {
    width: '100%',
    height: undefined,
    aspectRatio: 3,
    resizeMode: 'contain',
  },

  centerWrap: {
    width: '90%',
    maxWidth: 600,
  },

  desktopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  mainContent: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
  },

  noticeBox: {
    padding: 32,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },

  title: {
    color: '#60a5fa',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },

  features: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
  },

  pricingBox: {
    alignItems: 'center',
  },

  priceMain: {
    color: '#e2e8f0',
    fontSize: 18,
    marginBottom: 6,
  },

  priceHighlight: {
    color: '#60a5fa',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },

  saveText: {
    color: '#94a3b8',
    fontSize: 14,
  },

  priceSub: {
    color: '#64748b',
    fontSize: 13,
  },

  ctaBtn: {
    marginTop: 10,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },

  ctaText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },

  iconRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 18,
  },

  iconBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  spacer: {
    height: 20,
  },
});