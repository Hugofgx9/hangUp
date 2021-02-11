import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gyroscope, Accelerometer } from 'expo-sensors';


export default function App() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [subscription, setSubscription] = useState(null);
  const [bgColor, setColor] = useState('white');

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener(accelerometerData => {
        if (accelerometerData.x + accelerometerData.y + accelerometerData.z > 0.7) {
          setColor('green');
        } else {
          setColor('white');
        }
        setData(accelerometerData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

 

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const { x, y, z } = data;
  return (
    <View style={[styles.container, {backgroundColor: bgColor}]}>
      {/*<Text style={styles.text}>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>*/}
      <Text style={styles.text}>
        y: {round(y)}
      </Text>
      <View style={styles.buttonContainer}></View>
    </View>
  );
}

function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 1;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  text: {
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
});
