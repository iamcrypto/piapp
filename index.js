const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

// Serve static frontend files
app.use(express.static('public'));

let currentLetterIndex = 0;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected via WebSocket.');

  // Send the current letter to the newly connected user
  if (currentLetterIndex > 0) {
    socket.emit('letter', alphabet[currentLetterIndex - 1]);
  }
});

// Schedule a cron job to emit letters every minute
cron.schedule('*/1 * * * *', () => {
  if (currentLetterIndex < alphabet.length) {
    const letter = alphabet[currentLetterIndex];
    console.log(`Sending letter: ${letter}`);
    io.emit('letter', letter);
    currentLetterIndex++;
  } else {
    console.log('All letters have been sent!');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
