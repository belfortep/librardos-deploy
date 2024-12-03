const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB CONNECTED');
        return;

    } catch (err) {
        console.log(err);
        return;
    }
}

module.exports = {
    connectDB
}