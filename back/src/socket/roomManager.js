export default class Room {
	constructor(opts = { io }) {
		this.io = opts.io;
		this.roomID = 'first-room';
		this.players = [];
	}

	/**
	 * Add a user to se current room
	 * and start the game if there is 2 users
	 * @param {object} socket
	 */
	addUser(socket) {
		socket.join(this.roomID);
		this.players.push({ id: socket.id, socket, isReady: false });

		if (this.players.length == 2) this.gameIsReady();
	}

	/**
	 * Start a game in this room, wait 'is-ready' 
	 * event from each player and then call begin method
	 */
	gameIsReady() {
		console.log('new game ready in', this.roomID);
		this.io.to(this.roomID).emit('game-ready');

		this.players.forEach(player => {
			player.socket.on('player-ready', () => {
				player.isReady = true;
				console.log(`player ${player.id} is ready`);

				const arePlayersReady = this.players.every(player => player.isReady === true);
				if (arePlayersReady) {
					console.log('2 players are ready');
					this.gameStart();
				} else {
					console.log('only one player is ready');
				}
			});
		});
	}

	gameStart() {
		console.log('game start');
		let delay = Math.random() * 5 * 1000;
		this.io.to(this.roomID).emit('game-start', delay);

		let results = [];
		this.players.forEach(player => {
			player.socket.on('result', (a) => {
				console.log(`player ${player.id} did ${a}`);
				results.push({delay: a, id: player.id});

				if (results.length == 2) {
					console.log('get the results of 2 players');
					this.sendResult(results);
				} else {
					console.log('get the result of only 1 player');
				}
			});
		});
	}

	sendResult(results) {

		results.sort( (a, b) => a.delay - b.delay)
		console.log('sorted result', results);


		results.forEach( (result, index) => {
			let player = this.players.find(player => player.id == result.id);
			let winner = index == 0 ? true : false;
			player.socket.emit('result', {rank: index, winner} );
			console.log(`player ${player.id} ${winner ? 'winner' :'loser'}`)
		})
	}

	userDisconnect(socket) {
		
	}


}
