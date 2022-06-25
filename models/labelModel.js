const mongoose = require('mongoose');

const labelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps }
);

const Label = mongoose.model('Label', labelSchema);
module.exports = Label;
