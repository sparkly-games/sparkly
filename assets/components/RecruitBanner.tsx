import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

type Props = {
  onPress?: () => void;
  onClose?: () => void;
  text: string;
};

export default function RecruitBanner({ onPress, onClose, text }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.badge}>🎨 OPEN</Text>

        <Text style={styles.text}>
          {text}
        </Text>

        <Pressable onPress={onPress} style={styles.button}>
          <Text style={styles.buttonText} onPress={onPress}>Apply</Text>
        </Pressable>
      </View>

      {onClose && (
        <Pressable onPress={onClose} style={styles.close}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 216, 77, 0.92)",
    borderRadius: 25,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    backgroundColor: "rgba(0,0,0,0.15)",
    color: "#1a1a1a",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  text: {
    flex: 1,
    color: "#1a1a1a",
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFD84D",
    fontSize: 12,
    fontWeight: "700",
  },
  close: {
    position: "absolute",
    right: 8,
    top: 6,
    padding: 6,
  },
  closeText: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
  },
});