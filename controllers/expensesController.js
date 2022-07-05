const Expenses = require('../models/expensesModel');

const fetchExpenses = (io, socket, id) => {
  const userId = socket.decoded_token.id;
  Expenses.find({ id, user: userId }, (err, expenses) => {
    if (err) {
      console.log(err);
      return;
    }

    io.sockets.emit('fetchExpenses', expenses);
  });
};

const createExpenses = (io, socket, expenses) => {
  const userId = socket.decoded_token.id;
  const { name, total, budgetId } = expenses;

  const newExpenses = new Expenses({
    name,
    total,
    budget: budgetId,
    user: userId,
  });

  newExpenses.save((err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    fetchExpenses(io, socket);
  });
};

const updateExpenses = (io, socket, expenses) => {
  const userId = socket.decoded_token.id;
  const { name, total, id } = expenses;

  const updatedExpenses = {
    name,
    total,
  };

  Expenses.findOneAndUpdate({ id, user: userId }, updatedExpenses, (err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    fetchExpenses(io, socket);
  });
};

const deleteExpenses = (io, socket, id) => {
  const userId = socket.decoded_token.id;

  Expenses.findOneAndDelete({ id, user: userId }, (err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    fetchExpenses(io, socket);
  });
};

module.exports = {
  fetchExpenses,
  createExpenses,
  updateExpenses,
  deleteExpenses,
};
