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
const gmailRoute = require('./routes/gmailRoute');

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoute);
app.use('/gmail', gmailRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log('listening on *:8000');
});
