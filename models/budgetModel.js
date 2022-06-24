const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema(
  {
    name: String,
    total: Number,
    summary: String,
    color: String,
  },
  { timestamps: true }
);

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
