import React, { createContext, useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform } from 'react-native';

type BazingaContextType = {
  bazinga: boolean;
  toggleBazinga: () => void;
};

const BazingaContext = createContext<BazingaContextType>({
  bazinga: false,
  toggleBazinga: () => {},
});

export const useBazinga = () => useContext(BazingaContext);

export function BazingaProvider({ children }: { children: React.ReactNode }) {
  const [bazinga, setBazinga] = useState(false);

  const toggleBazinga = () => setBazinga(b => !b);

  return (
    <BazingaContext.Provider value={{ bazinga, toggleBazinga }}>
      {/* SafeAreaView ensures content doesn't overlap with 
          notches, status bars, or home indicators.
      */}
      <SafeAreaView style={styles.container}>
        {/* Optional: Forces the status bar text to be white/light */}
        <StatusBar barStyle="light-content" />
        {children}
      </SafeAreaView>
    </BazingaContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // On Android, SafeAreaView sometimes needs a manual padding 
    // if the StatusBar is translucent.
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#000', // Keeps the "safe area" background consistent
  },
});