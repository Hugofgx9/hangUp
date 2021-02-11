import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Button, View, Vibration } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { io } from 'socket.io-client';

export default class accelero extends React.Component {

	state = {
		string: '',
	};

	onPress() {
		this.socket.emit ('player-ready');
	}

	startGame() {
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
		this.socketConnect();
	}

	socketConnect() {
		this.socket = io('ws://192.168.0.12:3000');
		this.bindSocket();
	}

	bindSocket() {  
		const socket = this.socket;

		socket.on('connected', () => console.log('connected on socket'));

		socket.on('game-ready', () => console.log('game-ready'));

		socket.on('game-start', delay => {
			console.log('delay', delay);
			setTimeout( () => {
				Vibration.vibrate();
				this.date1 = Date.now();
				console.log('vibre');

			}, delay);
		})

		socket.on('result', result => {
			console.log(`winner: ${result.winner}, rank:  ${result.rank}`)
		});
	}

	_subscribeToAccelerometer() {

		let value;
		let prevValue;

		Accelerometer.isAvailableAsync()
		.then(
			result => {
				Accelerometer.addListener( a => {
					let value = Math.abs(a.x + a.y + a.z);

					if (prevValue && this.gameIN == true && Math.abs(value - prevValue) > 0.2) {
						let gap = Date.now() - this.date1; 
						this.setState({
							string: gap,
						});
						this.socket.emit('result', gap);
						this.gameIN = false;
					}
					prevValue = value;
				});
			}, error => console.log('Accelerometer dont work')
		)
	};

	_unsubscribeFromAccelerometer() {
		Accelerometer.removeAllListeners();
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
	text: {
		textAlign: 'center',
		fontSize: 50,
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
