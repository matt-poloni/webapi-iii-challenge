const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("It's working");
})

server.use('/api/users', usersRouter);
server.use('/api/posts', postsRouter);

module.exports = server;