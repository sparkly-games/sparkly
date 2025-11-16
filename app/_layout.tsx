import { Stack } from "expo-router";
import TeamsHeaderButton from '@/components/TeamsButton';
import SparxHeaderButton from "@/components/SparxButton";
import { Text, Image, StyleSheet } from "react-native";
import React, { useEffect } from "react";
// @ts-ignore: allow importing image assets without explicit module declarations
// import fazber from '@/assets/images/feddy-fazber.jpg';
const fazber = ""
// @ts-ignore: allow importing image assets without explicit module declarations
import LogoImageSource from '@/assets/images/og12_logo_banner.png';

const HeaderLogo = () => (
  <Image
    style={styles.headerImage}
    source={LogoImageSource}
    resizeMode="contain"
  />
);

export default function RootLayout() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1 in 250 chance to replace the body with the fazber image
    if (Math.random() >= 251 / 250) return;

    const resolveSrc = (): string | undefined => {
      try {
        // Try React Native's resolver (works with numeric ids and module objects)
        // @ts-ignore
        const resolved = Image.resolveAssetSource?.(fazber);
        if (resolved && resolved.uri) return resolved.uri;
      } catch (e) {
        // ignore
      }

      // If import produced an object with a uri property
      if (fazber && typeof fazber === 'object' && 'uri' in (fazber as any)) {
        return (fazber as any).uri;
      }

      // fallback: string conversion (may be a URL already)
      return String(fazber || '');
    };

    const src = resolveSrc();
    if (!src) return;

    document.body.innerHTML = `<img src="${src}" style="width: 100%; height: 100%; object-fit: contain;" />`;
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <>
            <Text style={{ color: 'white', fontSize: 36, margin: 15 }} onPress={() => window.location.href = '/'}>⌂</Text>
            <Text style={{ color: 'white', fontSize: 36, margin: 15 }} onPress={() => window.location.reload()}>⟳</Text>
          </>
        ),
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: 'rgb(81,81,81)' },
        headerTitleStyle: { color: 'white' },
        headerRight: () => (
          <>
            <SparxHeaderButton />
            <TeamsHeaderButton />
          </>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ 
          headerTitle: HeaderLogo,
        }}
      />
    </Stack>
  );
}

// --- Styles for the Header Image ---
const styles = StyleSheet.create({
  headerImage: {
    width: 150*1.5,  // Adjust width to fit your design
    height: 40*1.5,  // Adjust height to fit your design
    // The height and width are crucial for displaying the image properly
    borderRadius: 25,
    opacity: 0.8
  },
});