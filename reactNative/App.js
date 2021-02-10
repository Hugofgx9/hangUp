import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Vibration from './src/components/Vibration';
import Accelerometre from './src/components/Accelerometre';


export default function App() {
  return (
    <View style={styles.container}>
      <Vibration/>
      <Accelerometre/>
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
