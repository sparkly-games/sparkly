import { TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

export const ControlIcon = ({ name, onPress, color = "white", disabled = false }) => ( 
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={disabled} style={[styles.iconBtn, disabled && { opacity: 0.3 }]} >
        <Ionicons name={name} size={22} color={color} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    iconBtn: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
})