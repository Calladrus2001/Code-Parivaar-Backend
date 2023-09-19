const Group = require("../../models/Group");

module.exports = (io) => {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    const email = socket.handshake.headers.email;
    onlineUsers.set(socket.id, email);
    console.log(`${socket.id} connected as ${email}`);

    socket.on("message", (message) => {
      const groupID = message.groupID;
      io.to(groupID).emit(`${groupID}`, message);
      addMsgToGroup(message, email);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      console.log(`${socket.id} disconnected`);
    });
  });
};

const addMsgToGroup = async (message, email) => {
  try {
    const group = await Group.findById(message.groupId);

    if (!group) {
      console.log("Group not found");
      return;
    }
    
    group.messages.push({
      content: message.content,
      senderEmail: email,
      groupId: message.groupId,
    });
    await group.save();
  } catch (e) {
    console.log(e);
  }
};