module.exports = (io) => {
  
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    const email = socket.handshake.headers.email;
    onlineUsers.set(socket.id, email);
    console.log(`${socket.id} connected as ${email}`)
    //TODO: check for pending messages

    socket.on('message', (message) => {
      const groupID = message.groupID;
      io.to(groupID).emit(`${groupID}`, message);
      console.log(message);
    });

    socket.on('config', (config) => {
      const groupID = config.groupID;
      socket.join(groupID);
      console.log(`${socket.id} has joined ${config.groupID}`)
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      console.log(`${socket.id} disconnected`);
    });
  });
}