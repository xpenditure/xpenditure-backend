const {
  createBudget,
  fetchBudgets,
  deleteBudget,
  updateBudget,
  updateColor,
} = require('../controllers/budgetController');

module.exports = (io) => {
  io.sockets.on('connection', (socket) => {
    console.log('new connection');
    socket.on('fetchBudgets', () => {
      fetchBudgets(io);
    });

    socket.on('createBudget', (budget) => {
      createBudget(io, budget);
    });

    socket.on('updateBudget', (budget) => {
      updateBudget(io, budget);
    });

    socket.on('deleteBudget', (id) => {
      deleteBudget(io, id);
    });

    socket.on('color', (color) => {
      updateColor(io, color);
    });

    socket.on('disconnect', () => console.log('disconnected'));
  });
};
