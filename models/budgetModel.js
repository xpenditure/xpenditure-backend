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
    color: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
