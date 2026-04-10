'use client';

import { Stack } from 'expo-router';
import { BazingaProvider } from '@/assets/context/BazingaContext';

export default function RootLayout() {
  return (
    <BazingaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </BazingaProvider>
  );
}
