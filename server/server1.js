const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let rooms = {};

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("join_room", ({ searchTerm, username }) => {
    socket.join(searchTerm);

    if (!rooms[searchTerm]) rooms[searchTerm] = [];
    rooms[searchTerm].push(username);

    io.to(searchTerm).emit("update_users", rooms[searchTerm]);
  });

  socket.on("send_message", ({ searchTerm, username, message }) => {
    io.to(searchTerm).emit("receive_message", { username, message });
  });

  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((user) => user !== socket.id);
      io.to(room).emit("update_users", rooms[room]);
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
