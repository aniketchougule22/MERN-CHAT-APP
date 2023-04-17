const mongoose = require('mongoose');
require('colors');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected' .blue.bold);
    } catch (error) {
        console.log('error', error .red.bold);
        process.exit();
    }
}

module.exports = connectDB;