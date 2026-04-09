import { router, Stack, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, View, Text, Pressable, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Head from 'expo-router/head';
import { BazingaProvider } from '@/assets/context/BazingaContext';

import { app, analytics } from '@/assets/data/firebaseConfig.js';
import { getRemoteConfig, fetchAndActivate, getValue, RemoteConfig } from 'firebase/remote-config';
import { logEvent } from 'firebase/analytics';

// Firebase Auth & Realtime Database Imports
import { 
  getAuth, 
  onAuthStateChanged, 
  AuthError,
  User 
} from 'firebase/auth';
import { getDatabase, ref, set, get, child } from 'firebase/database';

const auth = getAuth(app);
const rtdb = getDatabase(app);
const CLOUD_SYNC_INTERVAL_MS = 60 * 60 * 1000;

export default function RootLayout() {
  const [maintenance, setMaintenance] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
  const [ready, setReady] = useState(false);
  const [branch, setBranch] = useState<'stable' | 'canary' | 'devpatch'>();
  const [showPicker, setShowPicker] = useState(false);
  const [remoteConfig, setRemoteConfig] = useState<RemoteConfig | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const pathname = usePathname();

  const showErrorToast = (message: string) => {
    setToastMessage(message);
  };

  const getFirebaseErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === 'object') {
      const firebaseError = error as Partial<AuthError> & { message?: string };
      if (firebaseError.code && firebaseError.message) {
        return `${firebaseError.code}: ${firebaseError.message}`;
      }
      if (firebaseError.message) {
        return firebaseError.message;
      }
    }
    return fallback;
  };

  // --- DATA CLEANING HELPER (Fixes "undefined" Firebase error) ---
  const cleanData = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(cleanData);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, cleanData(v)])
      );
    }
    return obj === undefined ? null : obj;
  };

  // --- INDEXEDDB EXPORT HELPER ---
  const exportIDB = async (dbName: string) => {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(dbName);
        request.onsuccess = async () => {
          const db = request.result;
          const dbData: Record<string, any> = {};
          const storeNames = Array.from(db.objectStoreNames);

          for (const storeName of storeNames) {
            try {
              const tx = db.transaction(storeName, "readonly");
              const store = tx.objectStore(storeName);
              const allRecords = await new Promise((res) => {
                const req = store.getAll();
                req.onsuccess = () => res(req.result);
                req.onerror = () => res([]);
              });
              dbData[storeName.replace(/[.#$[\]]/g, '_')] = allRecords;
            } catch (e) {
              console.warn(`Export failed for store: ${storeName}`, e);
            }
          }
          db.close();
          resolve(dbData);
        };
        request.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  };

  // --- CLOUD SYNC LOGIC (DEVPATCH ONLY) ---
  const syncToCloud = async (u: User) => {
    if (Platform.OS !== 'web' || branch !== 'devpatch') return;

    try {
      const lsData: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key);
          const safeKey = key.replace(/[.#$[\]]/g, '_');
          try { lsData[safeKey] = JSON.parse(val || ""); } catch { lsData[safeKey] = val; }
        }
      }

      const idbData: Record<string, any> = {};
      if (indexedDB.databases) {
        const dbs = await indexedDB.databases();
        for (const dbInfo of dbs) {
          if (dbInfo.name && !dbInfo.name.includes('UnityCache')) {
            const exported = await exportIDB(dbInfo.name);
            idbData[dbInfo.name.replace(/[.#$[\]]/g, '_')] = exported;
          }
        }
      }

      await set(ref(rtdb, `users/${u.uid}/backup`), {
        localStorage: cleanData(lsData),
        indexedDB: cleanData(idbData),
        metadata: {
          lastSync: new Date().toISOString(),
          username: u.displayName,
          email: u.email,
          branch: branch
        }
      });
      console.log("Devpatch: Cloud sync successful.");
    } catch (e) {
      console.error("Sync Failed", e);
    }
  };

  const pullFromCloud = async (u: User) => {
    if (Platform.OS !== 'web' || branch !== 'devpatch') return;

    try {
      const dbRef = ref(rtdb);
      const snapshot = await get(child(dbRef, `users/${u.uid}/backup`));
      
      if (snapshot.exists()) {
        const cloudData = snapshot.val();

        if (cloudData.localStorage) {
          Object.keys(cloudData.localStorage).forEach((key) => {
            const val = cloudData.localStorage[key];
            const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
            localStorage.setItem(key.replace(/_/g, '.'), stringVal);
          });
        }

        if (cloudData.indexedDB) {
          for (const dbNameEncoded in cloudData.indexedDB) {
            const dbName = dbNameEncoded.replace(/_/g, '.');
            const stores = cloudData.indexedDB[dbNameEncoded];
            const openRequest = indexedDB.open(dbName);
            
            openRequest.onupgradeneeded = (event: any) => {
              const db = event.target.result;
              for (const storeName in stores) {
                if (!db.objectStoreNames.contains(storeName)) {
                  db.createObjectStore(storeName, { autoIncrement: true });
                }
              }
            };

            openRequest.onsuccess = (event: any) => {
              const db = event.target.result;
              for (const storeName in stores) {
                try {
                  const tx = db.transaction(storeName, "readwrite");
                  const store = tx.objectStore(storeName);
                  const records = stores[storeName];
                  if (Array.isArray(records)) {
                    records.forEach(record => {
                        try { if (record !== null) store.put(record); } catch(e) {}
                    });
                  }
                } catch (e) {
                  console.warn(`Restore skipped for store ${storeName}`);
                }
              }
              db.close();
            };
          }
        }
        console.log("Devpatch: Data restored.");
        if (pathname.includes('play')) router.replace(pathname as any);
      }
    } catch (e) {
      console.error("Restore Failed", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && branch === 'devpatch') {
        await pullFromCloud(currentUser);
        await syncToCloud(currentUser);
      }
    });
    return () => unsubscribe();
  }, [branch]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !user || branch !== 'devpatch') return;
    const intervalId = setInterval(() => {
      void syncToCloud(user);
    }, CLOUD_SYNC_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [user, branch]);

  useEffect(() => {
    if (!toastMessage) return;
    const timeoutId = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timeoutId);
  }, [toastMessage]);

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
      const savedBranch = (localStorage.getItem('sparkly_branch') as 'stable' | 'canary' | 'devpatch');
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
    if (maintenance && pathname !== '/maintenance') { router.replace('/maintenance'); return; }
    const isSystemPage = ['/maintenance', '/killswitch'].includes(pathname);
    if (!isSystemPage && Platform.OS === 'web') {
      const hasCorrectPrefix = pathname.startsWith(`/${branch || 'stable'}`);
      if (!hasCorrectPrefix) {
        const cleanPath = pathname.replace(/^\/(stable|canary|devpatch)/, '');
        router.replace(`/${branch || 'stable'}${cleanPath === '/' ? '' : cleanPath}` as any);
      }
    }
  }, [maintenance, isShutdown, ready, pathname, branch]);

  const toggleBranch = (newBranch: 'stable' | 'canary' | 'devpatch') => {
    if (newBranch === branch) return;
    localStorage.setItem('sparkly_branch', newBranch);
    setBranch(newBranch);
    setShowPicker(false);
  };

  if (!ready) return <Stack screenOptions={{ headerShown: false }}/>;
  const displayVersion = remoteConfig ? getValue(remoteConfig, 'lastVer').asString() : '1.0.0';

  const getBranchColor = () => {
    switch (branch) {
      case 'canary': return '#ffcc00';
      case 'devpatch': return '#a855f7'; 
      default: return '#4CAF50';
    }
  };

  return (
    <BazingaProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Head>
        <title>
          {branch === 'canary' ? '🧪 Sparkly Canary' : 
           branch === 'devpatch' ? '🛠️ Sparkly Devpatch' : 'Sparkly Games'}
        </title>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5114925324085905" crossOrigin="anonymous" />
        <script src="https://sparkly.statuspage.io/embed/script.js" defer />
        <meta name="description" content="With Sparkly, get ready to game into the future like never before!" />
        <meta property="og:title" content={branch === 'canary' ? 'Sparkly Canary' : 'Sparkly Games'} />
        <meta property="og:url" content="https://sparkly.creepers.sbs/" />
        <meta property="og:image" content="/og-preview.png" />
        <meta name="theme-color" content={getBranchColor()} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {toastMessage && (
        <View style={styles.toastContainer} pointerEvents="none">
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

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
              <Pressable onPress={() => toggleBranch('devpatch')} style={[styles.menuItem, branch === 'devpatch' && styles.activeItem]}>
                <Text style={[styles.menuText, { color: '#a855f7' }]}>🛠️ Devpatch Build {branch === 'devpatch' && '✓'}</Text>
              </Pressable>
            </View>
          )}
          <View style={styles.trigger}>
            <Pressable onPress={() => setShowPicker(!showPicker)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.statusDot, { backgroundColor: getBranchColor() }]} />
              <Text style={styles.triggerText}>{branch?.toUpperCase() || 'STABLE'}</Text>
            </Pressable>
            <ControlIcon name="logo-octocat" onPress={() => Linking.openURL('https://github.com/sparkly-games')} style={{ marginLeft: 10, padding: 4 }} />
            <ControlIcon name="game-controller-outline" onPress={() => Linking.openURL('https://github.com/sparkly-games/game-requests/issues/new?template=game-request.md')} style={{ marginLeft: 8, padding: 4 }} />
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
  toastContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 100000,
    maxWidth: 260,
    backgroundColor: 'rgba(127, 29, 29, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.55)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  toastText: { color: '#fecaca', fontSize: 12, fontWeight: '700' },
});