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

io.on("IO connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on('message', (userData) => {
    socket.join(userData._id);
    console.log('userData._id', userData._id)
    socket.emit('socket.io connected');
  });

  // socket.on('disconnect', () => {
  //   console.log('Client disconnected');
  // });
});
