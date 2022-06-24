require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const cors = require('cors');
const { Server } = require('socket.io');
const io = new Server(server);
require('./socket')(io);

const connectDB = require('./configs/db');
connectDB();

const userRoute = require('./routes/userRoute');

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoute);

server.listen(8000, () => {
  console.log('listening on *:8000');
});
