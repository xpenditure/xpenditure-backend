const Budget = require('../models/budgetModel');

const fetchBudgets = (io, socket) => {
  const { id } = socket.decoded_token;
  Budget.find({ user: id })
    .sort({
      createdAt: -1,
    })
    .populate({ path: 'user', select: 'email' })
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
  const { budgetName, budgetTotal, budgetSummary, budgetColor, label } = budget;

  const newBudget = new Budget({
    name: budgetName,
    total: budgetTotal,
    summary: budgetSummary,
    color: budgetColor,
    user: id,
    label,
  });

  newBudget.save((err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    fetchBudgets(io, socket);
  });
};

const updateBudget = (io, socket, budget) => {
  const { id, budgetName, budgetTotal, budgetSummary } = budget;

  const updatedBudget = {
    name: budgetName,
    total: budgetTotal,
    summary: budgetSummary,
  };

  Budget.findByIdAndUpdate(id, updatedBudget, (err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    fetchBudgets(io, socket);
  });
};

const deleteBudget = (io, socket, id) => {
  Budget.findByIdAndDelete(id, (err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    fetchBudgets(io, socket);
  });
};

const updateBudgeteColor = (io, socket, color) => {
  Budget.findByIdAndUpdate(color.id, { color: color.color }, (err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    fetchBudgets(io, socket);
  });
};

const fetchBudgetsByLabel = (io, _, labelId) => {
  Budget.find({ label: labelId })
    .sort({ createdAt: -1 })
    .exec((err, budgets) => {
      if (err) {
        console.log(err);
        return;
      }

      io.sockets.emit('fetchBudgetByLabel', budgets);
    });
};

module.exports = {
  createBudget,
  fetchBudgets,
  updateBudget,
  deleteBudget,
  updateBudgeteColor,
  fetchBudgetsByLabel,
};
