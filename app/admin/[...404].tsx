import { router } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function NotFoundAdmin() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/admin/');
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return <View />;
}