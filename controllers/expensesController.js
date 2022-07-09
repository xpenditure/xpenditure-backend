const Expenses = require('../models/expensesModel');
const Budget = require('../models/budgetModel');
const { fetchBudgets } = require('./budgetController');
const { ioMessage } = require('../utils/ioMessage');

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

const createExpenses = async (io, socket, expenses) => {
  const userId = socket.decoded_token.id;
  const { name, total, budgetId, narration } = expenses;

  const newExpenses = new Expenses({
    name,
    total,
    narration,
    budget: budgetId,
    user: userId,
  });

  newExpenses.save(async (err, _) => {
    if (err) {
      console.log(err);
      ioMessage(socket, 'Error occured', 'failed');
      return;
    }

    fetchExpenses(io, socket);
    ioMessage(socket, 'Expenses created', 'ok');

    let relatedBudget = await Budget.findById(budgetId);
    relatedBudget.expenses.push(newExpenses);
    await relatedBudget.save((err, _) => {
      if (err) {
        console.log(err);
        return;
      }

      fetchBudgets(io, socket);
    });
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
      ioMessage(socket, 'Error occured', 'failed');
      return;
    }

    ioMessage(socket, 'Expenses updated', 'ok');
    fetchExpenses(io, socket);
  });
};

const deleteExpenses = (io, socket, id) => {
  const userId = socket.decoded_token.id;

  Expenses.findOneAndDelete({ id, user: userId }, (err, _) => {
    if (err) {
      console.log(err);
      ioMessage(socket, 'Error occured', 'failed');
      return;
    }

    ioMessage(socket, 'Expenses deleted', 'ok');
    fetchExpenses(io, socket);
  });
};

module.exports = {
  fetchExpenses,
  createExpenses,
  updateExpenses,
  deleteExpenses,
};
