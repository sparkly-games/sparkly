import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import ENV_VARS from "@/assets/data/env";

const getCloudinaryImage = (name: string) =>
  `https://res.cloudinary.com/${ENV_VARS.CLOUDINARY_CLOUD_NAME}/image/upload/v1780848399/${name}`;

const startGame = (game: string) => {
  console.log(`Starting game: ${game}`);
  window.location.href = `/ridesims/${game}/flash.html`;
};

const RideSimsPage = () => {
  return (
    <>
        <View style={styles.container}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#ff3c3c", marginBottom: 20, backgroundColor: "#751616", padding: 10, borderRadius: 10 }}>This page has not been tested or fully implemented.</Text>
            <Image source={{ uri: getCloudinaryImage("ridesims") }} style={[styles.image, { width: '100vh', height: '30vh' }]} resizeMode="cover" />
            <View style={styles.games}>
                <TouchableOpacity style={styles.gamecard} onPress={() => startGame('rush')}>
                    <Image
                        source={{ uri: getCloudinaryImage("rush") }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <Text style={styles.gametext}>Rush [ Moderate ]</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gamecard} onPress={() => startGame('vampire')}>
                    <Image
                        source={{ uri: getCloudinaryImage("vampire") }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <Text style={styles.gametext}>Vampire [ Easy ]</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gamecard} onPress={() => startGame('cosmic-rewind')}>
                    <Image
                        source={{ uri: getCloudinaryImage("cosmic-rewind") }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <Text style={styles.gametext}>Cosmic Rewind [ Hard ]</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gamecard} onPress={() => startGame('stealth')}>
                    <Image
                        source={{ uri: getCloudinaryImage("stealth") }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <Text style={styles.gametext}>Stealth [ Easy ]</Text>
                </TouchableOpacity>
            </View>
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