module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log("New chat connection");
    //TODO: check for pending messages

    socket.on('message', (message) => {
      console.log(message.sender);
    });
  });
}