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
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sparkly Games" />
        <meta property="og:description" content="With Sparkly, get ready to game into the future like never before!" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property='twitter:title' content='Sparkly Games' />
        <meta property='twitter:description' content='With Sparkly, get ready to game into the future like never before!' />
        <meta property='twitter:image' content={require('@/assets/images/open_graph_share_preview.png')} />
        <meta property="og:url" content="https://sparkly.creepers.sbs/" />
        <meta property='og:site_name' content='Sparkly Games' />
        <meta property='description' content='With Sparkly, get ready to game into the future like never before!' />
        <meta property="og:image" content={require('@/assets/images/open_graph_share_preview.png')} />
        <link rel="canonical" href="https://sparkly.creepers.sbs/" />
        <meta name="google-site-verification" content="WtKSIKOGxz7QiYaXQyBKvFKAkOfFQ_NjfYGeZrEt6mI" />
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
