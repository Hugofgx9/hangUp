import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, Button, View, Vibration } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { io } from 'socket.io-client';
import Logo from '../../assets/image1.png';

export default class accelero extends React.Component {

	state = {
		string: '',
		console: 'init',
		gameState: 0,
	};

	onPress() {
		this.socket.emit ('player-ready');
	}

	startGame() {
		this.date1 = Date.now();
		this.setState({ gameState: 1});
	}

	componentWillUnmount() {
		this._unsubscribeFromAccelerometer();
	}

	componentDidMount() {
		this.date1 = 0;
		this.socketConnect();
		this._subscribeToAccelerometer();
	}

	socketConnect() {
		//this.socket = io('ws://192.168.0.12:3000');
		this.socket = io('ws://still-journey-49166.herokuapp.com');
		this.bindSocket();
	}

	bindSocket() {  
		const socket = this.socket;

		socket.on('connected', () => this.setConsole('connected on socket'));
		
		socket.on('game-start', delay => {
			setTimeout( () => {
				Vibration.vibrate();
				this.startGame();
				this.setConsole('vibre');

			}, delay);
		})

		socket.on('result', result => {
			this.setConsole(result.winner ? 'tu as gagné' : 'tu as perdu');
		});

		socket.on('can-play-again', () => {
			this.setConsole('can-play-again');
			this.setState({ gameState: 0});
		}); 
	}

	setConsole(str) {
		this.setState({
			console: str,
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
					if (prevValue && this.state.gameState == 1 && Math.abs(value - prevValue) > 0.2) {
						let gap = Date.now() - this.date1; 
						this.setState({string: gap, gameState: 2});
						this.socket.emit('result', gap);
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
	      <View style={styles.container2}>
	      	<Text> {this.state.console} </Text>
		      <Image source={Logo} alt="Logo" style={styles.image} />
		      <View style={styles.titre}>
		      	<Text style={styles.titre}>Hang-Up</Text>
		      </View>
		      <View style={styles.bouton}>

		      { this.state.gameState == 0 && 
		      	<Button 
			      	style={styles.bouton} 
			      	onPress={ () => this.onPress() }
			      	title="Lancer une partie" 
		      	/>
		      }
		      </View>
	      </View>
	    </View>
		);
	}
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
    //fontFamily: 'Montserrat',
    fontWeight: '700',
    width: 120,
    height: 50,
    fontSize: 24,
    textAlign: 'center',
    justifyContent: 'center',
  }
});
