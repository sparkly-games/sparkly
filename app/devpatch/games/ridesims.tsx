import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import ENV_VARS from "@/assets/data/env";

const getCloudinaryImage = (name: string) =>
  `https://res.cloudinary.com/${ENV_VARS.CLOUDINARY_CLOUD_NAME}/image/upload/v1780848399/${name}`;

const startGame = (game: string) => {
  console.log(`Starting game: ${game}`);
  window.location.href = `/ridesims/${game}/flash.html`;
};

const gameCard = (game: string, difficulty: string, display?: string) => {
  return (
    <TouchableOpacity style={styles.gamecard} onPress={() => startGame(game)}>
        <Image
          source={{ uri: getCloudinaryImage(game) }}
          style={styles.image}
          resizeMode="cover"
        />
      <Text style={styles.gametext}>{display || game.charAt(0).toUpperCase() + game.slice(1)} | {difficulty}</Text>
    </TouchableOpacity>
  )
};

const games = [
  { name: "rush", difficulty: "Moderate" },
  { name: "vampire", difficulty: "Easy" },
  { name: "stealth", difficulty: "Easy" },
  { name: "cosmic-rewind", difficulty: "Hard", display: "Cosmic Rewind" },
  { name: "hyperia", difficulty: "Easy" },
  { name: "galactica", difficulty: "Easy" },
  { name: "the-swarm", difficulty: "Easy", display: "The Swarm" },
  { name: "the-smiler", difficulty: "Easy", display: "The Smiler" },
  { name: "rita", difficulty: "Easy" },
  { name: "oblivion", difficulty: "Moderate" },
  { name: "nemesis", difficulty: "Easy" },
  { name: "thirteen", difficulty: "Easy", display: "Th13teen" },
  { name: "spinball-whizzer", difficulty: "Moderate", display: "Spinball Whizzer" },
  { name: "saw", difficulty: "Moderate", display: "SAW: The Ride" },
  { name: "hex", difficulty: "Easy", display: "Hex: The Legend of the Towers" },
  { name: "icon", difficulty: "Moderate" },
  { name: "wickerman", difficulty: "Easy" },
];

const sortedGames = games.sort((a, b) => a.name.localeCompare(b.name));

const RideSimsPage = () => {
  return (
    <>
        <View style={styles.container}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#ff3c3c", marginBottom: 20, backgroundColor: "#751616", padding: 10, borderRadius: 10 }}>This page has not been tested or fully implemented.</Text>
            <Image source={{ uri: getCloudinaryImage("ridesims") }} style={[styles.image, { width: '100vh', height: '30vh' }]} resizeMode="cover" />
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
              <View style={styles.games}>
                {sortedGames.map((game) => gameCard(game.name, game.difficulty, game.display))}
              </View>
            </ScrollView>
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#422c2c",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  gamecard: {
    backgroundColor: "hsl(0, 0%, 20%)",
    padding: 20,
    margin: 10,
    borderRadius: 12,
    width: 240,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gametext: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginTop: 10,
  },
  games: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  }
});

export default RideSimsPage;