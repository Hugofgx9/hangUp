import express from 'express';
import http from 'http';
import path from 'path';
import socker from './socket/socker.js';
//import routes from './routes';
import * as cors from 'cors';

import env from './env.js';

const app = express( cors{
	origin: ['http://localhost:3000']
});
const server = http.Server(app);
socker(server);


if (env.NODE_ENV == 'development') {
	app.get('/', (req, res) => {
		res.sendFile(path.resolve() + '/src/html/file1.html')
	});	
}



server.listen(env.PORT || 3000, () => {
	console.log(`listening on ${env.PORT}`);
});
