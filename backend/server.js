const express = require('express');
const dotenv = require('dotenv');
const app = express();
app.use(express.json());    // to accept json data
dotenv.config();
const connectDB = require('./config/db');
connectDB();
require('colors');
const PORT = process.env.PORT || 5000;

const userRoute = require('./routes/userRoute');

app.use('/api/user', userRoute);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}` .yellow.bold);
})