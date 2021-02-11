import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Vibration from './src/components/Vibration';
import Gyroscope from './src/components/Gyroscope';
import Timer from './src/components/Timer';

export default function App() {
  return (
    <View style={styles.container}>
      <Vibration/>
      <Gyroscope/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
