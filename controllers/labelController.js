const Label = require('../models/labelModel');

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

module.exports = {
  fetchLabels,
  createLabel,
};
