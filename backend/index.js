const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5001; // Using 5001 as per instructions
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

require('./src/socket/socketHandler')(io);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
