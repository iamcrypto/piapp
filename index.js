const express = require('express');
const cron = require('node-cron');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

// Serve static frontend files
app.use(express.static('public'));

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected via WebSocket.');
});

// Schedule a cron job to notify the frontend every minute
cron.schedule('*/1 * * * *', () => {
  console.log('Cron job triggered!');
  io.emit('alert', 'This is a scheduled alert from the backend!');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
