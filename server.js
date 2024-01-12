const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const http = require('http');
const socketIo = require('socket.io');


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir);
}

// Multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
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
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// 파일 목록 조회 라우트
app.get('/files', (req, res) => {
  fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
    if (err) {
      res.status(500).send('Error reading files');
    } else {
      res.json(files);
    }
  });
});

// 파일 업로드 라우트
app.post('/upload', upload.single('file'), (req, res) => {
  console.log('File uploaded');
  res.redirect('/files');
});

app.use(express.static(path.join(__dirname)));

server.listen(3000, () => {
  console.log('Listening on *:3000');
});
