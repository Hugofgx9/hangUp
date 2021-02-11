import React from "react";
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
} from "react-native";

const Separator = () => <View style={styles.separator} />;

var counter = 0;
var date1;

function timer() {
  counter++;
  if (counter == 1) {
    date1 = Date.now();
  }
  else {
    var gap = Date.now()-date1
    console.log(gap)
    counter = 0
  }
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Button title="Press me" onPress={timer} />
      </View>
      <Separator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 16,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
