const mongoose = require('mongoose');

const expensesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
  },
  { timestamps: true }
);

const Expenses = mongoose.model('Expenses', expensesSchema);
module.exports = Expenses;
