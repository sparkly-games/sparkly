import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Head from 'expo-router/head';
import { BazingaProvider } from '@/assets/context/BazingaContext';

import { app, analytics } from '@/assets/data/firebaseConfig.js';
import { logEvent } from 'firebase/analytics';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';

export default function RootLayout() {
  const [maintenance, setMaintenance] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkMaintenance = async () => {
      if (typeof window === 'undefined') return;

      try {
        const rc = getRemoteConfig(app);
        rc.settings = { minimumFetchIntervalMillis: 60000, fetchTimeoutMillis: 10000 };
        rc.defaultConfig = { isUnderMaintainance: false };
        await fetchAndActivate(rc);

        const isMaint = getValue(rc, 'isUnderMaintainance').asBoolean();
        console.log('Maintenance flag:', isMaint);
        setMaintenance(isMaint);

        if (isMaint) logEvent(analytics, 'maintenance_redirect');
      } catch (err) {
        console.warn('Remote config fetch failed', err);
      } finally {
        setReady(true);
      }
    };

    checkMaintenance();
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (maintenance && router.pathname !== '/maintenance') {
      router.replace('/maintenance');
    }
    if (!maintenance && router.pathname === '/maintenance') {
      router.replace('/');
    }
  }, [maintenance, ready, router.pathname]);

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
            route.name.substring(0, 10) === 'vidplayer/',
        })}
      />
    </BazingaProvider>
  );
}