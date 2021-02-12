import { StatusBar } from 'expo-status-bar';
import React, { cloneElement } from 'react';
import { StyleSheet, View, Image, Button, Text } from 'react-native';
import Accelerometer from './src/components/Accelerometer';
import Timer from './src/components/Timer';
import Logo from './assets/image1.png'

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.container2}>
      <Image source={Logo} alt="Logo" style={styles.image} />
      <View style={styles.titre}>
      <Text style={styles.titre}>Hang-Up</Text>
      </View>
      <View style={styles.bouton}>
      <Button style={styles.bouton} title="Lancer une partie" />
      </View>
      <Accelerometer/>
      <StatusBar style="auto" />
      </View>
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

  image: {
    width: 300,
    height: 300,
    marginTop: 30,
  },

  container2: {
    backgroundColor: '#FAF0EF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: 350,
    height: 640,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bouton: {
    
    backgroundColor: '#2D4475',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 30,
    width: 200,
    height: 40,
    textAlign: 'center',
    justifyContent: 'center',
  },

  titre: {
    fontFamily: 'Montserrat',
    fontWeight: '700',
    width: 120,
    height: 50,
    fontSize: 24,
    textAlign: 'center',
    justifyContent: 'center',
  }
});
