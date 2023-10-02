const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 4000;
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });



  socket.on('start_drawing', (data) => {
    console.log("start drawing");
    socket.broadcast.emit('start_drawing', data)
  });

  socket.on('drawing', (data) => {
    
    socket.broadcast.emit('drawing', data);
  });

  socket.on('stop_drawing', (data) => {
    console.log("stop drawing");
    socket.broadcast.emit('stop_drawing', data);
  });


  socket.on('drawing_line', (data) => {
    socket.broadcast.emit('drawing_line', data);
  });

  socket.on('send_message', (message) => {
    // console.log(message);
    socket.broadcast.emit('receive_message', message);
  })


});

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
