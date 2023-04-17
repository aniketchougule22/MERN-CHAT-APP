const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const connectDB = require('./config/db');
connectDB();
require('colors');

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}` .yellow.bold);
})