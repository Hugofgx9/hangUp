//import './database/db';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
//import routes from './routes';
//import cors from 'cors';


const app = express();
const server = http.Server(app);
const io = new Server(server);

app.get('/', (req, res) => {
	res.sendFile(path.resolve() + '/src/html/file1.html')
	//res.send('HeyHey');
});


let playerNb = 0;
let players = [];

io.on('connection', (socket) => {

	if (playerNb < 2) {
		playerNb ++;
		players.push({id: socket.id})
		console.log(players);
		socket.emit('canplay', true);
	}

	else {
		socket.emit('canplay', false);
	}



	console.log('a user connected');
	socket.on('gap', (gap) => {
		console.log(gap);
		io.emit('gap', {id: socket.id, gap: gap});
	});
  socket.on('disconnect', (a) => {

  	players = players.filter(p => p.id !== a.id);
  	console.log(players);

    console.log('user disconnected');
  });
});

server.listen(3000, () => {
	console.log('listening on 3000');
});
