const Label = require('../models/labelModel');

const fetchLabels = (io, socket) => {
  const userId = socket.decoded_token.id;
  Label.find({ user: userId }).exec((err, labels) => {
    if (err) {
      console.log(err);
      return;
    }

    io.socket.emit('fetchLabels', labels);
  });
};

module.exports = {
  fetchLabels,
};
