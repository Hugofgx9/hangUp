import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, Button, View, Vibration } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { io } from 'socket.io-client';
import Logo from '../../assets/image1.png';

export default class accelero extends React.Component {

	state = {
		console: 'init',
		gameState: 0,
	};

	/**
	 * Explain gameState
	 * gameState = 0 --> the user can press the btn and wait other player to be ready
	 * gameState = 1 --> the phone vibrate ad user can take his phone
	 * gameState = 2 --> the user took his phone and has his result
	 */

	componentWillUnmount() {
		this._unsubscribeFromAccelerometer();
	}

	componentDidMount() {
		this.date1 = 0;
		this.socketConnect();
		this._subscribeToAccelerometer();
	}

	//when press on btn
	onPressHandle() {
		this.socket.emit ('player-ready');
	}

	startVibration() {
		this.date1 = Date.now();
		this.setState({ gameState: 1});
		this.setConsole('vibre');
		Vibration.vibrate();
	}

	socketConnect() {
		// dev server
		//this.socket = io('ws://192.168.0.12:3000');
		// prod server
		this.socket = io('ws://still-journey-49166.herokuapp.com');
		this.bindSocket();
	}

	// listen socket events
	bindSocket() {  
		const socket = this.socket;

		// connected to server
		socket.on('connected', () => this.setConsole('connected on socket'));
		
		// game start
		socket.on('game-start', delay => {
			this.setConsole('GAME START');
			setTimeout( () => {
				this.startVibration();
			}, delay);
		})

		// winner or looser event
		socket.on('result', result => {
			this.setConsole(result.winner ? 'tu as gagné' : 'tu as perdu');
		});

		// if u want you can restart 
		socket.on('can-play-again', () => {
			this.setConsole('Press btn to play again');
			this.setState({ gameState: 0});
		}); 
	}

	//set console state, which is in the new viewport
	setConsole(str) {
		this.setState({
			console: str,
		});
	}

	//active accelerometer
	_subscribeToAccelerometer() {
		let value;
		let prevValue;

		//check if accelerometer of device is accessible
		Accelerometer.isAvailableAsync()
		.then(
			result => {
				//listen accelerometer, param{x ,y, z}
				Accelerometer.addListener( a => {

					//acceleration |value|
					let value = Math.abs(a.x + a.y + a.z);

					/**
					 * better multiples conditions syntax
					 *
					 * cond1: necessary to cond3
					 * cond2:	game start
					 * cond3: check if there is a gap between 
					 * the previous accelero value and the current
					 * because accelero meter as alway a value which depend 
					 * of the earth movement (in Bordeaux altitude 0m, accelero ~ 0.9)	
					 */
					const conditionsArray = [
						prevValue != undefined,
						this.state.gameState == 1,
						Math.abs(value - prevValue) > 0.2
					]

					// what a beautiful multiple conditions syntax 
					// instead of if ( prevValue && this.state.gameState == 1 && Math.abs(value - prevValue) > 0.2 )
					// which one is you favorite ? 
					// ES6 lover <3
					if (!conditionsArray.includes(false)) {
						let gap = Date.now() - this.date1; 
						this.setState({gameState: 2});
						this.socket.emit('result', gap);
					}

					prevValue = value;
				});
			}, error => console.log('Accelerometer dont work')
		)
	};

	//acceleroEvents
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
			      	onPress={ () => this.onPressHandle() }
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
