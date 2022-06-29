const mongoose = require('mongoose');

const labelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Label = mongoose.model('Label', labelSchema);
module.exports = Label;
