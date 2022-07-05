const Label = require('../models/labelModel');
const Budget = require('../models/budgetModel');

const { fetchBudgets } = require('./budgetController');

const fetchLabels = (io, socket) => {
  const userId = socket.decoded_token.id;
  Label.find({ user: userId })
    .sort({ createdAt: -1 })
    .exec((err, labels) => {
      if (err) {
        console.log(err);
        return;
      }

      io.sockets.emit('fetchLabels', labels);
    });
};

const createLabel = (io, socket, label) => {
  const userId = socket.decoded_token.id;

  const newLabel = new Label({
    name: label.name,
    user: userId,
  });

  newLabel.save((err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    fetchLabels(io, socket);
  });
};

const updateLabel = (io, socket, label) => {
  const { id, name } = label;
  Label.findByIdAndUpdate(id, { name }, (err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    fetchLabels(io, socket);
  });
};

const deleteLabel = (io, socket, id) => {
  Label.findByIdAndDelete(id, (err, _) => {
    if (err) {
      console.log(err);
      return;
    }
    fetchLabels(io, socket);
  });

  Budget.updateMany(
    { labels: id },
    {
      $pullAll: {
        labels: id,
      },
    }
  );
};

module.exports = {
  fetchLabels,
  createLabel,
  updateLabel,
  deleteLabel,
};
