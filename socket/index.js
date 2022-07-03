const {
  createBudget,
  fetchBudgets,
  deleteBudget,
  updateBudget,
  updateBudgeteColor,
  fetchBudgetsByLabel,
} = require('../controllers/budgetController');

const socketioJwt = require('socketio-jwt');
const { fetchLabels, createLabel } = require('../controllers/labelController');
const {
  setUserColor,
  setUserBackground,
} = require('../controllers/userController');

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

    // budgets socket connections
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

    socket.on('fetchBudgetsByLabel', (labelAlias) => {
      fetchBudgetsByLabel(io, socket, labelAlias);
    });

    // Labels socket connections
    socket.on('fetchLabels', () => {
      fetchLabels(io, socket);
    });

    socket.on('createLabel', (label) => {
      createLabel(io, socket, label);
    });

    // User socket connections
    socket.on('userColor', (color) => {
      setUserColor(io, socket, color);
    });

    socket.on('userBackground', (color) => {
      setUserBackground(io, socket, color);
    });
  });
};
