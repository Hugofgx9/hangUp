import { StatusBar } from 'expo-status-bar';
import React, { cloneElement } from 'react';
import { StyleSheet, View, Image, Button, Text } from 'react-native';
import Accelerometer from './src/components/Accelerometer';
import Timer from './src/components/Timer';
import Logo from './assets/image1.png'

export default function App() {
  return (
    <View style={styles.container}>
      <Accelerometer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D4475', 
  },
});
