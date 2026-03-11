import { router, Stack, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Head from 'expo-router/head';
import { BazingaProvider } from '@/assets/context/BazingaContext';

import { app, analytics } from '@/assets/data/firebaseConfig.js';
import { logEvent } from 'firebase/analytics';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';

export default function RootLayout() {
  const [maintenance, setMaintenance] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkConfig = async () => {
      // Only run hostname/web logic on Web
      if (Platform.OS !== 'web' || typeof window === 'undefined') {
        setReady(true);
        return;
      }

      try {
        const rc = getRemoteConfig(app);
        rc.settings = { minimumFetchIntervalMillis: 60000, fetchTimeoutMillis: 10000 };
        rc.defaultConfig = { 
          isUnderMaintainance: false,
          deprecatedURI: '[]' 
        };

        await fetchAndActivate(rc);

        // 1. Check General Maintenance
        const maintFlag = getValue(rc, 'isUnderMaintainance').asBoolean();
        setMaintenance(maintFlag);

        // 2. Check Hostname for Shutdown (deprecatedURI check)
        const currentHost = window.location.hostname;
        const deprecatedDataRaw = getValue(rc, 'deprecatedURI').asString();
        
        try {
          const deprecatedList = JSON.parse(deprecatedDataRaw);
          // Checks if the current browser hostname is in your JSON array
          const shouldShutdown = Array.isArray(deprecatedList) 
            ? deprecatedList.includes(currentHost)
            : false;
            
          setIsShutdown(shouldShutdown);
        } catch (e) {
          console.error("Failed to parse deprecatedURI JSON from Firebase", e);
        }

        if (maintFlag) logEvent(analytics, 'maintenance_redirect');
        
      } catch (err) {
        console.warn('Remote config fetch failed', err);
      } finally {
        setReady(true);
      }
    };

    checkConfig();
  }, []);

  useEffect(() => {
    if (!ready) return;

    // Shutdown (Killswitch) takes priority
    if (isShutdown) {
      if (pathname !== '/killswitch') {
        router.replace('/killswitch');
      }
      return; 
    }

    // Maintenance secondary priority
    if (maintenance) {
      if (pathname !== '/maintenance') {
        router.replace('/maintenance');
      }
    } else if (pathname === '/maintenance' || pathname === '/killswitch') {
      router.replace('/');
    }
  }, [maintenance, isShutdown, ready, pathname]);

  if (!ready) return null;

  return (
    <BazingaProvider>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5114925324085905"
          crossOrigin="anonymous"
        />
        <script src="https://sparkly.statuspage.io/embed/script.js" defer />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sparkly Games" />
        <meta property="og:description" content="With Sparkly, get ready to game into the future like never before!" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Sparkly Games" />
        <meta property="twitter:description" content="With Sparkly, get ready to game into the future like never before!" />
        <meta property="twitter:image" content="/og-preview.png" />
        <meta property="og:url" content="https://sparkly.creepers.sbs/" />
        <meta property="og:site_name" content="Sparkly Games" />
        <meta name="description" content="With Sparkly, get ready to game into the future like never before!" />
        <meta property="og:image" content="/og-preview.png" />
        <link rel="canonical" href="https://sparkly.creepers.sbs/" />
        <meta name="google-site-verification" content="WtKSIKOGxz7QiYaXQyBKvFKAkOfFQ_NjfYGeZrEt6mI" />
      </Head>

      <Stack
        screenOptions={({ route }) => ({
          headerShown:
            route.name === 'vids' ||
            route.name === 'vids.backup' ||
            route.name.startsWith('vidplayer/'),
        })}
      />
    </BazingaProvider>
  );
}