const express = require('express');
const app = express();
const cors = require('cors');
// require('colors');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
connectDB();
app.use(express.json());    // to accept json data
app.use(cors());
const PORT = process.env.PORT || 5000;

const { userRoute, chatRoute } = require('./routes/index');

const { notFound, errorHandler } = require('./middlewares/handleError');

app.use('/api/user', userRoute);
app.use('/api/chat', chatRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}` .yellow.bold);
});