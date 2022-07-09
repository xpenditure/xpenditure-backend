require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const cors = require('cors');
const io = require('socket.io')(server);
require('./socket')(io);

const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const connectDB = require('./configs/db');
connectDB();

const userRoute = require('./routes/userRoute');

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoute);

app.get('/api/test', (req, res) => {
  res.send('hello');
});

app.use(notFound);
app.use(errorHandler);

server.listen(8000, () => {
  console.log('listening on *:8000');
});
