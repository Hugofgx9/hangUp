import { Server } from 'socket.io';
import Room from './roomManager.js';

export default function socker(server) {

	const io = new Server(server);

	let room = new Room({io: io});



	io.on('connection', (socket) => {
		console.log('user connected');


		room.addUser(socket);

	});

}

/**
 * PROTOCOLE
 * 
 * - 2 utilisateurs se connectent
 * - les 2 utilisateurs sont prêts
 * - les 2 utilisateurs renvoient leur temps
 * - si pas de resulats après x seconde, timeout
 * - renvoyer vainqueur
 *
 */
