import { View, StyleSheet, Text } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

export default function GameScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "IMPORTANT" }} />
        <Text style={styles.errorText}>GAMES HAVE MOVED. PRESS HOME BUTTON AND PRESS THE GAME AGAIN.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  errorText: { fontSize: 70, color: 'red', textAlign: 'center', padding: '20%', fontWeight: 'bold' },
});