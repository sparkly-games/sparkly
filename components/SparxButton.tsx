// components/TeamsHeaderButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet, Linking, Alert, Image } from 'react-native';

const SparxHeaderButton = () => {
  const handlePressScience = async () => {
    const url = 'https://sparx-learning.com/';
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Failed to open URL:', error);
      Alert.alert('Error', 'Could not open Sparx.');
    }
  };

  return (
    <>
    <TouchableOpacity onPress={handlePressScience} style={styles.button}>
       <Image source={{uri: 'https://sparx-learning.com/favicons/apple-touch-icon.png'}} style={{ width: 30, height: 30 }} />
    </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 15,
  },
});

export default SparxHeaderButton;