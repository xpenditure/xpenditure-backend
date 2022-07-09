const {
  createBudget,
  fetchBudgets,
  deleteBudget,
  updateBudget,
  fetchBudgetsByLabel,
  updateBudgetLabel,
} = require('../controllers/budgetController');

const socketioJwt = require('socketio-jwt');
const {
  fetchLabels,
  createLabel,
  updateLabel,
  deleteLabel,
} = require('../controllers/labelController');
const {
  setUserColor,
  setUserBackground,
  uploadAvatar,
  _fetchUserProfile,
} = require('../controllers/userController');
const {
  fetchExpenses,
  createExpenses,
} = require('../controllers/expensesController');
const { fetchFunds, createFund } = require('../controllers/fundController');

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

    socket.on('fetchBudgetsByLabel', (labelId) => {
      fetchBudgetsByLabel(io, socket, labelId);
    });

    socket.on('updateBudgetLabel', (data) => {
      updateBudgetLabel(io, socket, data);
    });

    // Labels socket connections
    socket.on('fetchLabels', () => {
      fetchLabels(io, socket);
    });

    socket.on('createLabel', (label) => {
      createLabel(io, socket, label);
    });

    socket.on('updateLabel', (label) => {
      updateLabel(io, socket, label);
    });

    socket.on('deleteLabel', (id) => {
      deleteLabel(io, socket, id);
    });

    // User socket connections
    socket.on('userColor', (color) => {
      setUserColor(io, socket, color);
    });

    socket.on('userBackground', (color) => {
      setUserBackground(io, socket, color);
    });

    socket.on('uploadAvatar', (url) => {
      uploadAvatar(io, socket, url);
    });

    socket.on('fetchUserProfile', () => {
      _fetchUserProfile(io, socket);
    });

    // Expenses socket connections
    socket.on('fetchExpenses', () => {
      fetchExpenses(io, socket);
    });

    socket.on('createExpenses', (expenses) => {
      createExpenses(io, socket, expenses);
    });

    // Funds socket connections
    socket.on('fetchFunds', (budgetId) => {
      fetchFunds(io, socket, budgetId);
    });

    socket.on('createFund', (fund) => {
      createFund(io, socket, fund);
    });
  });
};
