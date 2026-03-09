import { router, Stack } from 'expo-router';
import { Text, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Head from 'expo-router/head';
import { BazingaProvider } from '@/assets/context/BazingaContext';

import { app, analytics } from '@/assets/data/firebaseConfig.js';
import { logEvent } from 'firebase/analytics';
import {
  getRemoteConfig,
  fetchAndActivate,
  getBoolean,
} from 'firebase/remote-config';

// @ts-ignore
import LogoImageSource from '@/assets/images/sparkly_logo_banner.png';

const HeaderLogo = () => (
  <Image
    style={styles.headerImage}
    source={LogoImageSource}
    resizeMode="contain"
    onPress={() => router.push('/')}
  />
);

export default function RootLayout() {

  useEffect(() => {
    const initRemoteConfig = async () => {
      try {
        const remoteConfig = getRemoteConfig(app);

        remoteConfig.settings = {
          minimumFetchIntervalMillis: 60000, // 1 minute for quick toggles
        };

        remoteConfig.defaultConfig = {
          maintenance_mode: false,
        };

        await fetchAndActivate(remoteConfig);

        const maintenance = getBoolean(remoteConfig, 'maintenance_mode');

        if (maintenance) {
          logEvent(analytics, 'maintenance_redirect');
          router.replace('/maintenance');
        }

      } catch (err) {
        console.warn('Remote config failed', err);
      }
    };

    initRemoteConfig();
  }, []);

  return (
    <BazingaProvider>
      <Head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5114925324085905" crossorigin="anonymous"></script>
        <script src="https://sparkly.statuspage.io/embed/script.js" defer></script>

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sparkly Games" />
        <meta property="og:description" content="With Sparkly, get ready to game into the future like never before!" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Sparkly Games" />
        <meta property="twitter:description" content="With Sparkly, get ready to game into the future like never before!" />
        <meta property="twitter:image" content="/og-preview.png" />

        <meta property="og:url" content="https://sparkly.creepers.sbs/" />
        <meta property="og:site_name" content="Sparkly Games" />
        <meta property="description" content="With Sparkly, get ready to game into the future like never before!" />
        <meta property="og:image" content="/og-preview.png" />

        <link rel="canonical" href="https://sparkly.creepers.sbs/" />

        <meta name="google-site-verification" content="WtKSIKOGxz7QiYaXQyBKvFKAkOfFQ_NjfYGeZrEt6mI" />
      </Head>

      <Stack
        screenOptions={({ route }) => ({
          headerShown:
            route.name === 'vids' ||
            route.name === 'vids.backup' ||
            route.name.substring(0, 10) === 'vidplayer/'
        })}
      />
    </BazingaProvider>
  );
}

const styles = StyleSheet.create({
  headerImage: { width: 225, height: 60, borderRadius: 25, opacity: 0.8 },
  iconTxt: { color: 'white', fontSize: 36, margin: 15 },
});