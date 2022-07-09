const Budget = require('../models/budgetModel');
const Expenses = require('../models/expensesModel');
const Fund = require('../models/fundModel');
const { ioMessage } = require('../utils/ioMessage');

const fetchBudgets = (io, socket) => {
  const { id } = socket.decoded_token;
  Budget.find({ user: id })
    .sort({
      createdAt: -1,
    })
    .populate('labels funds expenses')
    .exec((err, budgets) => {
      if (err) {
        console.log(err);
        return;
      }

      io.sockets.emit('fetchBudgets', budgets);
    });
};

const createBudget = async (io, socket, budget) => {
  const { id } = socket.decoded_token;
  const { budgetName, budgetTotal, budgetSummary, budgetColor, budgetLabels } =
    budget;

  const newBudget = new Budget({
    name: budgetName,
    total: budgetTotal,
    summary: budgetSummary,
    color: budgetColor,
    user: id,
  });

  if (budgetLabels.length > 0) {
    newBudget.labels.push(...budgetLabels);
  }

  newBudget.save((err, _) => {
    if (err) {
      console.log(err);
      ioMessage(socket, 'Error occured', 'failed');
      return;
    }

    ioMessage(socket, 'Budget created', 'ok');
    fetchBudgets(io, socket);
  });
};

const updateBudget = (io, socket, budget) => {
  const userId = socket.decoded_token.id;
  const { budgetId, budgetName, budgetSummary, budgetLabels } = budget;

  const updatedBudget = {
    name: budgetName,
    summary: budgetSummary,
    labels: budgetLabels,
  };

  Budget.findOneAndUpdate(
    { _id: budgetId, user: userId },
    updatedBudget,
    (err, _) => {
      if (err) {
        console.log(err);
        ioMessage(socket, 'Error occured', 'failed');
        return;
      }

      ioMessage(socket, 'Budget updated', 'ok');
      fetchBudgets(io, socket);
    }
  );
};

const deleteBudget = async (io, socket, id) => {
  const userId = socket.decoded_token.id;
  Budget.findOneAndDelete({ _id: id, user: userId }, async (err, _) => {
    if (err) {
      console.log(err);
      ioMessage(socket, 'Error occured', 'failed');
      return;
    }

    // we delete the associating expenses, and
    // funds after deleting the budget itself.
    await Expenses.deleteMany({ budget: id });
    await Fund.deleteMany({ budget: id });

    ioMessage(socket, 'Budget deleted', 'ok');

    fetchBudgets(io, socket);
  });
};

const fetchBudgetsByLabel = (io, socket, labelId) => {
  const userId = socket.decoded_token.id;
  Budget.find({ labels: labelId, user: userId })
    .sort({ createdAt: -1 })
    .populate({ path: 'labels', select: 'name' })
    .exec((err, budgets) => {
      if (err) {
        console.log(err);
        return;
      }

      io.sockets.emit('fetchBudgetsByLabel', budgets);
    });
};

const updateBudgetLabel = (io, socket, data) => {
  const userId = socket.decoded_token.id;
  const { budgetId, labels } = data;
  Budget.findOneAndUpdate(
    { _id: budgetId, user: userId },
    { labels },
    (err, _) => {
      if (err) {
        console.log(err);
        ioMessage(socket, 'Error occured', 'failed');
        return;
      }

      ioMessage(socket, 'Labels changed', 'ok');
      fetchBudgets(io, socket);
    }
  );
};

module.exports = {
  createBudget,
  fetchBudgets,
  updateBudget,
  deleteBudget,
  fetchBudgetsByLabel,
  updateBudgetLabel,
};
