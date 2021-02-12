import { Server } from 'socket.io';
import Room from './roomManager2.js';

export default function socker(server) {

	const io = new Server(server);

	let room = new Room({io: io});

	io.on('connection', (socket) => {
		console.log('user connected');

    socket.emit('connected');


		room.addUser(socket);

    socket.on('disconnect', socket => {
      console.log('disconnet');
      room.userDisconnect(socket);
    })

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
