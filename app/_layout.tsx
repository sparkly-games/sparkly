'use client';

import { router, Stack, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, View, Text, Pressable, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Head from 'expo-router/head';
import { BazingaProvider } from '@/assets/context/BazingaContext';

import { app, analytics } from '@/assets/data/firebaseConfig.js';
import { getRemoteConfig, fetchAndActivate, getValue, RemoteConfig } from 'firebase/remote-config';
import { logEvent } from 'firebase/analytics';
import ENV_VARS from '@/assets/data/env';

import {
  getAuth,
  onAuthStateChanged,
  AuthError,
  User
} from 'firebase/auth';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { admins } from '@/assets/data/admins';
import { Crown } from 'lucide-react-native';
import RecruitBanner from '@/assets/components/RecruitBanner';

const auth = getAuth(app);
const rtdb = getDatabase(app);
const CLOUD_SYNC_INTERVAL_MS = 60 * 60 * 1000;

/* ------------------ BRANCH CONFIG ------------------ */

type BranchKey = 'stable' | 'canary' | 'devpatch' | 'admin';

const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

const BRANCHES: Record<BranchKey, {
  label: string;
  disabled?: boolean;
  icon: string;
  color: string;
  description: string;
  proOnly?: boolean;
}> = {
  stable: {
    label: 'Stable',
    icon: '📦',
    color: '#4CAF50',
    description: `
      Recommended for most users.

      * Recieves features ~3-4 days after Devpatch.
      * Most features work.
    `,
  },
  canary: {
    label: 'Canary',
    icon: '🧪',
    color: '#ffcc00',
    description: `
      Early features and experiments.

      * Recieves features ~2-3 days after Devpatch.
      * Features are tested and may not work.
    `,
  },
  devpatch: {
    label: 'Devpatch',
    icon: '🛠️',
//  disabled: true,
    color: '#a855f7',
    description: `
      Hotfixes and dev testing.

      * Recieves updates most often.
      * Function is not guaranteed.
    `,
//  proOnly: true,
  },
  admin: {
    label: 'Admin Preview',
    icon: '🚧',
    disabled: true,
    color: '#f75555',
    description: `
      Used exclusively for upcoming features.

      * Must be logged in as admin.
      * Not currently available.
    `,
  },
};

export default function RootLayout() {
  const [maintenance, setMaintenance] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
  const [ready, setReady] = useState(false);
  const [branch, setBranch] = useState<BranchKey>('stable');
  const [showPicker, setShowPicker] = useState(false);
  const [remoteConfig, setRemoteConfig] = useState<RemoteConfig | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    color: string;
  } | null>(null);

  const pathname = usePathname();

  const showToast = (message: string, color: string) => {
    setToast({ message, color });
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

  const cleanData = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(cleanData);
    if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, cleanData(v)])
      );
    }
    return obj === undefined ? null : obj;
  };

  /* ------------------ CLOUD SYNC ------------------ */

  const syncToCloud = async (u: User) => {
    if (Platform.OS !== 'web') return;

    try {
      const lsData: Record<string, any> = {};

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith('sparkly:')) {
          const val = localStorage.getItem(key);
          const safeKey = key.replace(/[.#$[\]]/g, '_');

          try {
            lsData[safeKey] = JSON.parse(val || "");
          } catch {
            lsData[safeKey] = val;
          }
        }
      }

      await set(ref(rtdb, `users/${u.uid}/backup`), {
        localStorage: cleanData(lsData),
        metadata: {
          lastSync: new Date().toISOString(),
          username: u.displayName,
          email: u.email,
          branch: branch
        }
      });

    } catch (e) {
      console.error("Sync Failed", e);
    }
  };

  const pullFromCloud = async (u: User) => {
    if (Platform.OS !== 'web') return;

    try {
      const snapshot = await get(child(ref(rtdb), `users/${u.uid}/backup`));

      if (snapshot.exists()) {
        const cloudData = snapshot.val();

        if (cloudData.localStorage) {
          Object.keys(cloudData.localStorage).forEach((key) => {
            const val = cloudData.localStorage[key];
            const stringVal = typeof val === 'object'
              ? JSON.stringify(val)
              : String(val);

            localStorage.setItem(
              key.replace(/_/g, '.'),
              stringVal
            );
          });
        }

        if (pathname.includes('play')) router.replace(pathname as any);
      }
    } catch (e) {
      console.error("Restore Failed", e);
    }
  };

  /* ------------------ AUTH ------------------ */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // await pullFromCloud(currentUser);
        await syncToCloud(currentUser);
      }
    });
    return () => unsubscribe();
  }, [branch]);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (Platform.OS !== 'web' || !user) return;

    const intervalId = setInterval(() => {
      void syncToCloud(user);
    }, CLOUD_SYNC_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [user, branch]);

  /* ------------------ TOAST TIMER ------------------ */

  useEffect(() => {
    if (!toast) return;
    const timeoutId = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timeoutId);
  }, [toast]);

  /* ------------------ INIT ------------------ */

  useEffect(() => {
    const initApp = async () => {
      if (Platform.OS !== 'web') {
        setReady(true);
        return;
      }

      const savedBranch = localStorage.getItem('sparkly_branch') as BranchKey;
      if (savedBranch && BRANCHES[savedBranch]) {
        setBranch(savedBranch);
      }

      try {
        const rc = getRemoteConfig(app);
        rc.settings = { minimumFetchIntervalMillis: 60000, fetchTimeoutMillis: 10000 };
        rc.defaultConfig = { isUnderMaintainance: false };

        await fetchAndActivate(rc);
        setRemoteConfig(rc);

        const isMaint = window.location.hostname !== "localhost"
          ? getValue(rc, 'isUnderMaintainance').asBoolean()
          : false;

        setMaintenance(isMaint);

        if (isMaint && analytics) logEvent(analytics, 'maintenance_redirect');

      } catch (err) {
        console.warn('Config failed', err);
      } finally {
        setReady(true);
      }
    };

    initApp();
  }, []);

  /* ------------------ ROUTING ------------------ */

  useEffect(() => {
    if (!ready) return;

    if (maintenance && pathname !== `/${branch}/system/maintenance`) {
      router.replace(`/${branch}/system/maintenance`);
      return;
    }

    const isSystemPage = pathname.startsWith('/acc') || pathname.startsWith('/labs');

    if (!isSystemPage && Platform.OS === 'web') {
      const hasCorrectPrefix = pathname.startsWith(`/${branch}`);

      if (!hasCorrectPrefix) {
        const cleanPath = pathname.replace(
          new RegExp(`^/(${Object.keys(BRANCHES).join('|')})`),
          ''
        );

        router.replace(`/${branch}${cleanPath === '/' ? '' : cleanPath}` as any);
      }
    }
  }, [maintenance, ready, pathname, branch]);

  const toggleBranch = (newBranch: BranchKey) => {
    if (newBranch === branch) return;
    localStorage.setItem('sparkly_branch', newBranch);
    setBranch(newBranch);
    setShowPicker(false);
  };
  
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    try {
      const existing = localStorage.getItem('sparkly:filters');

      const parsed = existing ? JSON.parse(existing) : {};

      localStorage.setItem(
        'sparkly:filters',
        JSON.stringify({
          ...parsed,
          activeGenre: 'all',
        })
      );
    } catch {
      localStorage.setItem(
        'sparkly:filters',
        JSON.stringify({
          activeGenre: 'all',
        })
      );
    }
  }, []);

  const getBranchColor = () => BRANCHES[branch].color;

  if (!ready) return <Stack screenOptions={{ headerShown: false }} />;

  return (
    <BazingaProvider>
      <Stack screenOptions={{ headerShown: false }} />

      <Head>
        <title>{`${BRANCHES[branch].icon} Sparkly Games`}</title>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5114925324085905" crossOrigin="anonymous" />
        {ENV_VARS.USE_STATUSPAGE === 'true' && 
          <script src={ENV_VARS.STATUSPAGE_URL} defer />
        }
        <script async
          src="https://js.stripe.com/v3/buy-button.js">
        </script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var s = document.createElement('script');
              s.dataset.zone = '11187810';
              s.src = 'https://nap5k.com/tag.min.js';
              document.head.appendChild(s);
            `
          }}
        />
        <meta name="description" content="With Sparkly, get ready to game into the future like never before!" />
        <meta name="theme-color" content={getBranchColor()} />
      </Head>
      { /*
        <View style={styles.banner}>
          <RecruitBanner text={"Looking for UI designers!"} onPress={() => {router.push("/acc/apply/jobs")}} />
        </View>
      */ }
      {Platform.OS === 'web' && !isShutdown && !maintenance && !isInIframe && (
        <View style={styles.floatingContainer}>

          {/* TOAST ABOVE PICKER */}
          {toast && (
            <View
              style={[
                styles.toastContainer,
                {
                  borderColor: toast.color,
                  backgroundColor: toast.color + '22',
                },
              ]}
            >
              <Text style={[styles.toastText, { color: toast.color }]}>
                {toast.message}
              </Text>
            </View>
          )}

          {showPicker && (
            <View style={styles.menu}>
              {Object.entries(BRANCHES).map(([key, data]) => {
                if ( uid && admins.includes(uid) ){
                  data.disabled = false
                } else if ( process.env.NODE_ENV == "development" ) {
                  data.disabled = false
                }
                const isActive = branch === key;

                return (
                  <View key={key} style={[styles.menuItem, isActive && styles.activeItem, data.disabled && { opacity: 0.7 }]}>
                    <Pressable
                      onPress={() => toggleBranch(key as BranchKey)}
                      style={{ flex: 1 }}
                      disabled={data.disabled}
                    >
                      <Text style={[styles.menuText, { color: data.color }]}>
                        {isActive ? '●' : '○'} {data.icon} {data.label}
                      </Text>
                    </Pressable>
                    {data.proOnly && (
                      <Crown size={16} color="orange" fill={'yellow'} style={{ paddingRight: 10 }} />
                    )}
                    <ControlIcon
                      name="information-circle-outline"
                      size={16}
                      disabled={data.disabled}
                      onPress={() => showToast(data.description, data.color)}
                    />
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.trigger}>
            <Pressable onPress={() => setShowPicker(!showPicker)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.statusDot, { backgroundColor: getBranchColor() }]} />
              <Text style={styles.triggerText}>{branch.toUpperCase()}</Text>
            </Pressable>

            <ControlIcon name="logo-octocat" onPress={() => Linking.openURL('https://github.com/sparkly-games')} style={{ marginLeft: 10 }} />
          </View>

        </View>
      )}
    </BazingaProvider>
  );
}

const ControlIcon = ({ name, onPress, color = "white", size = 18, style = {}, disabled = false }: any) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.iconBtn, style]} disabled={disabled}>
    <Ionicons name={name} size={size} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  floatingContainer: { position: 'absolute', bottom: 20, right: 20, zIndex: 99999, alignItems: 'flex-end' },

  trigger: {
    backgroundColor: '#111',
    flexDirection: 'row',
    marginBottom: 32,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333'
  },

  banner: {
    position: 'sticky',
    top: '100%'
  },

  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  triggerText: { color: '#eee', fontSize: 11, fontWeight: 'bold' },

  menu: {
    backgroundColor: '#111',
    borderRadius: 8,
    marginBottom: 8,
    width: 220,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden'
  },

  menuItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  activeItem: { backgroundColor: '#1a1a1a' },
  menuText: { fontSize: 13 },

  iconBtn: { borderRadius: 6 },

  toastContainer: {
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 400,
  },

  toastText: {
    fontSize: 12,
    fontWeight: '600',
  },
});