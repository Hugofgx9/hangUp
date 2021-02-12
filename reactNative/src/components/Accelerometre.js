import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, Button, View } from 'react-native';
import { Gyroscope } from 'expo-sensors';

export default function App() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  var date1 = 0
  var gap

  const [subscription, setSubscription] = useState(null);

  const [string, setString] = useState('')

  function timer() {
    date1 = Date.now()
    console.log(gap)
  }

  function _subscribe() {
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setData(gyroscopeData);
        if (Math.abs(gyroscopeData.x + gyroscopeData.y + gyroscopeData.z) > 1) {
          gap = date1-Date.now()
          console.log(date1)
          setString(gap)
          }
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
    <View style={styles.container}>
      <Text style={styles.text}>
        x: {round(x)} y: {round(y)} z: {round(z)}
      </Text>
      <Button title="Press me" onPress={timer} />
      <Text style={styles.text}>
        time: {string}
      </Text>
    </View>
  );
}

function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 100;
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  coucou: {
      color: '#1c1c1c'
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
Aa
