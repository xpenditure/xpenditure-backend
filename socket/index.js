const {
  createBudget,
  fetchBudgets,
  deleteBudget,
  updateBudget,
  updateBudgeteColor,
} = require('../controllers/budgetController');

const socketioJwt = require('socketio-jwt');

module.exports = (io) => {
  io.use(
    socketioJwt.authorize({
      secret: process.env.JWT_SECRET,
      timeout: 15000,
      handshake: true,
    })
  );

  io.on('connection', (socket) => {
    socket.on('hello', () => {
      console.log('hello there', socket.decoded_token.id);
    });

    socket.on('fetchBudgets', () => {
      fetchBudgets(io, socket);
    });

    socket.on('createBudget', (budget) => {
      createBudget(io, socket, budget);
    });

    socket.on('updateBudget', (budget) => {
      updateBudget(io, socket, budget);
    });

    socket.on('deleteBudget', (id) => {
      deleteBudget(io, socket, id);
    });

    socket.on('budgetColor', (color) => {
      updateBudgeteColor(io, socket, color);
    });
  });
};
