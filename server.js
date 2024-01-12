const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const app = express();

// Multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')  // 파일이 저장될 경로입니다.
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// 서버 및 Socket.IO 설정
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('buttonClicked', (message) => {
    console.log(message);
    socket.emit('hello');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// 업로드 라우트
app.post('/upload', upload.single('file'), (req, res) => {
  console.log('File uploaded');
  res.send('File uploaded successfully!');
});

app.use(express.static(path.join(__dirname)));

server.listen(3000, () => {
  console.log('Listening on *:3000');
});
