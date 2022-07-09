const Fund = require('../models/fundModel');
const Budget = require('../models/budgetModel');

const { fetchBudgets } = require('../controllers/budgetController');
const { ioMessage } = require('../utils/ioMessage');

const fetchFunds = (io, socket, budgetId) => {
  const userId = socket.decoded_token.id;

  Fund.find({ user: userId, budget: budgetId }, (err, funds) => {
    if (err) {
      console.log(err);
      return;
    }

    io.sockets.emit('fetchFunds', funds);
  });
};

const createFund = async (io, socket, data) => {
  const userId = socket.decoded_token.id;
  const { total, budgetId } = data;
  const newFund = new Fund({
    total,
    budget: budgetId,
    user: userId,
  });

  newFund.save(async (err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    fetchFunds(io, socket, budgetId);

    const relatedBudget = await Budget.findById(budgetId);
    relatedBudget.funds.push(newFund);
    await relatedBudget.save((err, _) => {
      if (err) {
        console.log(err);
        ioMessage(socket, 'Error occured', 'failed');
        return;
      }

      ioMessage(socket, 'Fund added', 'ok');
      fetchBudgets(io, socket);
    });
  });
};

module.exports = {
  fetchFunds,
  createFund,
};
