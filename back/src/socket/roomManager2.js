import Emitter from '../utils/emitter.js';

export default class Room {
	constructor(opts = { io }) {
		this.io = opts.io;;
		this.roomID = 'first-room';
		this.players = [];
		this.results = [];
		this.emitter = new Emitter();
	}

	/**
	 * Sends random delay [1 : 5]secs to players
	 */
	gameStart() {
		console.log('game start');
		let delay = 1 + Math.random() * 4 * 1000;
		this.io.to(this.roomID).emit('game-start', delay);
	}

	/**
	 * binds all socket event for the player 
	 * 
	 * @param {player}
	 * @param {player.id} str
	 * @param {player.socket} socket obj
	 * @param {player.isReady} boolean
	 */
	bindPlayerEvents(player) {
		player.socket.on('player-ready', () => this.onPlayerReady(player) );
		player.socket.on('result', result => this.onPlayerResult(player, result) );
	}


	/**
	 * Sets players to isReady & starts game if every players are ready
	 * 
	 * @param  {player} 
	 */	
	onPlayerReady(player) {
		player.isReady = true;
		console.log(`player ${player.id} is ready`);

		//start game if there is more than one player and everybody is ready
		if (this.players.length >= 2) {
			// true if allplayer are ready
			const arePlayersReady = this.players.every(player => player.isReady === true);
			if (arePlayersReady) {
				console.log('all players are ready');
				this.gameStart();
			} else {
				const nbReady = this.players.filter(player => player.isReady === true).length;
				console.log(`${nbReady} player ready`);
			}
		}
	}


	/**
	 * onPlayerResult
	 * 
	 * @param  {object} player
	 * @param  {nb} result reaction time from the player
	 */
	onPlayerResult(player, result) {
		console.log(`player ${player.id} did ${result}`);
		this.results.push({delay: result, id: player.id});

		if (this.results.length == this.players.length) {
			console.log('get the results of all players');
			this.sortResults(this.results);
		} else {
			console.log('get the result of only 1 player');
		}
	}


	/**
	 * Sorts the array by delay
	 * 
	 * @param {array} array of obj
	 * @param {array[i]} obj
	 * @param {obj.delay}
	 */
	sortResults(array) {
		array.sort( (a, b) => a.delay - b.delay)
		console.log('sorted result', array);

		this.sendResult(array);
	}


	/**
	 * Sends they score to players
	 * and enable new game
	 * 
	 * @param {array} 
	 * @param {array[i]} obj 
	 * @param {obj.delay} player delay
	 * @param {obj.id} player id
	 */
	sendResult(array) {
		array.forEach( (result, index) => {
			let player = this.players[this.players.findIndex(player => player.id == result.id)];
			let winner = index == 0 ? true : false;
			player.socket.emit('result', {rank: index + 1, winner} );
			console.log(`player ${player.id} ${winner ? 'winner' :'loser'}`)
		})
		setTimeout( () => {
			this.init();
		}, 2000);
	}

	/**
	 * inits players and result so then can do another game
	 */
	init() {
		this.players.forEach( player => {
			player.isReady = false;
			//player.socket.removeAllListeners();
		});
		this.results = [];
		this.io.to(this.roomID).emit('can-play-again', );
		console.log('ready to play new game');
	}

	/**
	 * Add a user to se current room
	 * and start the game if there is 2 users or more
	 * 
	 * @param {sokcet}
	 */
	addUser(socket) {
		socket.join(this.roomID);
		this.players.push({ id: socket.id, socket, isReady: false });

		let playerIndex = this.players.findIndex(player => player.id == socket.id)
		this.bindPlayerEvents(this.players[playerIndex]);

		console.log(this.players.length, 'players in the room');
	}

	/**
	 * Remove user from room when disconnect
	 * 
	 * @param  {socket}
	 */
	userDisconnect(socket) {
		this.players.splice( this.players.findIndex(player => player.id === socket.id),1);
		console.log(this.players.length, 'players in the room');
	}
}
