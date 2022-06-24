const Budget = require('../models/budgetModel');

const fetchBudgets = (io) => {
  Budget.find({})
    .sort({ createdAt: -1 })
    .exec()
    .then((budget) => {
      io.sockets.emit('fetchBudgets', budget);
    })
    .catch((err) => {
      console.log(err);
    });
};

const createBudget = (io, budget) => {
  Budget.create(budget)
    .then(() => fetchBudgets(io))
    .catch((err) => console.log(err));
};

const updateBudget = (io, budget) => {
  Budget.findByIdAndUpdate(budget.id, budget)
    .then(() => fetchBudgets(io))
    .catch((err) => console.log(err));
};

const deleteBudget = (io, id) => {
  Budget.findByIdAndDelete(id)
    .then(() => fetchBudgets(io))
    .catch((err) => console.log(err));
};

const updateColor = (io, color) => {
  Budget.findByIdAndUpdate(color.id, { color: color.color })
    .then(() => fetchBudgets(io))
    .catch((err) => console.log(err));
};

module.exports = {
  createBudget,
  fetchBudgets,
  updateBudget,
  deleteBudget,
  updateColor,
};
