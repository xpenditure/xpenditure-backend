const ioMessage = (socket, message, status) => {
  if (status === 'ok') {
    return socket.emit('message', {
      status: 'success',
      message,
    });
  }

  return socket.emit('message', {
    status: 'failed',
    message: `Error occured`,
  });
};

module.exports = {
  ioMessage,
};
