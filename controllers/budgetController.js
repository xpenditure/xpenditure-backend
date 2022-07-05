const Budget = require('../models/budgetModel');

const fetchBudgets = (io, socket) => {
  const { id } = socket.decoded_token;
  Budget.find({ user: id })
    .sort({
      createdAt: -1,
    })
    .populate({ path: 'labels', select: 'name' })
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
      return;
    }

    fetchBudgets(io, socket);
  });
};

const updateBudget = (io, socket, budget) => {
  const userId = socket.decoded_token.id;
  const { budgetId, budgetName, budgetTotal, budgetSummary, budgetLabels } =
    budget;

  const updatedBudget = {
    name: budgetName,
    total: budgetTotal,
    summary: budgetSummary,
    labels: budgetLabels,
  };

  Budget.findOneAndUpdate(
    { _id: budgetId, user: userId },
    updatedBudget,
    (err, _) => {
      if (err) {
        console.log(err);
        return;
      }

      fetchBudgets(io, socket);
    }
  );
};

const deleteBudget = (io, socket, id) => {
  const userId = socket.decoded_token.id;
  Budget.findOneAndDelete({ _id: id, user: userId }, (err, _) => {
    if (err) {
      console.log(err);
      return;
    }

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
        return;
      }

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
