const mongoose = require('mongoose');

const labelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    alias: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

labelSchema.pre('save', async function () {
  this.alias = this.name.split(' ').join('-');
});

const Label = mongoose.model('Label', labelSchema);
module.exports = Label;
