const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
app.use(express.json());    // to accept json data
app.use(cors);
dotenv.config();
const connectDB = require('./config/db');
connectDB();
require('colors');
const PORT = process.env.PORT || 5000;

const { notFound, errorHandler } = require('./middlewares/handleError');
const userRoute = require('./routes/userRoute');

app.use('/api/user', userRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}` .yellow.bold);
});