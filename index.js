const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");

const authRouter = require("./src/routes/authRouter");
const authMiddleware = require("./src/middleware/authMiddleware")

const app = express();
app.use(express.json());
app.use(authRouter);

const server = http.createServer(app);
const io = socketio(server);
io.use(authMiddleware);

const port = process.env.PORT || 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/CodeParivaar", {
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

io.on('connection', (socket) => {
  console.log("New connection");
})
server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})