import { router, Stack, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, View, Text, Pressable, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Head from 'expo-router/head';
import { BazingaProvider } from '@/assets/context/BazingaContext';

import { app, analytics } from '@/assets/data/firebaseConfig.js';
import { getRemoteConfig, fetchAndActivate, getValue, RemoteConfig } from 'firebase/remote-config';
import { logEvent } from 'firebase/analytics';

export default function RootLayout() {
  const [maintenance, setMaintenance] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
  const [ready, setReady] = useState(false);
  const [branch, setBranch] = useState<'stable' | 'canary'>();
  const [showPicker, setShowPicker] = useState(false);
  const [remoteConfig, setRemoteConfig] = useState<RemoteConfig | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS === 'web') {
      (function(c: any, l: Document, a: string, r: string, i: string) {
        c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
        const t = l.createElement(r) as HTMLScriptElement;
        t.async = true; t.src = "https://www.clarity.ms/tag/" + i;
        const y = l.getElementsByTagName(r)[0];
        y.parentNode?.insertBefore(t, y);
      })(window, document, "clarity", "script", "w27gct3xid");
    }
  }, []);
  
  useEffect(() => {
    const initApp = async () => {
      if (Platform.OS !== 'web' || typeof window === 'undefined') { setReady(true); return; }
      const savedBranch = (localStorage.getItem('sparkly_branch') as 'stable' | 'canary');
      setBranch(savedBranch || getValue(getRemoteConfig(app), 'startBranch').asString());
      try {
        const rc = getRemoteConfig(app);
        rc.settings = { minimumFetchIntervalMillis: 60000, fetchTimeoutMillis: 10000 };
        rc.defaultConfig = { isUnderMaintainance: false, deprecatedURI: '[]', lastVer: '1.0.0' };
        await fetchAndActivate(rc);
        setRemoteConfig(rc);
        const isMaint = window.location.hostname !== "localhost" ? getValue(rc, 'isUnderMaintainance').asBoolean() : false;
        setMaintenance(isMaint);
        const deprecatedList = JSON.parse(getValue(rc, 'deprecatedURI').asString());
        if (Array.isArray(deprecatedList) && deprecatedList.includes(window.location.hostname)) setIsShutdown(true);
        if (isMaint) logEvent(analytics, 'maintenance_redirect');
      } catch (err) { console.warn('Config failed', err); } finally { setReady(true); }
    };
    initApp();
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (isShutdown && pathname !== '/killswitch') { router.replace('/killswitch'); return; }
    if (maintenance && pathname !== '/maintenance') { router.replace('/maintenance'); return; }
    const isSystemPage = ['/maintenance', '/killswitch'].includes(pathname);
    if (!isSystemPage && Platform.OS === 'web') {
      const hasCorrectPrefix = pathname.startsWith(`/${branch}`);
      if (!hasCorrectPrefix) {
        const cleanPath = pathname.replace(/^\/(stable|canary)/, '');
        router.replace(`/${branch}${cleanPath === '/' ? '' : cleanPath}` as any);
      }
    }
  }, [maintenance, isShutdown, ready, pathname, branch]);

  const toggleBranch = (newBranch: 'stable' | 'canary') => {
    if (newBranch === branch) return;
    localStorage.setItem('sparkly_branch', newBranch);
    setBranch(newBranch);
    setShowPicker(false);
  };

  if (!ready) return null;
  const displayVersion = remoteConfig ? getValue(remoteConfig, 'lastVer').asString() : '1.0.0';

  return (
    <BazingaProvider>
      <Head>
        <title>{branch === 'canary' ? '🧪 Sparkly Canary' : 'Sparkly Games'}</title>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5114925324085905" crossOrigin="anonymous" />
        <script src="https://sparkly.statuspage.io/embed/script.js" defer />
        <meta name="description" content="With Sparkly, get ready to game into the future like never before!" />
        <meta property="og:title" content={branch === 'canary' ? 'Sparkly Canary' : 'Sparkly Games'} />
        <meta property="og:url" content="https://sparkly.creepers.sbs/" />
        <meta property="og:image" content="/og-preview.png" />
        <meta name="theme-color" content={branch === 'canary' ? '#ffcc00' : '#60a5fa'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Stack screenOptions={({ route }) => ({ headerShown: route.name === 'vids' || route.name === 'vids.backup' || route.name.startsWith('vidplayer/') })} />

      {Platform.OS === 'web' && !isShutdown && !maintenance && (
        <View style={styles.floatingContainer}>
          {showPicker && (
            <View style={styles.menu}>
              <Pressable onPress={() => toggleBranch('stable')} style={[styles.menuItem, branch === 'stable' && styles.activeItem]}>
                <Text style={styles.menuText}>📦 v{displayVersion} Stable {branch === 'stable' && '✓'}</Text>
              </Pressable>
              <Pressable onPress={() => toggleBranch('canary')} style={[styles.menuItem, branch === 'canary' && styles.activeItem]}>
                <Text style={[styles.menuText, { color: '#ffcc00' }]}>🧪 Canary Build {branch === 'canary' && '✓'}</Text>
              </Pressable>
            </View>
          )}
          <View style={styles.trigger}>
            <Pressable onPress={() => setShowPicker(!showPicker)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.statusDot, { backgroundColor: branch === 'canary' ? '#ffcc00' : '#4CAF50' }]} />
              <Text style={styles.triggerText}>{branch === 'canary' ? 'CANARY' : 'STABLE'}</Text>
            </Pressable>
            <ControlIcon name="logo-octocat" onPress={() => Linking.openURL('https://github.com/sparkly-games')} style={{ marginLeft: 10, padding: 4 }} />
            <ControlIcon name="game-controller-outline" onPress={() => Linking.openURL('https://github.com/sparkly-games/sparkly/issues/new?template=game-request.md')} style={{ marginLeft: 8, padding: 4 }} />
          </View>
        </View>
      )}
    </BazingaProvider>
  );
}

const ControlIcon = ({ name, onPress, color = "white", size = 18, style = {} }: any) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.iconBtn, style]}>
    <Ionicons name={name} size={size} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  floatingContainer: { position: 'absolute', bottom: 20, right: 20, zIndex: 99999, alignItems: 'flex-end' },
  trigger: { backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#333' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  triggerText: { color: '#eee', fontSize: 11, fontWeight: 'bold' },
  menu: { backgroundColor: '#111', borderRadius: 8, marginBottom: 8, width: 200, borderWidth: 1, borderColor: '#333', overflow: 'hidden' },
  menuItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#222' },
  activeItem: { backgroundColor: '#1a1a1a' },
  menuText: { color: '#ccc', fontSize: 13 },
  iconBtn: { borderRadius: 6 },
});