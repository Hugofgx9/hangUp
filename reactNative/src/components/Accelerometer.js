import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Button, View, Vibration } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default class accelero extends React.Component {

  state = {
    string: 'hello',
  };

  onPress() {
  	this.date1 = Date.now();
  }

  startGame() {
  	Vibration.vibrate();
  	this.date1 = Date.now();
  	this.gameIN = true;
  }

  componentWillUnmount() {
    this._unsubscribeFromAccelerometer();
  }

  componentDidMount() {
  	this.date1 = 0;
  	this.startGame();
  	this._subscribeToAccelerometer();
  }

  _subscribeToAccelerometer() {

  	let value;
  	let prevValue;
    this._accelerometerSubscription = Accelerometer.addListener( a => {

    	let value = Math.abs(a.x + a.y + a.z);

    	if (prevValue && this.gameIN == true && Math.abs(value - prevValue) > 0.2) {
    		let gap = Date.now() - this.date1; 
    		this.setState({
    			string: gap,
    		});
    		this.gameIN = false;
    	}
    	prevValue = value;
    });
  };

  _unsubscribeFromAccelerometer = () => {
    if (this._accelerometerSubscription != undefined) this._acceleroMeterSubscription.remove();
    //this._accelerometerSubscription = null;
  };

	render () {
		return (
			<View style={styles.container}>
				<View srtle={styles.container} >
					<Text style={styles.text}> 
						{}
					</Text>
					<Button title="Press me" onPress={ () => this.onPress() } />
					<Text style={styles.text}>
						time: {this.state.string}
				 </Text>
				</View>
			</View>
		);
	}

}

// function round(n) {
//   if (!n) {
//     return 0;
//   }
//   return Math.floor(n * 100) / 100;
// }




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
