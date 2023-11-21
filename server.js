//const io = require('socket.io')(3000)

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

// Create an HTTP server instance
const server = http.createServer(app);

// Set up socket.io with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
});

// Start the server on a specific port
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


const users = {}

io.on('connection', socket => {
 // socket.on('new-user', name => {
   // users[socket.id] = name
    //socket.broadcast.emit('user-connected', name)
  //})
  socket.on('new-user', name => {
    if (name && name.trim() !== '') {
      users[socket.id] = name;
      socket.broadcast.emit('user-connected', name);
    } else {
      console.log(`Invalid name received from socket id: ${socket.id}`);
    }
  });  
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})