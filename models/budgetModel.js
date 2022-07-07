const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    summary: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    funds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fund' }],
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expenses' }],
  },
  { timestamps: true }
);

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
