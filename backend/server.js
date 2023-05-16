const express = require("express");
const app = express();
const cors = require("cors");
// require('colors');
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
connectDB();
app.use(express.json()); // to accept json data
app.use(cors());
const PORT = process.env.PORT || 5000;

const { userRoute, chatRoute, messageRoute } = require("./routes/index");

const { notFound, errorHandler } = require("./middlewares/handleError");

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`.yellow.bold);
});

// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://127.0.0.1:3000/",
//   },
// });

const io = require("socket.io")(server, {
    transports: ['websocket']
  });

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    // console.log('userData._id', userData)
    socket.emit('connected');
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User joined room : ", room);
  })

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach(user => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  })

  // socket.on('disconnect', () => {
  //   console.log('Client disconnected');
  // });
});
