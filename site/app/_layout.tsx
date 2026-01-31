import { router, Stack } from 'expo-router';
import TeamsHeaderButton from '@/assets/components/TeamsButton';
import SparxHeaderButton from '@/assets/components/SparxButton';
import { Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import Head from 'expo-router/head';
// @ts-ignore
import LogoImageSource from '@/assets/images/sparkly_logo_banner.png';
import { BazingaProvider } from '@/assets/context/BazingaContext';

const HeaderLogo = () => (
  <Image
    style={styles.headerImage}
    source={LogoImageSource}
    resizeMode="contain"
    onPress={() => router.push('/')}
  />
);

export default function RootLayout() {
  return (
    <BazingaProvider>
      <Head>
      </Head>
      <Stack
        screenOptions={({ route }) => ({
          headerShown: route.name == 'vids' || route.name.substring(0, 10) == 'vidplayer/' ? true : false,
        })}
      />
    </BazingaProvider>
  );
}

const styles = StyleSheet.create({
  headerImage: { width: 225, height: 60, borderRadius: 25, opacity: 0.8 },
  iconTxt: { color: 'white', fontSize: 36, margin: 15 },
});
