// Filename: server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        socket.to(room).emit('message', `${username} has joined the chat`);
    });

    socket.on('chatMessage', ({ room, username, message }) => {
        io.to(room).emit('message', { username, message, time: new Date().toLocaleTimeString() });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
