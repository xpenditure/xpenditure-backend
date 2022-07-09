const Label = require('../models/labelModel');
const Budget = require('../models/budgetModel');
const { ioMessage } = require('../utils/ioMessage');

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
      ioMessage(socket, 'Error occured', 'failed');
      return;
    }

    ioMessage(socket, 'Label created', 'ok');
    fetchLabels(io, socket);
  });
};

const updateLabel = (io, socket, label) => {
  const userId = socket.decoded_token.id;
  const { id, name } = label;
  Label.findOneAndUpdate({ _id: id, user: userId }, { name }, (err, _) => {
    if (err) {
      console.log(err);
      ioMessage(socket, 'Error coccured', 'failed');
      return;
    }

    ioMessage(socket, 'Label updated', 'ok');
    fetchLabels(io, socket);
  });
};

const deleteLabel = (io, socket, id) => {
  const userId = socket.decoded_token.id;
  Label.findOneAndDelete({ _id: id, user: userId }, (err, _) => {
    if (err) {
      console.log(err);
      ioMessage(socket, 'Error occured', 'failed');
      return;
    }

    ioMessage(socket, 'Label deleted', 'ok');
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
