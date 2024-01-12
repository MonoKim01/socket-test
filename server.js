const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
  } else {
    res.end('Hello World!');
  }
});

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('buttonClicked', (message) => {
    console.log(message);
    socket.emit("hello");
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on *:3000');
});
