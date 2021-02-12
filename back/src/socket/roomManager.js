export default class Room {
	constructor(opts = { io }) {
		this.io = opts.io;;
		this.roomID = 'first-room';
		this.players = [];
		this.gameIN = false;
	}

	/**
	 * init players so then can do another game
	 */
	init() {
		this.players.forEach( player => {
			player.isReady = false;
			//player.socket.removeAllListeners();
		});
		console.log('ready to play new game');
	}

	/**
	 * Add a user to se current room
	 * and start the game if there is 2 users or more
	 * @param {sokcet}
	 */
	addUser(socket) {
		socket.join(this.roomID);
		this.players.push({ id: socket.id, socket, isReady: false });

		console.log(this.players.length, 'players in the room');

		if (this.players.length >= 2 && this.gameIN == false) this.gameIsReady();
	}

	/**
	 * Start a game in this room, wait 'is-ready' 
	 * event from each player and then call begin method
	 */
	gameIsReady() {
		this.gameIN == true;
		console.log('new game ready in', this.roomID);
		this.io.to(this.roomID).emit('game-ready');

		this.players.forEach(player => {
			player.socket.on('player-ready', () => {
				player.isReady = true;
				console.log(`player ${player.id} is ready`);

				// true if allplayer are ready
				const arePlayersReady = this.players.every(player => player.isReady === true);
				if (arePlayersReady) {
					console.log('all players are ready');
					this.gameStart();
				} else {
					let nbReady = this.players.filter(player => player.isReady === true).length;
					console.log(`${nbReady} player ready`);
				}
			});
		});
	}

	gameStart() {
		console.log('game start');
		let delay = 1 + Math.random() * 4 * 1000;
		this.io.to(this.roomID).emit('game-start', delay);

		this.gamePlayers = [...this.players];
		let results = [];

		this.gamePlayers.forEach( player => {
			player.socket.on('result', a => {
				console.log(`player ${player.id} did ${a}`);
				results.push({delay: a, id: player.id});

				if (results.length == this.gamePlayers.length) {
					console.log('get the results of all players');
					this.sortResult(results);
				} else {
					console.log('get the result of only 1 player');
				}
			});
		});
	}

	/**
	 * Sort the results
	 * @param {[{delay, id}]}
	 */
	sortResult(results) {

		results.sort( (a, b) => a.delay - b.delay)
		console.log('sorted result', results);

		this.sendResult(results);


	}


	/**
	 * Sort the results and send to user they score
	 * and enable new game
	 * @param {[{delay, id}]} sorted
	 */
	
	sendResult(results) {
		results.forEach( (result, index) => {
			let player = this.gamePlayers[this.gamePlayers.findIndex(player => player.id == result.id)];
			let winner = index == 0 ? true : false;
			player.socket.emit('result', {rank: index + 1, winner} );
			console.log(`player ${player.id} ${winner ? 'winner' :'loser'}`)
		})
		setTimeout( () => {
			this.init();
		}, 2000);
	}


	/**
	 * Remove user from room when disconnect
	 * @param  {socket}
	 */
	userDisconnect(socket) {
		this.players.splice( this.players.findIndex(player => player.id === socket.id),1);
		console.log(this.players.length, 'players in the room');
	}
}
