let users = [];

const addUser = (userId, socketId) => {
  users = users.filter(u => u.userId !== userId);
  users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter(u => u.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find(u => u.userId === userId.toString());
};

const initSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ senderId, receiverId, text, messageId, profilePicture }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          sender: senderId,
          text,
          _id: messageId,
          profilePicture
        });
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};

module.exports = {
  initSocket,
  getUser
};
