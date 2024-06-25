const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.error('Error connecting to Redis', err);
});

app.use(express.json());

app.post('/topup', (req, res) => {
    const { userId, amount } = req.body;

    redisClient.incrby(userId, amount, (err, newBalance) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        io.emit('balanceUpdated', { userId, newBalance });
        res.send({ userId, newBalance });
    });
});

server.listen(4000, () => {
    console.log('Server is running on port 4000');
});
