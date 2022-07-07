const mongoose = require('mongoose');

const fundSchema = mongoose.Schema(
  {
    total: {
      type: Number,
      required: true,
    },
    narration: {
      type: String,
      default: 'Fund added',
    },
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Fund = mongoose.model('Fund', fundSchema);
module.exports = Fund;
