const {
  createBudget,
  fetchBudgets,
  deleteBudget,
  updateBudget,
  updateColor,
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
  });
};
