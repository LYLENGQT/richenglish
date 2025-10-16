// /lib/socket.js
const { Server } = require("socket.io");

let io; // we export this after initialization

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"], // your frontend URL(s)
      methods: ["GET", "POST"],
    },
  });

  // socket.io events
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("sendMessage", (data) => {
      // Example data: { senderId, receiverId, text }

      // Save to DB if needed:
      // pool.query(
      //   `INSERT INTO message (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
      //   [data.senderId, data.receiverId, data.text]
      // ).catch(console.error);

      // Emit to receiver instantly
      io.to(data.receiverId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized yet!");
  }
  return io;
}

module.exports = { initSocket, getIO };
