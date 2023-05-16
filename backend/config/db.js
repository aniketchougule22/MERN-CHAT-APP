const mongoose = require('mongoose');
require('colors');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB Connected' .blue.bold);
    } catch (error) {
        console.log('error', error);
        process.exit();
    }
}

module.exports = connectDB;